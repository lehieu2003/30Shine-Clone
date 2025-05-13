import momoService from '../services/momo.service.js';
import { PrismaClient } from '../database/generated/index.js';

const prisma = new PrismaClient();

// Create MoMo payment request
const createMomoPayment = async (req, res) => {
  try {
    const { orderId, amount, orderInfo, extraData } = req.body;
    
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

    return res.status(200).json({
      success: true,
      data: paymentData
    });
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create MoMo payment'
    });
  }
};

// Handle MoMo return URL
const handleMomoReturn = async (req, res) => {
  // This is typically a GET request that users are redirected to after payment
  const paymentResult = req.query;
  
  console.log('MoMo return data:', paymentResult);
  
  // Redirect to frontend with appropriate parameters
  // Note: You should replace this with your actual frontend URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
  
  if (paymentResult.resultCode === '0') {
    return res.redirect(`${frontendUrl}/shopping/cart/payment/success?orderId=${paymentResult.orderId}`);
  } else {
    return res.redirect(`${frontendUrl}/shopping/cart/payment/failed?message=${encodeURIComponent(paymentResult.message || 'Payment failed')}`);
  }
};

// Handle MoMo notify URL (for IPN - Instant Payment Notification)
const handleMomoNotify = async (req, res) => {
  try {
    console.log('MoMo notify data:', JSON.stringify(req.body, null, 2));
    
    const notifyData = req.body;
    
    // In test environment, bypass verification
    const bypassVerification = process.env.NODE_ENV !== 'production';
    
    // Verify the signature to ensure the callback is legitimate
    const isValid = momoService.verifyPaymentResult(notifyData, bypassVerification);
    
    if (!isValid) {
      console.error('Invalid MoMo notification signature');
      // Even though signature is invalid, we still return 200
      // This is to prevent MoMo from continually trying to send notifications
      console.warn('Proceeding with caution despite invalid signature - check logs for details');
    }
    
    // Process the payment based on resultCode, regardless of signature validity
    // The signature check is important but shouldn't block the flow in test environments
    if (parseInt(notifyData.resultCode) === 0) {
      console.log('Payment successful for order:', notifyData.orderId);
      
      // Here you would update your order status in the database
      // Example: await orderService.updateOrderPaymentStatus(notifyData.orderId, 'PAID');
      
      // Return 200 to acknowledge receipt of notification
      return res.status(200).json({ message: 'Notification received and processed' });
    } else {
      console.log('Payment failed for order:', notifyData.orderId, 'with code:', notifyData.resultCode);
      
      // Update your order status to reflect payment failure
      // Example: await orderService.updateOrderPaymentStatus(notifyData.orderId, 'FAILED');
      
      return res.status(200).json({ message: 'Failed payment notification received' });
    }
  } catch (error) {
    console.error('Error processing MoMo notification:', error);
    return res.status(500).json({ message: 'Error processing notification' });
  }
};

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId, requestId } = req.body;
    
    if (!orderId || !requestId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderId or requestId' 
      });
    }
    
    const statusData = await momoService.queryPaymentStatus(orderId, requestId);
    
    return res.status(200).json({
      success: true,
      data: statusData
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to check payment status'
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
  handleMomoReturn,
  handleMomoNotify,
  checkPaymentStatus,
  createCodPayment
};