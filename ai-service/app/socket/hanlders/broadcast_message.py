import socketio
from app.models.message_model import MessageModel

async def broadcast_ai_response(sio:socketio.AsyncServer, response:MessageModel):
    try:
        ai_response = response
        session_id = response.sessionId

        await sio.emit("receive_message", data=ai_response, room = session_id)
        print(f"Broadcasted AI response to room {session_id}")

    except Exception as e:
        print(f"Error occured while sending response to client,{e}")