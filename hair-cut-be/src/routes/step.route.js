import express from "express";
import stepController from "../controllers/step.controller.js";
const stepRouter = express.Router();

stepRouter.post("/", ...stepController.createStep);
stepRouter.patch("/order", ...stepController.updateStepOrder);

stepRouter.patch("/:id", ...stepController.updateStep);
stepRouter.delete("/:id", ...stepController.deleteStep);

export default stepRouter;
