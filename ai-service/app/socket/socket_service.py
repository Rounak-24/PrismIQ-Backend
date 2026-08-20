import socketio
from app.models.socket_data_model import SocketData
from app.socket.hanlders.chat import send_message_handler
from app.socket.hanlders.file_chat import file_chat_handler
from app.socket.hanlders.connection_handlers import join_session_handler, leave_session_handler
from app.socket.hanlders.auth_handler import setup_socket_auth


class SockerService:
    def __init__(self, socket_server: socketio.AsyncServer):
        print("Init socker server....")

        self.sio = socket_server

    def init_listeners(self):
        print("socket_listeners are starting.....")


        @self.sio.event
        async def connect(sid, environ, auth):
            await setup_socket_auth(
                sio=self.sio,
                sid=sid, 
                environ=environ, 
                auth=auth
            )
            print("✅connected to socketio Server")

        @self.sio.event
        async def disconnect(sid):
            print(f"disconnected to socketio Server, sid:{sid}")


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
                socket_data = data,
                sio = self.sio
            )   


        @self.sio.on("send_file_message")
        async def send_file_message_handler(sid, data):
            await file_chat_handler(
                sio = self.sio,
                sid = sid,
                data = data
            )

    async def send_error_event(self, session_id:str, err):
        sio = self.sio
        await sio.emit(event = "error", data = {
            "success":False,
            "message":"Something went wrong in socket_service....",
            "code":"BACKEND_ERROR"
        }, room = session_id)
        print("Error event sent", err)