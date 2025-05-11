import express from "express";
import cartController from "../controllers/cart.controller.js";
import { authenticateMiddleware } from "../middlewares/auth.js";

// All cart routes require authentication
const cartRouter = express.Router();

// Get current cart
cartRouter.get('/', authenticateMiddleware,  cartController.getCart);

// Add item to cart
cartRouter.post('/', authenticateMiddleware, cartController.addToCart);

// Update cart item quantity
cartRouter.put('/:productId', authenticateMiddleware, cartController.updateCartItem);

// Remove item from cart
cartRouter.delete('/:productId',authenticateMiddleware, cartController.removeFromCart);

export default cartRouter;