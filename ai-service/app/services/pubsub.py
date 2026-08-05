from config.redis import pubsub
from socketio import AsyncServer
from app.models.response_model import AiResponse
from app.models.message_model import MessageModel
from app.socket.hanlders.chat import broadcast_ai_response
from app.services.producer import produce_mesage
from app.utils.serialize_data import serialize_AiResponse_to_MessageModel
import json

MESSAGE_PUBLISHER_CHANNEL = "MESSAGE_PUBLISHER_CHANNEL"

async def publish_user_message(message:MessageModel):
    try:
        message_data_str = json.dumps(message)

        await pubsub.publish(MESSAGE_PUBLISHER_CHANNEL, message_data_str)
        print(f"Message published, query:{message.content}, session_id:{message.sessionId}")

    except Exception as e:
        print(f"Error publishing message: {e}")


async def publish_ai_message(response:AiResponse):
    try:
        message_data = serialize_AiResponse_to_MessageModel(response)
        message_data_str = json.dumps(message_data)

        await pubsub.publish(MESSAGE_PUBLISHER_CHANNEL, message_data_str)
        print(f"Message published, session_id:{response.sessionId}")

    except Exception as e:
        print(f"Error publishing message: {e}")



async def init_redis_subscribers(sio:AsyncServer):
    try:
        await pubsub.subscribe(MESSAGE_PUBLISHER_CHANNEL)
        print("✅ Subscribed to Redis MESSAGES channel")

        subscribed_data = pubsub.listen()
        for data in subscribed_data:
            print(data)
            message:AiResponse = data.get("message")

            await broadcast_ai_response(
                response = message,
                sio = sio
            )

            await produce_mesage(data)
        
    except Exception as e:
        print(f"Error occured in initRedisSubscriber,{e}")