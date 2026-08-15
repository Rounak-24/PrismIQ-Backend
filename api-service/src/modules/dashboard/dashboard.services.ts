import { prisma } from "../../config/prisma"
import type { IDashboard } from "../../types/interfaces";


export const saveDashboard = async (workspaceId:string, data:IDashboard)=>{
    return await prisma.dashboard.create({
        data:{
            workspaceId: workspaceId,
            title: data.title,
            insights: data.insights,
            kpis: data.kpis,
            charts: data.charts,
            chartData: data.chart_data
        }
    })
}

export const delDashboard = async (id:string)=>{
    await prisma.dashboard.delete({ where: {id: id}})
}

export const getDashboards = async (woekspaceId:string)=>{
    return await prisma.workspace.findUnique({
        where: { id: woekspaceId },
        select:{
            dashboards:{
                select:{
                    id: true,
                    title: true,
                    kpis: true,
                    charts: true,
                    insights: true,
                    createdAt: true
                }
            }
        }
    })
}