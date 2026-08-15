from app.agents.sql_agent.utils.state import GraphState
from app.agents.sql_agent.utils.models import PlannerResponse
from app.agents.sql_agent.prompts.sql_agent_prompt import sql_agent_prompt
from app.agents.sql_agent.agent import sql_planner_llm
from app.services.dataset_services import execute_dataset_query, execute_sql_in_org_db
from app.utils.serialize_data import make_json_serializable
from langchain.messages import SystemMessage, HumanMessage


kpi_store = [
    "CTR",
    "Conversion_Rate",
    "CPC",
    "CPA",
    "ROAS",
    "CPM",
    "Total_Revenue",
    "Total_Spend",
    "Total_Conversions"
]

async def get_schema_context(state:GraphState):
    schema_context = state.get("schema_context")

    if (schema_context==None): raise Exception.add_note("Schema context is missing")
    else: return state

async def plan_query(state:GraphState):

    system_prompt = sql_agent_prompt
    user_prompt = f""" 
        DATASET SCHEMA: {state.get("schema_context")}
        USER QUESTION: {state.get("user_question")}
        KPI STORE: {kpi_store}
    """

    response:PlannerResponse = await sql_planner_llm.ainvoke(
        [
            SystemMessage(
                content = system_prompt
            ),
            HumanMessage(
                content =  user_prompt
            )
        ]
    )

    return {
        **state,
        "intent": response.intent,
        "confidence": response.confidence,
        "response":response.response,

        "main_sql": response.mainSql,
        "kpi_sql": response.kpiSql,

        "kpi_config": [
            kpi.model_dump()
            for kpi in response.kpis
        ],

        "chart_config": response.chart.model_dump(),
        "insight_focus": response.insightFocus,
        "follow_up_questions": response.followUpQuestions,
        "execution_error": response.error,
        "analysisDescription": response.analysisDescription
    }

async def execute_sql(state:GraphState):
    data_source = state.get("data_source")
    kpi_sql = state.get("kpi_sql")
    main_sql = state.get("main_sql")
    dataset_id = state.get("dataset_id")

    main_sql_result = None
    kpi_result = None

    if data_source=="uploaded_dataset":

        if (main_sql!=None):
            main_sql_result = await execute_dataset_query(dataset_id,main_sql)
        if (kpi_sql!=None):
            kpi_result = await execute_dataset_query(dataset_id,kpi_sql)

    else:

        if (main_sql!=None):
            raw_res = await execute_sql_in_org_db(main_sql)
            main_sql_result = make_json_serializable(raw_res)

        if (kpi_sql!=None):
            raw_res = await execute_sql_in_org_db(kpi_sql)
            kpi_result = make_json_serializable(raw_res)

    return {
        **state,
        "sql_query_result": main_sql_result,
        "kpi_result": kpi_result
    }