from app.queues.query.query_queue import add_query_to_queue, QueueJobData
from app.services.dataset_services import download_and_dump
from app.models.response_model import AiResponse
from app.models.socket_data_model import SocketData
from app.services.pubsub import publish_user_message
from app.utils.serialize_data import serialize_SocketData_to_MessageModel
from typing import Literal
import socketio


async def send_message_handler(sid, data: SocketData, sio:socketio.AsyncServer):
    session_id:str = data.sessionId
    text:str = data.text
    supabase_file_path:str | None = data.supabaseFilePath
    data_source:Literal["uploaded_dataset", "supabase_file"] = data.dataSource

    if not session_id or not text:
        sio.emit("error", {
            "message":f"send_message failed: Missing payload properties from {sid}"
        })
        print(f"send_message failed: Missing payload properties from {sid}")
        return

    if data_source == "supabase_file" and not supabase_file_path:
        sio.emit("error", {
            "message":f"send_message failed: dataSource is 'supabase_file' but supabaseFilePath is not provided from {sid}"
        })
        print(f"send_message failed: dataSource is 'supabase_file' but supabaseFilePath is not provided from {sid}")
        return


    message_data = serialize_SocketData_to_MessageModel(data)
    await publish_user_message(message_data)

    dumped_file_data = await download_and_dump(supabase_file_path) if data_source == "supabase_file" else None

    job_data = QueueJobData(
        session_id=session_id,
        data_source=data_source,
        dataset_id = dumped_file_data.get("dataset_id") if dumped_file_data else None,
        schema_context = dumped_file_data.get("schema_context") if dumped_file_data else None,
        user_question=text
    )

    job_id = await add_query_to_queue(job_data)

    print(f"job added to queue for session_id: {session_id}")
    sio.emit("job_enqueued", 
        data = { "jobId": job_id}, 
        room = session_id
    )


async def broadcast_ai_response(sio:socketio.AsyncServer, response:AiResponse):
    try:
        ai_response = response
        session_id = response.sessionId

        sio.emit("receive_message", data=ai_response, room = session_id)
        print(f"Broadcasted AI response to room {session_id}")

    except Exception as e:
        print(f"Error occured while sending response,{e}")