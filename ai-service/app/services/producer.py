from app.config.kafka import get_producer
from app.models.message_model import MessageModel
from aiokafka import AIOKafkaProducer

KAFKA_QUERY_TOPIC = "KAFKA_QUERY_TOPIC"

async def produce_mesage(message_data:MessageModel):
    try:
        message_data_bytes = message_data.model_dump_json().encode("utf-8")

        producer:AIOKafkaProducer = await get_producer()
        await producer.send_and_wait(KAFKA_QUERY_TOPIC, message_data_bytes)
        
        print(f"Message prodeced to kafka, session_id:{ message_data.sessionId }, time:{message_data.sentAt}")

    except Exception as e:
        print(f" Error while producing message, {e}")