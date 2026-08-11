import { Router } from 'express'
import { createDashboardHandler, deleteDashboardHandler, getDashboardsHandler } from './dashboard.controllers.js'
import { jwtAuthMiddleware } from '../../middlewares/jwt.middleware'

export const dashboardRouter = Router()

dashboardRouter.post('/save', jwtAuthMiddleware, createDashboardHandler)
dashboardRouter.delete('/delete/:id', jwtAuthMiddleware, deleteDashboardHandler)
dashboardRouter.get('/', jwtAuthMiddleware, getDashboardsHandler)