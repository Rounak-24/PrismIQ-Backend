from pydantic import BaseModel
from typing import Literal

class ChartConfig(BaseModel):
    type: Literal[
        "bar",
        "line",
        "pie",
        "scatter",
        "none"
    ]

    xAxis: str | None = None
    yAxis: list[str] = []
    title: str | None = None

class DashboardModel(BaseModel):
    title: str
    insightFocus: list[str] = []
    kpis: list[dict] = []
    chart: ChartConfig