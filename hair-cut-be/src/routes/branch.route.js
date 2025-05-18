import { Router } from "express";
import branchController from "../controllers/branch.controller.js";
import { authenticateMiddleware } from "../middlewares/auth.js";

const router = Router();

// Public routes
router.get("/", branchController.getBranches); // Get all branches
router.get("/:id", branchController.getBranchById); // Get branch by ID

// Protected routes
router.post(
  "/", 
  authenticateMiddleware,  branchController.createBranch
); // Create branch

router.put(
  "/:id", 
  authenticateMiddleware, 
  branchController.updateBranch
); // Update branch

router.delete(
  "/:id", 
  authenticateMiddleware,
  branchController.deleteBranch
); // Delete branch (admin only)

export default router;
