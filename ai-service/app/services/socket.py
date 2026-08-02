import socketio
from datetime import datetime
from models.query_payload import QueryPayload
from queues.query.query_queue import add_query_to_queue


class SockerService:
    def __init__(self, socket_server: socketio.AsyncServer):
        print("Init socker server....")

        self.sio = socket_server
        self.init_listeners()

    def init_listeners(self):

        @self.sio.event
        async def connect():
            print("connected to socketio Server")

        @self.sio.event
        async def disconnect():
            print("connected to socketio Server")

        @self.sio.on("join_session")
        async def join_session_handler(sid, data):
            session_id = data.get("sessionId")

            if not session_id:
                print(f"join_session failed: Missing sessionId from {sid}")
                return

            self.sio.enter_room(sid, room = session_id)
            print(f"Client {sid} joined room: {session_id}")

        @self.sio.on("send_message")
        async def send_message_handler(sid, data):
            session_id:str = data.get("sessionId")
            text:str = data.get("text")
            sent_at:datetime = data.get("sentAt")  
            sender_name:str = data.get("senderName")
            

            if not session_id or not text:
                print(f"send_message failed: Missing payload properties from {sid}")
                return

            payload = QueryPayload(
                session_id,
                sent_at,
                sender_name,
                query = text
            )

            job_id = await add_query_to_queue(payload)
            
            print(f"job added to queue for session_id: {session_id}")
            self.sio.emit("job_enqueued", 
                data = { "jobId": job_id}, 
                room = session_id
            )  
    


async def broadcast_query_response(payload:QueryPayload, sio:socketio.AsyncServer):
    try:
        ai_response = payload.ai_response
        session_id = payload.session_id

        sio.emit("receive_message", data=ai_response, room = session_id)
        print(f"Broadcasted AI response to room {session_id}")

    except Exception as e:
        print(f"Error occured while sending response,{e}")