from config.kafka import producer
from app.models.message_model import MessageModel

KAFKA_QUERY_TOPIC = "KAFKA_QUERY_TOPIC"

async def produce_mesage(data:MessageModel):
    try:
        await producer.send(KAFKA_QUERY_TOPIC, data)
        print(f"Message prodeced to kafka, query:{data.content}, res:{data.sessionId}, time:{data.sentAt}, sender:{data.senderName}")

    except Exception as e:
        print(f" Error while producing message, {e}")