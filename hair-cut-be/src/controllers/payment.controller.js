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

    // Store the temporary payment info in the database with 'pending' status
    const payment = await prisma.payment.create({
      data: {
        bookingId: bookingId || null,
        amount: amount,
        paymentMethod: 'momo',
        paymentStatus: 'pending', // Set to pending initially
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
    // Check if it's a GET or POST request
    const isGetRequest = req.method === 'GET';
    
    // Extract data from either query params (GET) or request body (POST)
    const data = isGetRequest ? req.query : req.body;
    const { orderId, status, requestId, message } = data;

    console.log(`MoMo payment status ${isGetRequest ? 'check' : 'callback'}:`, data);

    // For GET requests, we only need orderId
    if (isGetRequest) {
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: orderId'
        });
      }    
    } else {
      // For POST requests, we need both orderId and status
      if (!orderId || !status) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: orderId or status' 
        });
      }
    }
    
    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionId: orderId }
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // If it's a GET request, just return the current payment status
    if (isGetRequest) {
      // Ensure the response includes all required fields
      return res.status(200).json({
        success: true,
        data: {
          orderId,
          status: existingPayment.paymentStatus === 'completed' ? 'success' : existingPayment.paymentStatus,
          amount: existingPayment.amount,
          updatedAt: existingPayment.updatedAt.toISOString()
        }
      });
    }

    // For POST requests, update payment status based on MoMo response
    const paymentStatus = status === 'success' ? 'completed' : 'failed';
    
    // Update payment record in database
    const payment = await prisma.payment.update({
      where: { transactionId: orderId },
      data: {
        paymentStatus: paymentStatus,
        responseData: JSON.stringify(data, (key, value) => 
          typeof value === 'bigint' ? value.toString() : value
        ),
        requestId: requestId || null,
        notes: message || existingPayment.notes,
      },
      select: {
        id: true,
        bookingId: true,
        amount: true,
        paymentMethod: true,
        paymentStatus: true,
        provider: true,
        transactionId: true,
        notes: true,
        extraData: true,
        responseData: true,
        requestId: true,
        updatedAt: true
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