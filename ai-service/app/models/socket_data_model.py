import datetime
from pydantic import BaseModel
from typing import Literal


class SocketData(BaseModel):
    sessionId: str
    text: str
    sentAt: datetime.datetime
    senderName: str
    dataSource: Literal["uploaded_dataset", "workspace"]
    supabaseFilePath: str | None = None
    clientSideMessageId: str