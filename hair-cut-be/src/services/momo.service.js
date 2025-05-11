import crypto from 'crypto'
import axios from 'axios'

const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api',
  returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3111/shopping/cart/payment/momo/return',
  notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:3111/api/payment/momo/notify',
  ipnUrl: process.env.MOMO_IPN_URL || 'http://localhost:3111/api/payment/momo/ipn',
}

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
    // Remove signature if exists
    const { signature, ...rest } = data

    // Sort keys alphabetically
    const sortedData = Object.keys(rest)
      .sort()
      .reduce((acc, key) => {
        acc[key] = rest[key]
        return acc
      }, {})

    // Create signature string
    const signData = Object.entries(sortedData)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    // Create HMAC SHA256 hash
    return crypto
      .createHmac('sha256', MOMO_CONFIG.secretKey)
      .update(signData)
      .digest('hex')
  } catch (error) {
    console.error('Error generating signature:', error)
    throw new Error('Failed to generate signature')
  }
}

const createPaymentRequest = async (orderInfo) => {
  try {
    validateConfig()

    const {
      orderId,
      amount,
      orderInfo: description,
      extraData = '',
    } = orderInfo

    if (!orderId || !amount || !description) {
      throw new Error('Missing required fields: orderId, amount, or description')
    }

    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: orderId,
      amount: amount.toString(),
      orderId: orderId,
      orderInfo: description,
      redirectUrl: MOMO_CONFIG.returnUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      extraData: extraData,
      requestType: 'captureWallet',
      lang: 'vi',
    }

    requestData.signature = generateSignature(requestData)

    const response = await axios.post(
      `${MOMO_CONFIG.endpoint}/create`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.data.resultCode === 0) {
      return {
        payUrl: response.data.payUrl,
        orderId: orderId,
        requestId: requestData.requestId,
      }
    }

    throw new Error(response.data.message || 'Failed to create payment request')
  } catch (error) {
    console.error('MoMo payment request error:', error)
    throw error
  }
}

const createQRPaymentRequest = async (orderInfo) => {
  try {
    // Log the inputs
    console.log('Starting QR payment request with info:', JSON.stringify(orderInfo, null, 2));
    
    // Validate the configuration
    validateConfig()

    const {
      orderId,
      amount,
      orderInfo: description,
      extraData = '',
    } = orderInfo

    if (!orderId || amount === undefined || !description) {
      throw new Error('Missing required fields: orderId, amount, or description')
    }

    // Log MOMO_CONFIG keys (without sensitive values)
    console.log('Using MoMo configuration with keys:', Object.keys(MOMO_CONFIG));
    console.log('Endpoint:', MOMO_CONFIG.endpoint);
    
    // Ensure amount is properly formatted as a string
    const formattedAmount = parseInt(amount).toString();

    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: orderId,
      amount: formattedAmount,
      orderId: orderId,
      orderInfo: description,
      redirectUrl: MOMO_CONFIG.returnUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      extraData: extraData ? extraData.toString() : '',
      requestType: 'captureWallet',
      lang: 'vi',
      qrCodeType: '2',
    }

    console.log('Request data before signature:', JSON.stringify(requestData, null, 2));
    
    console.log('Generating signature for request data');
    requestData.signature = generateSignature(requestData)

    console.log('Sending request to MoMo API at:', `${MOMO_CONFIG.endpoint}/create`);
    console.log('Full request data:', JSON.stringify(requestData, null, 2));
    
    const response = await axios.post(
      `${MOMO_CONFIG.endpoint}/create`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Received response from MoMo API:', JSON.stringify(response.data, null, 2));

    if (response.data.resultCode === 0) {
      return {
        qrCodeUrl: response.data.qrCodeUrl,
        orderId: orderId,
        requestId: requestData.requestId,
        payUrl: response.data.payUrl
      }
    }

    throw new Error(`MoMo API error: ${response.data.message || 'Unknown error'} (Code: ${response.data.resultCode})`)
  } catch (error) {
    console.error('MoMo QR payment request error:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('MoMo API response error data:', error.response.data);
      console.error('MoMo API response status:', error.response.status);
      console.error('MoMo API response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('MoMo API no response received, request:', error.request);
    }
    
    throw error
  }
}

const verifyPaymentResult = (data) => {
  try {
    validateConfig()
    const signature = data.signature
    const calculatedSignature = generateSignature(data)
    return signature === calculatedSignature
  } catch (error) {
    console.error('Error verifying payment result:', error)
    return false
  }
}

const queryPaymentStatus = async (orderId, requestId) => {
  try {
    validateConfig()

    if (!orderId || !requestId) {
      throw new Error('Missing required fields: orderId or requestId')
    }

    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      accessKey: MOMO_CONFIG.accessKey,
      requestId: requestId,
      orderId: orderId,
      lang: 'vi',
    }

    requestData.signature = generateSignature(requestData)

    const response = await axios.post(
      `${MOMO_CONFIG.endpoint}/query`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('MoMo payment query error:', error)
    throw error
  }
}

export default {
  generateSignature,
  createPaymentRequest,
  createQRPaymentRequest,
  verifyPaymentResult,
  queryPaymentStatus,
}
