import express from "express";
import reportController from "../controllers/report.controller.js";
const reportRouter = express.Router();

reportRouter.get("/monthly", ...reportController.getMonthlyReport);
reportRouter.get("/service", ...reportController.getServiceReport);
reportRouter.get("/dashboard", ...reportController.getDashboardStats);
reportRouter.get("/activities", ...reportController.getRecentActivities);

export default reportRouter;
