from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.socket.socket_service import SockerService
from contextlib import asynccontextmanager
import uvicorn
import socketio
import asyncio
from pydantic import BaseModel

sio = socketio.AsyncServer(
    async_mode='asgi', 
    cors_allowed_origins='*'
)

socket_service = SockerService(sio)

@asynccontextmanager
async def lifespan(app: FastAPI):
    socket_service.init_listeners()

    from app.queues.query.worker import init_worker
    from app.services.pubsub import init_redis_subscribers

    queue_worker = await init_worker()  
    asyncio.create_task(init_redis_subscribers(sio))
    
    yield 
    
    print("Shutting down...")
    await queue_worker.close()

app = FastAPI(
    title="PrismIQ Backend AI Service",
    description="FastAPI server handling Agents, memory and Socket.IO Chat",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

def init():
    uvicorn.run(
        "app.main:socket_app",
        port = 8000,
        host = "0.0.0.0",
        reload = True
    )

@app.get('/healthcheck', tags=["System"])
async def handle_health_check():
    return {
        "status":"ok",
        "code":200,
        "message":"ai-service is up"
    }

if __name__ == "__main__":
    init()