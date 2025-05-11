import momoService from '../services/momo.service.js'
import { PrismaClient } from "../database/generated/index.js";
const prisma = new PrismaClient()

const PaymentController = {
  // Create MoMo payment request
  createMomoPayment: async (req, res) => {
    try {
      const { amount, orderInfo } = req.body
      const userId = req.user.id // Assuming you have user info in request

      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}_${userId}`

      // Create payment record in database
      const payment = await prisma.payment.create({
        data: {
          bookingId: null, // You might want to link this to an order/booking
          amount: amount,
          paymentMethod: 'e_wallet',
          paymentStatus: 'pending',
          transactionId: orderId,
          notes: orderInfo,
        },
      })

      // Create MoMo payment request
      const paymentRequest = await momoService.createPaymentRequest({
        orderId: orderId,
        amount: amount,
        orderInfo: orderInfo,
        extraData: JSON.stringify({ paymentId: payment.id }),
      })

      return res.status(200).json({
        success: true,
        data: paymentRequest,
      })
    } catch (error) {
      console.error('Create MoMo payment error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment request',
        error: error.message,
      })
    }
  },

  // Handle MoMo payment return URL
  handleMomoReturn: async (req, res) => {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        signature,
      } = req.query

      // Verify signature
      const isValid = momoService.verifyPaymentResult(req.query)
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature',
        })
      }

      // Query payment status
      const paymentStatus = await momoService.queryPaymentStatus(orderId, requestId)

      // Update payment record
      if (paymentStatus.resultCode === 0) {
        await prisma.payment.update({
          where: {
            transactionId: orderId,
          },
          data: {
            paymentStatus: 'completed',
            notes: JSON.stringify(paymentStatus),
          },
        })

        // Redirect to success page
        return res.redirect('/shopping/cart/payment/success')
      }

      // Redirect to error page
      return res.redirect('/shopping/cart/payment/error')
    } catch (error) {
      console.error('MoMo return handler error:', error)
      return res.redirect('/shopping/cart/payment/error')
    }
  },

  // Handle MoMo IPN (Instant Payment Notification)
  handleMomoNotify: async (req, res) => {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        signature,
      } = req.body

      // Verify signature
      const isValid = momoService.verifyPaymentResult(req.body)
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature',
        })
      }

      // Update payment record
      if (resultCode === 0) {
        await prisma.payment.update({
          where: {
            transactionId: orderId,
          },
          data: {
            paymentStatus: 'completed',
            notes: JSON.stringify(req.body),
          },
        })
      } else {
        await prisma.payment.update({
          where: {
            transactionId: orderId,
          },
          data: {
            paymentStatus: 'failed',
            notes: JSON.stringify(req.body),
          },
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Payment notification processed',
      })
    } catch (error) {
      console.error('MoMo notify handler error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to process payment notification',
        error: error.message,
      })
    }
  },
  // Create MoMo QR code payment request
  createMomoQRPayment: async (req, res) => {
    try {
      console.log('Received request body:', req.body);
      console.log('Authenticated user:', req.user);
      
      const { amount, orderInfo, extraData } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication failed',
        });
      }

      if (!amount || !orderInfo) {
        return res.status(400).json({
          success: false,
          message: 'Amount and orderInfo are required',
        });
      }

      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}_${userId}`;
      
      console.log('Creating QR payment with data:', { amount, orderInfo, userId, orderId });

      try {
        // Create payment record in database
        const payment = await prisma.payment.create({
          data: {
            bookingId: null,
            amount: parseFloat(amount),
            paymentMethod: 'e_wallet',
            paymentStatus: 'pending',
            transactionId: orderId,
            notes: orderInfo,
          },
        });
        
        console.log('Payment record created:', payment);

        // Create payload for MoMo QR payment
        const paymentPayload = {
          orderId: orderId,
          amount: parseFloat(amount),
          orderInfo: orderInfo,
          extraData: JSON.stringify({ 
            paymentId: payment.id, 
            ...(extraData ? JSON.parse(extraData) : {})
          }),
        };
        
        console.log('Sending request to MoMo service:', paymentPayload);

        // Create MoMo QR payment request
        const paymentRequest = await momoService.createQRPaymentRequest(paymentPayload);

        console.log('Received response from MoMo:', paymentRequest);
        
        return res.status(200).json({
          success: true,
          data: paymentRequest,
        });
      } catch (dbError) {
        console.error('Database or MoMo service error:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Internal server error processing payment',
          error: dbError.message,
        });
      }
    } catch (error) {
      console.error('Create MoMo QR payment error:', error);
      console.error('Error stack:', error.stack);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create QR payment request',
        error: error.message,
      });
    }
  }
};

export default PaymentController;