import socketio
from app.config.redis import redis
from app.services.dataset_services import delete_dataset

def getKey(session_id:str):
    return f"{session_id}:dataset_id"

async def join_session_handler(sio:socketio.AsyncServer, data, sid):
    session_id = data.get("sessionId")
    
    if not session_id:
        print(f"join_session failed: Missing sessionId from {sid}")
        await sio.emit("error", {
            "message":f"join_session failed: Missing sessionId from {sid}"
        })
        return

    await sio.enter_room(sid, room = session_id)
    print(f"Client {sid} joined room: {session_id}")


async def leave_session_handler(sio:socketio.AsyncServer, data, sid):
    session_id = data.get("sessionId")
        
    if not session_id:
        print(f"join_session failed: Missing sessionId from {sid}")
        await sio.emit("error", {
            "message":f"join_session failed: Missing sessionId from {sid}"
        })
        return

    dataset_id = await redis.get(getKey(session_id))

    if dataset_id is not None:
        await delete_dataset(dataset_id)

        await redis.delete(getKey(session_id))

    await sio.leave_room(sid, room = session_id)
    print(f"Client {sid} left room: {session_id}")