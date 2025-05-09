import express from "express";
import fileController from "../controllers/file.controller.js";

const fileRouter = express.Router();

// @ts-ignore
fileRouter.post("/upload", ...fileController.uploadSingleFile);
// @ts-ignore
fileRouter.post("/upload-multi", ...fileController.uploadMultipleFiles);
fileRouter.delete("/delete", ...fileController.deleteFile);
export default fileRouter;
