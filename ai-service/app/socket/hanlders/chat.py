from app.queues.query.query_queue import add_query_to_queue, QueueJobData
from app.services.analytics_services import get_org_db_schema
from app.models.socket_data_model import SocketData
from app.services.pubsub import publish_user_message
from app.utils.serialize_data import serialize_SocketData_to_MessageModel
from typing import Literal
import socketio


async def send_message_handler(sid, socket_data, sio:socketio.AsyncServer):
    try:
        data = SocketData.model_validate(socket_data)

        session_id:str = data.sessionId
        text:str = data.text
        data_source:Literal["workspace", "uploaded_dataset"] = data.dataSource

        if not session_id or not text:
            await sio.emit("error", {
                "message":f"send_message failed: Missing payload properties from {sid}"
            })
            print(f"send_message failed: Missing payload properties from {sid}")
            return

        if (data_source!="workspace"): 
            await sio.emit("error", {
                "message":f"send_message failed: This is not ai_chat_handler socket"
            })
            print(f"send_message failed: This is not ai_chat_handler socket, for {sid}")
            return

        message_data = serialize_SocketData_to_MessageModel(data)
        await publish_user_message(message_data)

        org_db_schema = get_org_db_schema()
        job_data = QueueJobData(
            session_id = session_id,
            data_source = data_source,
            dataset_id = None,
            schema_context = org_db_schema,
            user_question = text
        )

        job_id = await add_query_to_queue(job_data)

        print(f"job added to queue for session_id: {session_id}")
        await sio.emit("job_enqueued", 
            data = { "jobId": job_id}, 
            room = session_id
        )

    except Exception as e:
        print("Error occured in send_message_handler", e)
        await sio.emit("error",{
            "message":"Something went wrong in chat_handler or Query Processing"
        })