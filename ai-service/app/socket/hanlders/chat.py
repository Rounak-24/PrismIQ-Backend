from app.queues.query.query_queue import add_query_to_queue, QueueJobData
from app.services.dataset_services import download_and_dump
from app.models.socket_data_model import SocketData
from app.services.pubsub import publish_user_message
from app.config.redis import redis
from app.utils.serialize_data import serialize_SocketData_to_MessageModel
from typing import Literal
import socketio


def getKey(session_id:str):
    return f"{session_id}:dataset_id"


async def send_message_handler(sid, data: SocketData, sio:socketio.AsyncServer):
    session_id:str = data.sessionId
    text:str = data.text
    supabase_file_path:str | None = data.supabaseFilePath
    data_source:Literal["workspace", "supabase_file"] = data.dataSource

    if not session_id or not text:
        sio.emit("error", {
            "message":f"send_message failed: Missing payload properties from {sid}"
        })
        print(f"send_message failed: Missing payload properties from {sid}")
        return

    if data_source == "uploaded_dataset" and not supabase_file_path:
        sio.emit("error", {
            "message":f"send_message failed: dataSource is 'uploaded_dataset' but supabaseFilePath is not provided from {sid}"
        })
        print(f"send_message failed: dataSource is 'uploaded_dataset' but supabaseFilePath is not provided from {sid}")
        return


    message_data = serialize_SocketData_to_MessageModel(data)
    await publish_user_message(message_data)

    dumped_file_data = None

    if data_source == "uploaded_dataset" and supabase_file_path:
        dumped_file_data = await download_and_dump(supabase_file_path) if data_source == "uploaded_dataset" else None
        await redis.set(getKey(session_id), dumped_file_data.get("dataset_id"))


    job_data = QueueJobData(
        session_id=session_id,
        data_source=data_source,
        dataset_id = dumped_file_data.get("dataset_id") if dumped_file_data else None,
        schema_context = dumped_file_data.get("schema_context") if dumped_file_data else None,
        user_question=text
    )

    job_id = await add_query_to_queue(job_data)

    print(f"job added to queue for session_id: {session_id}")
    await sio.emit("job_enqueued", 
        data = { "jobId": job_id}, 
        room = session_id
    )