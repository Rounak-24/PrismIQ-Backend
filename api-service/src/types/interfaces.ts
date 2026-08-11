import {type messageSender, userStatus } from "./enums"


export interface IMessage{
    sessionId: string
    content?: string 
    senderType: messageSender
    sentAt: Date
    senderName?: string
    dashboard?: Record<string,any>
}


export interface IDashboard {
    title: string,
    kpis: Record<string,any>[],
    charts: [
        {
            type: string,
            title: string,
            "xKey": string,
            "yKey": string,
            "data": Record<string,any>[]
        }
    ],
    "insights": [string],
    "follow_up_questions"?: [string]
}


export interface IcachedUser {
    emailVerified:  boolean,
    isActive:       userStatus,
    refreshToken:   string | null,
    workspaces:     any[] | null
}


