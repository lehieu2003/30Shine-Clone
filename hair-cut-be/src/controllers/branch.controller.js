import {
  processRequestBody,
  processRequestParams,
} from "zod-express-middleware";
import db from "../database/index.js";
import z from "zod";

const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

const updateBranchSchema = branchSchema.partial();

const querySchema = z.object({
  keyword: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  size: z.coerce.number().min(1).max(100).optional(),
  sortBy: z
    .enum([
      "id", 
      "name", 
      "address", 
      "phone", 
      "email", 
      "createdAt", 
      "updatedAt"
    ])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  isActive: z.coerce.boolean().optional(),
});

// Create a new branch
const createBranch = [
  processRequestBody(branchSchema),
  async (req, res) => {
    try {
      const branchData = req.body;
      
      const branch = await db.branch.create({
        data: {
          ...branchData,
          createdAt: new Date(),
        },
      });
      
      return res.status(201).json(branch);
    } catch (err) {
      console.error("Branch creation error:", err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },
];

// Get all branches with filtering, pagination and sorting
const getBranches = [
  processRequestParams(querySchema),
  async (req, res) => {
    try {
      const {
        keyword,
        page,
        size,
        sortBy,
        sortDirection,
        isActive,
      } = req.query;
      
      // Build WHERE clause
      const where = {};
      
      if (keyword) {
        where.OR = [
          { name: { contains: keyword } },
          { address: { contains: keyword } },
          { phone: { contains: keyword } },
          { email: { contains: keyword } },
        ];
      }
      
      if (isActive !== undefined) {
        where.isActive = Boolean(isActive);
      }
      
      // Get total count
      const total = await db.branch.count({ where });
      
      // Use the size from query or default to reasonable limit
      const pageSize = Number(size) || 10;
      const pageNumber = Number(page) || 1;
      
      // Get paginated data with validated parameters
      const branches = await db.branch.findMany({
        where,
        orderBy: { [sortBy || 'createdAt']: sortDirection || 'desc' },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });
      
      return res.json({
        data: branches,
        meta: { total, page: pageNumber, size: pageSize },
      });
    } catch (err) {
      console.error("Get branches error:", err);
      return res.status(500).json({ error: err.message });
    }
  },
];

// Get branch by ID
const getBranchById = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
  
  try {
    const branch = await db.branch.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            employee: true,
          }
        },
      },
    });
    
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    return res.json(branch);
  } catch (err) {
    console.error("Get branch by ID error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Update branch
const updateBranch = [
  processRequestBody(updateBranchSchema),
  async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    
    try {
      // Filter out undefined values
      const data = Object.fromEntries(
        Object.entries(req.body).filter(([_, v]) => v !== undefined)
      );
      
      // Add updated timestamp
      data.updatedAt = new Date();
      
      const branch = await db.branch.update({
        where: { id },
        data,
      });
      
      return res.json(branch);
    } catch (err) {
      console.error("Update branch error:", err);
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Branch not found" });
      }
      return res.status(500).json({ error: err.message });
    }
  },
];

// Delete branch
const deleteBranch = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
  
  try {
    // Check if branch exists
    const branch = await db.branch.findUnique({ where: { id } });
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    
    // Check if branch has associated bookings
    const bookingsCount = await db.booking.count({ where: { branchId: id } });
    if (bookingsCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete branch with associated bookings" 
      });
    }
    
    await db.branch.delete({ where: { id } });
    return res.status(204).end();
  } catch (err) {
    console.error("Delete branch error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export default {
  createBranch,
  getBranches,
  getBranchById: [getBranchById],
  updateBranch,
  deleteBranch: [deleteBranch],
};
