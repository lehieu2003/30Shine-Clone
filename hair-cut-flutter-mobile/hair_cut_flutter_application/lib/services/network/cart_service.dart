import 'package:dio/dio.dart';
import '../network/dio_client.dart';
import '../../models/cart_model.dart';

class CartService {
  final Dio _dio = DioClient().dio;

  Future<Cart> getCart() async {
    try {
      final response = await _dio.get('/api/cart');
      return Cart.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Cart> addToCart(String productId, int quantity) async {
    try {
      final response = await _dio.post(
        '/api/cart',
        data: {'productId': productId, 'quantity': quantity},
      );
      return Cart.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Cart> updateCartItem(String productId, int quantity) async {
    try {
      final response = await _dio.put(
        '/api/cart/$productId',
        data: {'quantity': quantity},
      );
      return Cart.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Cart> removeFromCart(String productId) async {
    try {
      final response = await _dio.delete('/api/cart/$productId');
      return Cart.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
