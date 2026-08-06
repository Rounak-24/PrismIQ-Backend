import { Router } from 'express'
import { createDashboardHandler, deleteDashboardHandler, getDashboardsHandler } from './dashboard.controllers.js'


export const dashboardRouter = Router()

dashboardRouter.post('/save', createDashboardHandler)
dashboardRouter.delete('/delete/:id', deleteDashboardHandler)
dashboardRouter.get('/', getDashboardsHandler)