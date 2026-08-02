from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.socket import SockerService
import uvicorn
import socketio

app = FastAPI(
    title="PrismIQ Backend AI Service",
    description="FastAPI server handling Agents, memory and Socket.IO Chat",
    version="1.0.0"
)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/healthcheck', tags=["System"])
async def handle_health_check():
    return {
        "status":"ok",
        "code":200,
        "message":"ai-service is up"
    }

sio = socketio.AsyncServer(
    async_mode='asgi', 
    cors_allowed_origins='*'
)

socket_service = SockerService()
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)


async def init():
    uvicorn.run(
        app,
        port = 8000,
        host = "0.0.0.0"
    )

    socket_service.init_listeners()

if __name__ == "__main__":
    init()