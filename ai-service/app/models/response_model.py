from pydantic import BaseModel
from datetime import datetime
from app.models.dashboard_model import DashboardModel


class AiResponse(BaseModel):
    sessionId:str
    sender: str = "Ai"
    text: str 
    timestamp: datetime
    dashboard: list[DashboardModel] | None = None
