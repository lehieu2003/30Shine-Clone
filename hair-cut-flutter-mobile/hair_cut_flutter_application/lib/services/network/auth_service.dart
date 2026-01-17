import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../network/dio_client.dart';
import '../../models/user_model.dart';

class AuthService {
  final Dio _dio = DioClient().dio;
  final _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/api/auth/login',
        data: {'username': username, 'password': password},
      );

      final accessToken = response.data['accessToken'];
      final user = User.fromJson(response.data['user']);

      await _storage.write(key: 'accessToken', value: accessToken);

      return {'accessToken': accessToken, 'user': user};
    } catch (e) {
      rethrow;
    }
  }

  Future<User> register({
    required String fullName,
    required String email,
    required String password,
    required String phone,
  }) async {
    try {
      final response = await _dio.post(
        '/api/auth/register',
        data: {
          'fullName': fullName,
          'email': email,
          'password': password,
          'phone': phone,
        },
      );

      return User.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<User> getCurrentUser() async {
    try {
      final response = await _dio.get('/api/auth/current');
      return User.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> isPhoneRegistered(String phone) async {
    try {
      final response = await _dio.get(
        '/api/auth/is-phone-registered',
        queryParameters: {'phone': phone},
      );
      return response.data['isRegistered'] ?? false;
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> isEmailRegistered(String email) async {
    try {
      final response = await _dio.get(
        '/api/auth/is-email-registered',
        queryParameters: {'email': email},
      );
      return response.data['isRegistered'] ?? false;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'accessToken');
  }
}
