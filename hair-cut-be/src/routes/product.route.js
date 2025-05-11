import express from "express";
import productController from "../controllers/product.controller.js";
import { authenticateMiddleware, isAdmin } from "../middlewares/auth.js";

const productRouter = express.Router();


// Public routes (no authentication required)
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.get("/category/:category", productController.getProductsByCategory);
productRouter.get("/search", productController.searchProducts);

// Admin routes
productRouter.post("/admin", authenticateMiddleware, isAdmin, productController.createProduct);
productRouter.put("/admin/:id", authenticateMiddleware, isAdmin, productController.updateProduct);
productRouter.delete("/admin/:id", authenticateMiddleware, isAdmin, productController.deleteProduct);
productRouter.post("/admin/:id/inventory", authenticateMiddleware, isAdmin, productController.updateInventory);
productRouter.get("/admin/inventory", authenticateMiddleware, isAdmin, productController.getAllInventoryTransactions);
productRouter.get("/admin/inventory/:id", authenticateMiddleware, isAdmin, productController.getInventoryTransactions);

export default productRouter;