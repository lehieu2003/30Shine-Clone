import express from 'express'
import paymentController from '../controllers/payment.controller.js'
import { authenticateMiddleware } from "../middlewares/auth.js";

const router = express.Router()

// Create MoMo payment request
router.post('/momo/create', authenticateMiddleware, paymentController.createMomoPayment)

// Create MoMo QR code payment request
router.post('/momo/qr/create', authenticateMiddleware, paymentController.createMomoQRPayment)

// Handle MoMo return URL
router.get('/momo/return', paymentController.handleMomoReturn)

// Handle MoMo notify URL
router.post('/momo/notify', paymentController.handleMomoNotify)

// Handle MoMo IPN URL
router.post('/momo/ipn', paymentController.handleMomoNotify)

export default router
