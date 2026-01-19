import 'package:dio/dio.dart';
import '../network/dio_client.dart';

class PaymentService {
  final Dio _dio = DioClient().dio;

  /// Create MoMo payment
  Future<Map<String, dynamic>> createMoMoPayment({
    required String orderId,
    required double amount,
    required String orderInfo,
    String? cartId,
  }) async {
    try {
      final response = await _dio.post(
        '/api/payment/momo/create',
        data: {
          'orderId': orderId,
          'amount': amount,
          'orderInfo': orderInfo,
          if (cartId != null) 'cartId': cartId,
        },
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  /// Check MoMo payment status
  Future<Map<String, dynamic>> checkMoMoPaymentStatus(String orderId) async {
    try {
      final response = await _dio.get(
        '/api/payment/momo/status',
        queryParameters: {'orderId': orderId},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  /// Create order with COD payment
  Future<Map<String, dynamic>> createCODOrder({required String cartId}) async {
    try {
      final response = await _dio.post(
        '/api/orders',
        data: {'cartId': cartId, 'paymentMethod': 'cod'},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
