import crypto from 'crypto'
import axios from 'axios'
import dotenv from 'dotenv'

// Ensure environment variables are loaded
dotenv.config()

// Debug current environment variables
console.log('Environment variables for MoMo:')
console.log('MOMO_PARTNER_CODE:', process.env.MOMO_PARTNER_CODE ? 'defined' : 'undefined')
console.log('MOMO_ACCESS_KEY:', process.env.MOMO_ACCESS_KEY ? 'defined' : 'undefined')
console.log('MOMO_SECRET_KEY:', process.env.MOMO_SECRET_KEY ? 'defined' : 'undefined')

const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || '',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api',
  returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3111/shopping',
  notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:3111/api/payment/momo/notify',
  ipnUrl: process.env.MOMO_IPN_URL || 'https://00a0-183-81-125-220.ngrok-free.app/api/payment/momo/ipn',
}

// Log the actual configuration values (partially redacted for security)
console.log('MOMO_CONFIG:')
console.log('partnerCode:', MOMO_CONFIG.partnerCode ? MOMO_CONFIG.partnerCode.substring(0, 4) + '...' : 'empty')
console.log('accessKey:', MOMO_CONFIG.accessKey ? MOMO_CONFIG.accessKey.substring(0, 4) + '...' : 'empty')
console.log('secretKey:', MOMO_CONFIG.secretKey ? 'defined (hidden)' : 'empty')

// Validate required environment variables
const validateConfig = () => {
  const requiredFields = ['partnerCode', 'accessKey', 'secretKey']
  const missingFields = requiredFields.filter(field => !MOMO_CONFIG[field])
  
  if (missingFields.length > 0) {
    console.error(`Missing required MoMo configuration: ${missingFields.join(', ')}`)
    console.error('Current MoMo config (keys only):', Object.keys(MOMO_CONFIG))
    throw new Error(`Missing required MoMo configuration: ${missingFields.join(', ')}`)
  }
}

const generateSignature = (data) => {
  try {
    let rawSignature = '';
    
    // If this is for verification (notification/IPN data from MoMo)
    if (data.resultCode !== undefined || data.transId !== undefined) {
      // For MoMo IPN/notification, we need to build the signature string in a specific order
      // Create an object with only the required fields to avoid duplicates
      const rawData = {};
      
      // Include only fields that exist in the data
      [
        'accessKey', 'amount', 'extraData', 'message', 'orderId', 
        'orderInfo', 'orderType', 'partnerCode', 'payType', 
        'requestId', 'responseTime', 'resultCode', 'transId'
      ].forEach(field => {
        if (data[field] !== undefined) {
          rawData[field] = data[field];
        }
      });
      
      // Sort keys alphabetically
      const sortedKeys = Object.keys(rawData).sort();
      
      // Build signature string with sorted keys
      const signatureParts = sortedKeys.map(key => `${key}=${rawData[key]}`);
      rawSignature = signatureParts.join('&');
    } else {
      // For payment creation
      // Extract parameters needed for signature (using variable names exactly as in MoMo's example)
      const accessKey = data.accessKey || '';
      const amount = data.amount || '';
      const extraData = data.extraData || '';
      const ipnUrl = data.ipnUrl || '';
      const orderId = data.orderId || '';
      const orderInfo = data.orderInfo || '';
      const partnerCode = data.partnerCode || '';
      const redirectUrl = data.redirectUrl || '';
      const requestId = data.requestId || '';
      const requestType = data.requestType || '';

      // Build raw signature string exactly as specified by MoMo
      rawSignature =
        'accessKey=' + accessKey +
        '&amount=' + amount +
        '&extraData=' + extraData +
        '&ipnUrl=' + ipnUrl +
        '&orderId=' + orderId +
        '&orderInfo=' + orderInfo +
        '&partnerCode=' + partnerCode +
        '&redirectUrl=' + redirectUrl +
        '&requestId=' + requestId +
        '&requestType=' + requestType;
    }

    console.log('Raw signature string:', rawSignature);
    
    return crypto
      .createHmac('sha256', MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest('hex');
  } catch (error) {
    console.error('Error generating signature:', error);
    throw new Error('Failed to generate signature');
  }
}

const createPaymentRequest = async (orderInfo) => {
  try {
    validateConfig();

    const {
      orderId,
      amount,
      orderInfo: description,
      extraData = '',
    } = orderInfo;

    if (!orderId || !amount || !description) {
      throw new Error('Missing required fields: orderId, amount, or description');
    }

    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      accessKey: MOMO_CONFIG.accessKey,
      requestId: orderId,
      amount: amount.toString(),
      orderId: orderId,
      orderInfo: description,
      redirectUrl: MOMO_CONFIG.returnUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      extraData: extraData,
      requestType: 'payWithMethod',
      lang: 'vi',
      autoCapture: true,
      orderGroupId: '',
    };

    requestData.signature = generateSignature(requestData);

    console.log('Payment request data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(
      `${MOMO_CONFIG.endpoint}/create`, 
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.resultCode === 0) {
      return {
        payUrl: response.data.payUrl,
        orderId: orderId,
        requestId: requestData.requestId,
      };
    }

    throw new Error(response.data.message || 'Failed to create payment request');
  } catch (error) {
    console.error('MoMo payment request error:', error);
    throw error;
  }
}

