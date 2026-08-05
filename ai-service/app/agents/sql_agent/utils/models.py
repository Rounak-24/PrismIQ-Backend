from typing import Literal
from pydantic import BaseModel, Field


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


class KPIConfig(BaseModel):
    key: str
    label: str
    format: Literal[
        "number",
        "currency",
        "percentage",
        "ratio"
    ]


class PlannerResponse(BaseModel):
    intent: str

    confidence: float = Field(
        ge=0,
        le=1
    )

    mainSql: str | None = None
    kpiSql: str | None = None
    kpis: list[KPIConfig] = []
    chart: ChartConfig
    insightFocus: list[str] = []
    followUpQuestions: list[str] = []
    error: str | None = None