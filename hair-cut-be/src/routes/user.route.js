import express from "express";
import userController from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.get("/", ...userController.getListUsers);
userRouter.post("/", ...userController.createUser);
userRouter.put("/:id", ...userController.updateUser);
userRouter.delete("/:id", ...userController.deleteUser);
userRouter.patch(
	"/:id/toggle-availability-status",
	...userController.toggleAvailabilityStatus
);
userRouter.patch("/:id/toggle-status", ...userController.toggleStatus);

export default userRouter;
