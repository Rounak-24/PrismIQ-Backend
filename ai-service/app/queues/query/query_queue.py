from bullmq import Queue
from os import getenv
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel
from typing import Literal

QUERY_QUEUE = "QUERY_QUEUE"
QUERY_PROCESS_JOB = "QUERY_PROCESS_JOB"
REDIS_URL = getenv("REDIS_URL")


class QueueJobData(BaseModel):
    session_id: str
    data_source: Literal[
        "workspace",
        "uploaded_dataset"
    ]

    dataset_id: str | None
    schema_context: str | None
    user_question: str


query_queue = Queue(QUERY_QUEUE, { "connection": REDIS_URL or "redis://localhost:6379"})

async def add_query_to_queue(data:QueueJobData):
    try:
        job_data_dict = data.model_dump()

        job = await query_queue.add(QUERY_PROCESS_JOB, job_data_dict)
        print(f"{QUERY_PROCESS_JOB} added to queue, job_id:{job.id}")
        return job.id

    except Exception as e:
        print(f"Error occured while adding query to queue, {e}")