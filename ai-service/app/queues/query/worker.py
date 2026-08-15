from bullmq import Worker, Job
from app.queues.query.query_queue import QUERY_QUEUE
from app.queues.query.query_queue import QueueJobData, remove_job
from app.agents.sql_agent.agent import agent
from app.agents.sql_agent.utils.state import GraphState
from app.config.redis import REDIS_URL
from app.services.pubsub import publish_ai_message
from app.utils.serialize_data import serialize_GraphState_to_MessageModel
import asyncio


async def send_error_to_client(session_id:str, err):
    from app.main import socket_service
    await socket_service.send_error_event(session_id, err)

async def process_query(job: Job, token:str):
    try:
        print("Worker reccieved job.....", job.id)

        job_data = job.data
        print(f"Processing job for session_id: {job_data["session_id"]}, job_id: {job.id}")
        
        state:GraphState = GraphState(
            session_id = job_data["session_id"],
            data_source = job_data["data_source"],  
            dataset_id = job_data["dataset_id"],
            schema_context = job_data["schema_context"],    
            user_question = job_data["user_question"]
        )
        
        config = {
            "configurable": {
                "thread_id": job_data["session_id"]
            }
        }

        try:
            ai_response:GraphState = await agent.ainvoke(state, config=config)
            # print(ai_response)
            return ai_response

        except Exception as e:
            print("Error occured in Langgraph flow")
            await remove_job(job.id)
            raise e
        
    except Exception as e:
        await send_error_to_client(job_data["session_id"], e)
        print(f"Error processing job for session_id: {job_data["session_id"] }, error: {e}")
        raise e


async def publish_and_produce_response(job: Job, result: GraphState):
    try:
        job_data:QueueJobData = job.data
        session_id = job_data["session_id"]
        
        serialized_data = serialize_GraphState_to_MessageModel(result)
        # print(f"data serialized after work completion",serialized_data,"\n\n")
        await publish_ai_message(serialized_data)
        print(f"Job completed for {session_id}")

    except Exception as e:
        await send_error_to_client(job_data["session_id"], e)
        await remove_job(job.id)
        print(f"Error processing after job complition for session_id: { job_data["session_id"] }, error: {e}")
        raise e


async def job_failed_handler(job: Job, err):
    job_data = job.data
    print(f"Job has been failed in queue, job_id:{job.id}", err)
    await send_error_to_client(job_data["session_id"], err)


def handle_completed_event(*args, **kwargs):
    asyncio.create_task(publish_and_produce_response(*args, **kwargs))

def handle_failed_event(*args, **kwargs):
    asyncio.create_task(job_failed_handler(*args, **kwargs))


async def init_worker():
    print("Queue Workers are running....")

    query_process_worker = Worker(QUERY_QUEUE, process_query, {
        'connection': REDIS_URL or "redis://localhost:6379"
    })

    query_process_worker.on("completed", handle_completed_event)
    query_process_worker.on("failed", handle_failed_event )

    return query_process_worker