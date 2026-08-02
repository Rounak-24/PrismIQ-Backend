from bullmq import Worker
from query_queue import QUERY_QUEUE
from models.query_payload import QueryPayload
from agents.sql_agent import get_ai_response
from config.redis import redis
from services.pubsub import publish_query

async def process_query_and_publish(data:QueryPayload):
    try:
        query = data.query

        ai_response = await get_ai_response(query)
        print(ai_response)
        data.ai_response = ai_response

        await publish_query(data)

    except Exception as e:
        print(f"Error occured while processing query to queue, {e}")

query_process_worker = Worker(QUERY_QUEUE, process_query_and_publish, {
    'connection': redis
})