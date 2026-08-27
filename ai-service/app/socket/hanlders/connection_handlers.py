import socketio
from app.config.redis import redis
from app.services.dataset_services import delete_dataset


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

    from app.socket.hanlders.file_chat import get_key

    dataset = await redis.hgetall(get_key(session_id))

    if (len(dataset) != 0):
        try:
            await redis.delete(get_key(session_id))
        except Exception as e:
            print("Sonethig went wrong while deleting cached dataset_id & schema_context....", e)
        finally: delete_dataset(dataset.get("dataset_id"))

        print("dumped duckdb and cached dataset_id & schema_context has been deleted")

    await sio.leave_room(sid, room = session_id)
    print(f"Client {sid} left room: {session_id}")