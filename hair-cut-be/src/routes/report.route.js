import express from "express";
import reportController from "../controllers/report.controller.js";
const reportRouter = express.Router();

reportRouter.get("/monthly", ...reportController.getMonthlyReport);
reportRouter.get("/service", ...reportController.getServiceReport);

export default reportRouter;
