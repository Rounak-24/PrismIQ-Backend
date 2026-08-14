from typing import Literal, TypedDict, Any

class GraphState(TypedDict):
    session_id: str

    data_source: Literal[
        "workspace",
        "uploaded_dataset"
    ]

    dataset_id: str | None
    schema_context: str

    user_question: str

    intent: str
    confidence: float

    main_sql: str | None
    kpi_sql: str | None

    kpi_config: list[dict]
    chart_config: dict

    response: str | None
    insight_focus: list[str]
    follow_up_questions: list[str]
    analysisDescription: str | None

    planner_error: str | None

    sql_query_result: list[dict[str, Any]]
    kpi_result: list[dict[str, Any]]

    execution_error: str | None