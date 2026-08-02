from bullmq import Queue
from app.config.redis import redis
from services.socket import QueryPayload

QUERY_QUEUE = "QUERY_QUEUE"
QUERY_PROCESS_JOB = "QUERY_PROCESS_JOB"

query_queue = Queue(QUERY_QUEUE, { "connection": redis})

async def add_query_to_queue(data:QueryPayload):
    try:
        job = await query_queue.add(QUERY_PROCESS_JOB, data)
        print(f"{QUERY_PROCESS_JOB} added to queue, job_id:{job.id}")
        return job.id

    except Exception as e:
        print(f"Error occured while adding query to queue, {e}")