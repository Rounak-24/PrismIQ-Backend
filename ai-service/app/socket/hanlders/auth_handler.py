import jwt
import os
import socketio
from dotenv import load_dotenv
load_dotenv()


async def setup_socket_auth(sid, environ, auth, sio:socketio.AsyncServer):
    token:str = auth.get("token") if auth else None
    if not token:
        print(f"No token provided, refusing socket for id:{sid}")
        socketio.exceptions.ConnectionRefusedError("No token")

    try:
        secret_key:str = os.getenv("JWT_SECRET_KEY")
        decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
        
        await sio.save_session(sid=sid, session={
            "user_id": decoded.get("user_id")
        })

    except Exception as e:
        print("JWT error:", e)
        raise socketio.exceptions.ConnectionRefusedError("Invalid token")