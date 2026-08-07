from app.config.redis import redis, pubsub
from socketio import AsyncServer
from app.models.message_model import MessageModel
from app.socket.hanlders.broadcast_message import broadcast_ai_response
from app.services.producer import produce_mesage
import json

MESSAGE_PUBLISHER_CHANNEL = "MESSAGE_PUBLISHER_CHANNEL"

async def publish_user_message(message:MessageModel):
    try:
        message_data_str = message.model_dump_json()

        await redis.publish(MESSAGE_PUBLISHER_CHANNEL, message_data_str)
        print(f"Message published, query:{message.content}, session_id:{message.sessionId}")

    except Exception as e:
        print(f"Error publishing message: {e}")


async def publish_ai_message(message_data:MessageModel):
    try:
        message_data_str_json = message_data.model_dump_json()
        # print(type(message_data_str_json))     <class 'str'>
        await redis.publish(MESSAGE_PUBLISHER_CHANNEL, message_data_str_json)
        print(f"Message published, session_id:{message_data.sessionId}")

    except Exception as e:
        print(f"Error publishing message: {e}")



async def init_redis_subscribers(sio: AsyncServer):
    try:
        await pubsub.subscribe(MESSAGE_PUBLISHER_CHANNEL)
        print("✅ Subscribed to Redis MESSAGES channel")

        subscribed_data = pubsub.listen()
        
        async for message in subscribed_data:
            try:
                if message.get("type") != "message":
                    continue 
                
                raw_payload = message.get("data")
                
                if raw_payload:
                    # Decode bytes to string if necessary
                    if isinstance(raw_payload, bytes):
                        raw_payload = raw_payload.decode('utf-8')
                    
                    # Parse the JSON
                    parsed_data = json.loads(raw_payload)
                    message_obj = MessageModel(**parsed_data) 
                    
                    await broadcast_ai_response(
                        response = message_obj,
                        sio = sio
                    )

                    await produce_mesage(message_obj)

            except Exception as e:
                print(f"⚠️ Error processing an individual message: {e}")

    except Exception as e:
        print(f"❌ Fatal error in initRedisSubscriber: {e}")