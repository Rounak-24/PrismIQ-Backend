from pydantic import BaseModel
from typing import Literal
import datetime
from app.models.dashboard_model import DashboardModel

MESSAGE_SENDER_AI = "Ai"
MESSAGE_SENDER_USER = "User"

class MessageModel(BaseModel):
    sessionId: str
    content: str | None
    senderType: Literal["Ai", "User"]
    sentAt: datetime.datetime
    senderName: str | None
    dashboard: DashboardModel | None
    clientSideMessageId: str | None = None
    follow_up_questions: list[str] = []