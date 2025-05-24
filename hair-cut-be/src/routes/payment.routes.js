import express from 'express'
import paymentController from '../controllers/payment.controller.js'
import { authenticateMiddleware } from "../middlewares/auth.js";

const router = express.Router()

// Create MoMo payment request
router.post('/momo/create', authenticateMiddleware, paymentController.createMomoPayment)

// momo/status 
router.post('/momo/status', authenticateMiddleware, paymentController.momoPaymentStatus)
router.get('/momo/status', paymentController.momoPaymentStatus)
// COD payment
router.post('/cod', authenticateMiddleware, paymentController.createCodPayment)
export default router