const verifyPaymentResult = (data, bypassVerification = false) => {
  try {
    validateConfig();
    
    console.log('Verifying payment result with data:', JSON.stringify(data, null, 2));
    
    // If bypass is enabled, skip verification but still log
    if (bypassVerification) {
      console.log('Signature verification bypassed by configuration');
      return true;
    }
    
    // Get original signature from MoMo response
    const originalSignature = data.signature;
    
    if (!originalSignature) {
      console.error('No signature found in notification data');
      return false;
    }
    
    // Create a clean copy without the signature field
    const { signature, ...dataWithoutSignature } = data;
    
    // Log the secret key (first 4 chars only for security)
    const secretKeyPreview = MOMO_CONFIG.secretKey 
      ? `${MOMO_CONFIG.secretKey.substring(0, 4)}...${MOMO_CONFIG.secretKey.length}`
      : 'undefined';
    console.log('Using secret key (preview):', secretKeyPreview);
    
    // Generate a verification signature
    const calculatedSignature = generateSignature(dataWithoutSignature);
    
    console.log('Original signature from MoMo:', originalSignature);
    console.log('Calculated signature:', calculatedSignature);
    
    // Verify if signatures match
    const isValid = originalSignature === calculatedSignature;
    
    if (!isValid) {
      console.warn('Signature verification failed! Original:', originalSignature, 'Calculated:', calculatedSignature);
      
      // In test mode, we may want to accept the payment anyway for testing
      const isTestMode = process.env.NODE_ENV !== 'production';
      if (isTestMode) {
        console.log('IMPORTANT: Running in test mode - accepting payment despite signature mismatch');
        return true; // Accept the payment in test mode
      }
      
      // Debug - show the final raw signature string that was used
      const rawData = {};
      
      // Include only fields that exist in the data
      [
        'accessKey', 'amount', 'extraData', 'message', 'orderId', 
        'orderInfo', 'orderType', 'partnerCode', 'payType', 
        'requestId', 'responseTime', 'resultCode', 'transId'
      ].forEach(field => {
        if (dataWithoutSignature[field] !== undefined) {
          rawData[field] = dataWithoutSignature[field];
        }
      });
      
      // Sort keys alphabetically
      const sortedKeys = Object.keys(rawData).sort();
      const signatureParts = sortedKeys.map(key => `${key}=${rawData[key]}`);
      
      console.log('Debug - Raw signature string components (sorted):', signatureParts);
    } else {
      console.log('Signature verification successful!');
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying payment result:', error);
    
    // In test mode, accept payments even if verification throws an error
    if (process.env.NODE_ENV !== 'production') {
      console.log('IMPORTANT: Running in test mode - accepting payment despite verification error');
      return true;
    }
    
    return false;
  }
}

const queryPaymentStatus = async (orderId, requestId) => {
  try {
    validateConfig();

    if (!orderId || !requestId) {
      throw new Error('Missing required fields: orderId or requestId');
    }

    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      orderId: orderId,
      lang: 'vi',
      
    };

    const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&orderId=${orderId}&partnerCode=${MOMO_CONFIG.partnerCode}&requestId=${requestId}`;
    
    // Generate the signature using the raw string
    requestData.signature = crypto
      .createHmac('sha256', MOMO_CONFIG.secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log('Query request data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(
      `${MOMO_CONFIG.endpoint}/query`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('MoMo payment query error:', error);
    throw error;
  }
}

export default {
  generateSignature,
  createPaymentRequest,
  verifyPaymentResult,
  queryPaymentStatus,
}
