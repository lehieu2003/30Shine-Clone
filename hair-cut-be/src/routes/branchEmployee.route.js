import express from 'express';
import {
  getAllBranchEmployees,
  getBranchEmployeeById,
  createBranchEmployee,
  updateBranchEmployee,
  deleteBranchEmployee,
  getEmployeesByBranchId,
  getBranchesByEmployeeId,
} from '../controllers/branchEmployee.controller.js';
import { authenticateMiddleware } from "../middlewares/auth.js";


const router = express.Router();

// Base CRUD routes
router.get('/', authenticateMiddleware, getAllBranchEmployees);
router.get('/:id', authenticateMiddleware, getBranchEmployeeById);
router.post('/', authenticateMiddleware, createBranchEmployee);
router.put('/:id', authenticateMiddleware,  updateBranchEmployee);
router.delete('/:id', authenticateMiddleware, deleteBranchEmployee);

// Additional routes
router.get('/branch/:branchId/employees', authenticateMiddleware, getEmployeesByBranchId);
router.get('/employee/:employeeId/branches', authenticateMiddleware, getBranchesByEmployeeId);

export default router;
