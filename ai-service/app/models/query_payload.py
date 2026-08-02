from pydantic import BaseModel
from datetime import datetime

class QueryPayload(BaseModel):
    session_id: str
    query: str
    sent_at: datetime
    sender_name: str
    ai_response: str | None