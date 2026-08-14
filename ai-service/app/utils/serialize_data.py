from app.models.message_model import MessageModel, MESSAGE_SENDER_AI, MESSAGE_SENDER_USER
from app.models.dashboard_model import DashboardModel
from app.models.socket_data_model import SocketData
from app.agents.sql_agent.utils.state import GraphState
from datetime import datetime, timezone
from typing import TypedDict, Any

class FinalKPIResult(TypedDict):
    label: str
    unit: str
    value: int


def serialize_SocketData_to_MessageModel(socket_data:SocketData)->MessageModel:
    return MessageModel(
        sessionId = socket_data.sessionId,  
        content = socket_data.text,
        sentAt = socket_data.sentAt,
        senderName = socket_data.senderName,
        senderType = MESSAGE_SENDER_USER,
        dashboard = None,
        clientSideMessageId = socket_data.clientSideMessageId,
        follow_up_questions = []
    )
    

def serialize_GraphState_to_MessageModel(state:GraphState)->MessageModel:
    
    kpi_config_arr = state.get("kpi_config")
    follow_up_questions = state.get("follow_up_questions")
    chart = state.get("chart_config")

    dashboard_data_dict = None

    if len(kpi_config_arr) is not 0 and chart is not None:
        print("inside loop")
        kpi_result = state.get("kpi_result")
        final_kpi_result:list[dict[str,Any]] = []

        for kpi_config in kpi_config_arr:
            key = kpi_config.get("key")
            label = kpi_config.get("label")
            unit = kpi_config.get("format")
            value = kpi_result[0].get(key)

            final_data = FinalKPIResult(
                label=label,
                unit=unit,
                value=value
            )
            final_kpi_result.append(final_data)

        print(final_kpi_result)
        dashboard_data = DashboardModel(
            title = state.get("analysisDescription"),
            insightFocus = state.get("insight_focus"),
            chart = state.get("chart_config"),
            kpis = final_kpi_result
        )

        dashboard_data_dict = dashboard_data.model_dump()

    message_data = MessageModel(
        sessionId = state.get("session_id"),
        senderType = MESSAGE_SENDER_AI,
        senderName = None,
        sentAt = datetime.now(timezone.utc),
        content = state.get("response") or state.get("planner_error"), 
        dashboard = dashboard_data_dict,
        follow_up_questions = follow_up_questions
    )

    return message_data