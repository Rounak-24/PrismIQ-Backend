from bullmq import Worker, Job
from app.queues.query.query_queue import QUERY_QUEUE
from app.queues.query.query_queue import QueueJobData
from app.agents.sql_agent.agent import agent
from app.agents.sql_agent.utils.state import GraphState
from app.config.redis import REDIS_URL
from app.services.pubsub import publish_ai_message
from app.utils.serialize_data import serialize_GraphState_to_AiResponse



async def process_query(job: Job):
    try:
        job_data: QueueJobData = job.data
        print(f"Processing job for session_id: {job_data.session_id}, job_id: {job.id}")

        state:GraphState = GraphState(
            session_id = job_data.session_id,
            data_source = job_data.data_source,  
            dataset_id = job_data.dataset_id,
            schema_context = job_data.schema_context,    
            user_question = job_data.user_question
        )

        config = {
            "configurable": {
                "thread_id": job_data.session_id
            }
        }

        ai_response:GraphState = await agent.ainvoke(state, config=config)
        print("AI response generated", ai_response)
        return ai_response
        

    except Exception as e:
        print(f"Error processing job for session_id: { job_data.session_id }, error: {e}")



async def publish_and_produce_response(job: Job, result: GraphState):
    try:
        job_data:QueueJobData = job.data
        session_id = job_data.session_id
        timestamp = job.finishedOn

        serialized_data = serialize_GraphState_to_AiResponse(
            response = result, 
            session_id = session_id,
            timestamp = timestamp
        )

        await publish_ai_message(serialized_data)
        print(f"Job completed for {session_id}, passed to pub-sub")

    except Exception as e:
        print(f"Error processing after job complition for session_id: { job_data.session_id }, error: {e}")



query_process_worker = Worker(QUERY_QUEUE, process_query, {
    'connection': REDIS_URL or "redis://localhost:6379"
})

query_process_worker.on("completed", publish_and_produce_response)


