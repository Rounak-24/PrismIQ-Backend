from app.config.kafka import get_producer
from app.models.message_model import MessageModel
from app.models.dashboard_model import DashboardModel
from aiokafka import AIOKafkaProducer
from pydantic import BaseModel
from typing import Literal
from datetime import datetime

KAFKA_QUERY_TOPIC = "KAFKA_QUERY_TOPIC"

class KafkaMessage(BaseModel):
    sessionId: str
    content: str | None
    senderType: Literal["Ai", "User"]
    sentAt: datetime
    senderName: str | None
    dashboard: DashboardModel | None

async def produce_mesage(message_data:MessageModel):
    try:
        kafka_message_data = KafkaMessage(
            sessionId = message_data.sessionId,
            content = message_data.content,
            senderName = message_data.senderName,
            senderType = message_data.senderType,
            sentAt = message_data.sentAt,
            dashboard = message_data.dashboard
        )

        kafka_message_bytes = kafka_message_data.model_dump_json().encode("utf-8")

        producer:AIOKafkaProducer = await get_producer()
        await producer.send_and_wait(KAFKA_QUERY_TOPIC, kafka_message_bytes)
        
        print(f"Message prodeced to kafka, session_id:{ message_data.sessionId }, time:{message_data.sentAt}")

    except Exception as e:
        print(f" Error while producing message, {e}")