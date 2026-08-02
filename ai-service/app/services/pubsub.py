from config.redis import pubsub
from models.query_payload import QueryPayload
from socketio import AsyncServer
from services.socket import broadcast_query_response
from services.producer import produce_mesage
import json

MESSAGE_PUBLISHER_CHANNEL = "MESSAGE_PUBLISHER_CHANNEL"

async def publish_query(payload:QueryPayload):
    try:
        payload_str = json.dump(payload)

        await pubsub.publish(MESSAGE_PUBLISHER_CHANNEL, payload_str)
        print(f"Message published, query:{payload.query}, session_id:{payload.session_id}")

    except Exception as e:
        print(f"Error publishing message: {e}")



async def init_redis_subscribers(sio:AsyncServer):
    try:
        await pubsub.subscribe(MESSAGE_PUBLISHER_CHANNEL)
        print("✅ Subscribed to Redis MESSAGES channel")

        subscribed_data = pubsub.listen()
        for data in subscribed_data:
            print(data)
            message = data.get("message")

            await broadcast_query_response(
                payload = message,
                sio = sio
            )

            await produce_mesage(data)
        
        
    except Exception as e:
        print(f"Error occured in initRedisSubscriber,{e}")