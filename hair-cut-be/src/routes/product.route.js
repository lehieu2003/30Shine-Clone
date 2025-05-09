import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateMiddleware } from "../middlewares/auth.js";

const productRouter = express.Router();

// Public routes (no authentication required)
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);

// Protected routes (authentication required)
productRouter.post("/", authenticateMiddleware, productController.createProduct);
productRouter.put("/:id", authenticateMiddleware, productController.updateProduct);
productRouter.delete("/:id", authenticateMiddleware, productController.deleteProduct);

// Inventory management routes
productRouter.post("/:id/inventory", authenticateMiddleware, productController.updateInventory);
productRouter.get("/:id/inventory", authenticateMiddleware, productController.getInventoryTransactions);

export default productRouter;
