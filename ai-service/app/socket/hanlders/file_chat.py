import socketio
from app.models.socket_data_model import SocketData
from app.queues.query.query_queue import add_query_to_queue, QueueJobData
from app.utils.serialize_data import serialize_SocketData_to_MessageModel
from app.services.pubsub import publish_user_message
from app.services.dataset_services import download_and_dump
from app.config.redis import redis


def get_key(session_id:str):
    return f"dataset:{session_id}"


async def file_chat_handler(sio:socketio.AsyncServer, data, sid:str):
    try:
        socket_data = SocketData.model_validate(data)

        session_id:str = socket_data.sessionId
        user_question:str = socket_data.text
        supabase_file_path:str = socket_data.supabaseFilePath

        if not session_id or not user_question:
            await sio.emit("error", {
                "success":False,
                "message":f"send_message failed: Missing payload properties from {sid}",
                "code":"CLIENT_ERROR"
            }, to=sid)
            print(f"send_message failed: Missing payload properties from {sid}")
            return

        if not supabase_file_path:
            await sio.emit("error", {
                "message":f"send_message failed: supabaseFilePath is not provided from {sid}",
                "success":False,
                "code":"CLIENT_ERROR"
            }, to=sid)
            print(f"send_message failed: supabaseFilePath is not provided from {sid}")
            return

        message_data = serialize_SocketData_to_MessageModel(socket_data = socket_data)
        await publish_user_message(message_data)
    
        dataset = await redis.hgetall(get_key(session_id))
        if not dataset:

            dataset = await download_and_dump(supabase_file_path)
            if not dataset: 
                await sio.emit("error",data = {
                    "success":False,
                    "message":"Something went wrong while dumping file data, chat is not posible....",
                    "code":"BACKEND_ERROR"
                }, room=session_id)
                return

            await redis.hset(get_key(session_id), mapping={
                "dataset_id":dataset.get("dataset_id"),
                "schema_context":dataset.get("schema_context")
            })
            print("duckdb has been dumped and dataset_id & schema_context has been cached....")
        else: print("dataset_id & schema_context recieved from cache....")


        job_data = QueueJobData(
            session_id = session_id,
            data_source = "uploaded_dataset",
            dataset_id = dataset.get("dataset_id"),
            user_question = user_question,
            schema_context = dataset.get("schema_context")
        )

        job_id = await add_query_to_queue(job_data)
        print(f"job added to queue for session_id: {session_id}")

        await sio.emit("job_enqueued", 
            data = { "jobId": job_id }, 
            to = sid
        )

    except Exception as e:
        print("Error occured in send_message_handler", e)
        await sio.emit("error",{
            "success":False,
            "message":"Something went wrong in file_chat_handler"
        }, to=sid)