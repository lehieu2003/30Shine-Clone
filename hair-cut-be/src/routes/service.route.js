import express from "express";
import serviceController from "../controllers/service.controller.js";
const serviceRouter = express.Router();

serviceRouter.post("/", ...serviceController.createService);
serviceRouter.get("/", ...serviceController.getServices);
serviceRouter.get("/:id", ...serviceController.getServiceById);
serviceRouter.patch("/:id", ...serviceController.updateService);
serviceRouter.delete("/:id", ...serviceController.deleteService);

export default serviceRouter;
