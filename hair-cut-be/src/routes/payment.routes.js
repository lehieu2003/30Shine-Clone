import express from 'express'
import paymentController from '../controllers/payment.controller.js'
import { authenticateMiddleware } from "../middlewares/auth.js";

const router = express.Router()

// Create MoMo payment request
router.post('/momo/create', authenticateMiddleware, paymentController.createMomoPayment)

// Handle MoMo return URL
router.get('/momo/return', paymentController.handleMomoReturn)

// Handle MoMo notify URL
router.post('/momo/notify', paymentController.handleMomoNotify)

// Handle MoMo IPN URL
router.post('/momo/ipn', paymentController.handleMomoNotify)

// Check payment status
router.post('/momo/check-status', authenticateMiddleware, paymentController.checkPaymentStatus)

// COD payment
router.post('/cod', authenticateMiddleware, paymentController.createCodPayment)
export default router
