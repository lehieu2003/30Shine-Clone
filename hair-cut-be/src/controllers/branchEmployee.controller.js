import { PrismaClient } from '../database/generated/index.js';

const prisma = new PrismaClient();

// Get all branch employees with pagination
export const getAllBranchEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, branchId, employeeId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter conditions
    const where = {};
    if (branchId) where.branchId = parseInt(branchId);
    if (employeeId) where.employeeId = parseInt(employeeId);

    const [branchEmployees, total] = await Promise.all([
      prisma.branchEmployee.findMany({
        skip,
        take: parseInt(limit),
        where,
        include: {
          branch: true,
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              role: true,
              avatarUrl: true,
              availabilityStatus: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      }),
      prisma.branchEmployee.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        branchEmployees,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching branch employees:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch branch employees'
    });
  }
};

// Get branch employee by ID
export const getBranchEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const branchEmployee = await prisma.branchEmployee.findUnique({
      where: { id: parseInt(id) },
      include: {
        branch: true,
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            avatarUrl: true,
            availabilityStatus: true
          }
        }
      }
    });

    if (!branchEmployee) {
      return res.status(404).json({
        status: 'error',
        message: 'Branch employee not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: branchEmployee
    });
  } catch (error) {
    console.error("Error fetching branch employee:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch branch employee'
    });
  }
};

// Create a new branch employee
export const createBranchEmployee = async (req, res) => {
  try {
    const { branchId, employeeId, isMainBranch, startDate, endDate } = req.body;

    // Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: parseInt(branchId) }
    });
    if (!branch) {
      return res.status(400).json({
        status: 'error',
        message: 'Branch not found'
      });
    }

    // Check if employee exists
    const employee = await prisma.user.findUnique({
      where: { id: parseInt(employeeId) }
    });
    if (!employee) {
      return res.status(400).json({
        status: 'error',
        message: 'Employee not found'
      });
    }

    // Check if employee is already assigned to this branch
    const existingAssignment = await prisma.branchEmployee.findFirst({
      where: {
        branchId: parseInt(branchId),
        employeeId: parseInt(employeeId)
      }
    });
    if (existingAssignment) {
      return res.status(409).json({
        status: 'error',
        message: 'Employee is already assigned to this branch'
      });
    }

    // If this is set as main branch, update other assignments
    if (isMainBranch) {
      await prisma.branchEmployee.updateMany({
        where: {
          employeeId: parseInt(employeeId),
          isMainBranch: true
        },
        data: {
          isMainBranch: false
        }
      });
    }

    const branchEmployee = await prisma.branchEmployee.create({
      data: {
        branchId: parseInt(branchId),
        employeeId: parseInt(employeeId),
        isMainBranch: isMainBranch || false,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null
      },
      include: {
        branch: true,
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: branchEmployee
    });
  } catch (error) {
    console.error("Error creating branch employee:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create branch employee'
    });
  }
};

// Update a branch employee
export const updateBranchEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMainBranch, startDate, endDate } = req.body;

    const existingBranchEmployee = await prisma.branchEmployee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBranchEmployee) {
      return res.status(404).json({
        status: 'error',
        message: 'Branch employee not found'
      });
    }

    // If updating to main branch, update other assignments first
    if (isMainBranch) {
      await prisma.branchEmployee.updateMany({
        where: {
          employeeId: existingBranchEmployee.employeeId,
          isMainBranch: true,
          id: { not: parseInt(id) }
        },
        data: {
          isMainBranch: false
        }
      });
    }

    const updatedBranchEmployee = await prisma.branchEmployee.update({
      where: { id: parseInt(id) },
      data: {
        isMainBranch: isMainBranch !== undefined ? isMainBranch : existingBranchEmployee.isMainBranch,
        startDate: startDate ? new Date(startDate) : existingBranchEmployee.startDate,
        endDate: endDate ? new Date(endDate) : existingBranchEmployee.endDate
      },
      include: {
        branch: true,
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: updatedBranchEmployee
    });
  } catch (error) {
    console.error("Error updating branch employee:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update branch employee'
    });
  }
};

// Delete a branch employee
export const deleteBranchEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const branchEmployee = await prisma.branchEmployee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!branchEmployee) {
      return res.status(404).json({
        status: 'error',
        message: 'Branch employee not found'
      });
    }

    await prisma.branchEmployee.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      status: 'success',
      message: 'Branch employee has been deleted'
    });
  } catch (error) {
    console.error("Error deleting branch employee:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete branch employee'
    });
  }
};

// Get employees by branch ID
export const getEmployeesByBranchId = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [branchEmployees, total] = await Promise.all([
      prisma.branchEmployee.findMany({
        where: { branchId: parseInt(branchId) },
        skip,
        take: parseInt(limit),
        include: {
          employee: true
        },
        orderBy: {
          isMainBranch: 'desc'
        }
      }),
      prisma.branchEmployee.count({
        where: { branchId: parseInt(branchId) }
      })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        employees: branchEmployees,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching employees by branch:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch employees by branch'
    });
  }
};

// Get branches by employee ID
export const getBranchesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [branchEmployees, total] = await Promise.all([
      prisma.branchEmployee.findMany({
        where: { employeeId: parseInt(employeeId) },
        skip,
        take: parseInt(limit),
        include: {
          branch: true
        },
        orderBy: {
          isMainBranch: 'desc'
        }
      }),
      prisma.branchEmployee.count({
        where: { employeeId: parseInt(employeeId) }
      })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        branches: branchEmployees,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching branches by employee:", error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch branches by employee'
    });
  }
};
