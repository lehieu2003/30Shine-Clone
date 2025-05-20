import momoService from '../services/momo.service.js';
import { PrismaClient } from '../database/generated/index.js';

const prisma = new PrismaClient();

// Create MoMo payment request
const createMomoPayment = async (req, res) => {
  try {
    const { orderId, amount, orderInfo, extraData, bookingId } = req.body;
    
    // Validate required fields
    if (!orderId || !amount || !orderInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId, amount, or orderInfo' 
      });
    }

    const paymentData = await momoService.createPaymentRequest({
      orderId,
      amount,
      orderInfo,
      extraData
    });

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId || null,
        amount: amount,
        paymentMethod: 'momo',
        paymentStatus: 'completed',
        transactionId: orderId,
        provider: 'momo',
        notes: orderInfo || 'MoMo payment',
        extraData: extraData || null,
        responseData: JSON.stringify(paymentData),
        requestId: paymentData.requestId || null,
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        ...paymentData,
        paymentId: payment.id
      }
    });
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create MoMo payment'
    });
  }
};

// Handle MoMo payment status callback
const momoPaymentStatus = async (req, res) => {
  try {
    const { orderId, status, requestId } = req.body;

    console.log('MoMo payment status callback:', req.body);

    // Validate required fields
    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId or status' 
      });
    }

    // Update payment record in database
    const payment = await prisma.payment.update({
      where: { transactionId: orderId },
      data: {
        paymentStatus: status,
        responseData: JSON.stringify(req.body),
        requestId: requestId || null,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error updating MoMo payment status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update MoMo payment status'
    });
  }
};

// Create COD payment
const createCodPayment = async (req, res) => {
  try {
    const { orderId, amount, customerInfo, bookingId } = req.body;
    
    // Validate required fields
    if (!orderId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId or amount' 
      });
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId || null,
        amount: amount,
        paymentMethod: 'cash', // Cash corresponds to COD in the PaymentMethod enum
        paymentStatus: 'pending',
        transactionId: orderId,
        notes: customerInfo?.notes || 'COD payment',
        extraData: customerInfo ? JSON.stringify(customerInfo) : null,
      }
    });
    
    const codResponse = {
      orderId,
      amount,
      paymentMethod: 'COD',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      paymentId: payment.id
    };

    return res.status(200).json({
      success: true,
      message: 'COD payment created successfully',
      data: codResponse
    });
  } catch (error) {
    console.error('Error creating COD payment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create COD payment'
    });
  }
};

export default {
  createMomoPayment,
  momoPaymentStatus,
  createCodPayment
};