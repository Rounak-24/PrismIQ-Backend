from app.models.response_model import AiResponse
from app.models.message_model import MessageModel, MESSAGE_SENDER_AI, MESSAGE_SENDER_USER
from app.models.dashboard_model import DashboardModel
from app.models.socket_data_model import SocketData
from app.agents.sql_agent.utils.state import GraphState
import datetime

def serialize_GraphState_to_AiResponse(
        response:GraphState, session_id:str, timestamp:datetime.datetime
    )-> AiResponse:

    response_dashboard = DashboardModel(
        title = response.get("intent"),
        insightFocus = response.get("insight_focus"),
        kpis = response.get("kpi_result"),
        chart = response.get("chart_config"),
    )

    serialised_data = AiResponse(
        sender = "Ai",
        sessionId = session_id,
        text = response.analysisDescription,
        timestamp = timestamp,
        dashboard = response_dashboard
    )

    return serialised_data


def serialize_AiResponse_to_MessageModel(ai_response:AiResponse)-> MessageModel:
    message_data = MessageModel(
        sessionId = ai_response.sessionId,
        content = ai_response.text,
        senderType = MESSAGE_SENDER_AI,
        sentAt = ai_response.timestamp,
        senderName = None,
        dashboard = [ai_response.dashboard]
    )

    return message_data


def serialize_SocketData_to_MessageModel(socket_data:SocketData)->MessageModel:
    new_message = MessageModel(
        sessionId = socket_data.sessionId,  
        content = socket_data.text,
        sentAt = socket_data.sentAt,
        senderName = socket_data.senderName,
        senderType = MESSAGE_SENDER_USER,
        dashboard = None
    )

    return new_message