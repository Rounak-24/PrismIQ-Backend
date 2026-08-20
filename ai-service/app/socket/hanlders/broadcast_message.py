import socketio
from app.models.message_model import MessageModel

async def broadcast_ai_response(sio:socketio.AsyncServer, response:MessageModel):
    try:
        ai_response = response
        ai_response_json = ai_response.model_dump_json()
        # print(ai_response_json)
        session_id = response.sessionId

        await sio.emit("receive_message", data=ai_response_json, room = session_id)
        print(f"Broadcasted message to room {session_id}")

    except Exception as e:
        print(f"Error occured in broadcast_ai_response while sending response to client,{e}")
        await sio.emit("error",{
            "message":"Something went wrong while getting response"
        })