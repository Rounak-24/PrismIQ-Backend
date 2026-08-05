import socketio
from datetime import datetime
from app.models.response_model import QueryPayload
from app.models.socket_data_model import SocketData
from app.queues.query.query_queue import add_query_to_queue
from app.socket.hanlders.chat import send_message_handler


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
                self.sio.emit("error", {
                    "message":f"join_session failed: Missing sessionId from {sid}"
                })
                return

            self.sio.enter_room(sid, room = session_id)
            print(f"Client {sid} joined room: {session_id}")

        @self.sio.on("send_message")
        async def send_message(sid, data:SocketData):
            await send_message_handler(
                sid = sid,
                data = data,
                sio = self.sio
            )

        