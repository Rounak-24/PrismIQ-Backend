from config.kafka import producer
from models.query_payload import QueryPayload

KAFKA_QUERY_TOPIC = "KAFKA_QUERY_TOPIC"

async def produce_mesage(data:QueryPayload):
    try:
        await producer.send(KAFKA_QUERY_TOPIC, data)
        print(f"Message prodeced to kafka, query:{data.query}, res:{data.session_id}")

    except Exception as e:
        print(f" Error while producing message, {e}")