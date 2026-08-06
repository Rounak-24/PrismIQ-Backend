import socketio
from app.models.socket_data_model import SocketData
from app.socket.hanlders.chat import send_message_handler
from app.socket.hanlders.connection_handlers import join_session_handler, leave_session_handler


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
        async def join_session(sid, data):
            await join_session_handler(self.sio, data, sid)


        @self.sio.on("leave_session")
        async def leave_session(sid, data):
            await leave_session_handler(self.sio, data, sid)


        @self.sio.on("send_message")
        async def send_message(sid, data:SocketData):
            await send_message_handler(
                sid = sid,
                data = data,
                sio = self.sio
            )

        