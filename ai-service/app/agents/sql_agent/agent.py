from langchain_google_genai import ChatGoogleGenerativeAI
from app.agents.sql_agent.utils.models import PlannerResponse
from app.agents.sql_agent.utils.state import GraphState
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
import os
from dotenv import load_dotenv
load_dotenv()


llm = ChatGoogleGenerativeAI(
    model = "gemini-3.6-flash",
    api_key = os.getenv("GEMINI_API_KEY"),
)

sql_planner_llm = llm.with_structured_output(
    schema = PlannerResponse
)


from app.agents.sql_agent.utils.nodes import plan_query, execute_sql, get_schema_context

agent_builder = StateGraph(GraphState)

agent_builder.add_node("get_schema_context", get_schema_context)
agent_builder.add_node("plan_query",plan_query)
agent_builder.add_node("execute_sql",execute_sql)

agent_builder.add_edge(START,"get_schema_context")
agent_builder.add_edge("get_schema_context","plan_query")
agent_builder.add_edge("plan_query","execute_sql")
agent_builder.add_edge("execute_sql", END)


checkpointer = MemorySaver()

agent = agent_builder.compile(checkpointer=checkpointer)

