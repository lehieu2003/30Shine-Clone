import 'package:dio/dio.dart';
import '../network/dio_client.dart';
import '../../models/service_model.dart';

class ServiceService {
  final Dio _dio = DioClient().dio;

  Future<Map<String, dynamic>> fetchServices({
    String keyword = '',
    int page = 1,
    int size = 10,
    String sortBy = 'createdAt',
    String sortDirection = 'desc',
  }) async {
    try {
      final response = await _dio.get(
        '/api/services',
        queryParameters: {
          'keyword': keyword,
          'page': page,
          'size': size,
          'sortBy': sortBy,
          'sortDirection': sortDirection,
        },
      );

      return {
        'data': (response.data['data'] as List)
            .map((json) => ServiceModel.fromJson(json))
            .toList(),
        'meta': response.data['meta'],
      };
    } catch (e) {
      rethrow;
    }
  }

  Future<ServiceModel> getServiceById(int serviceId) async {
    try {
      final response = await _dio.get('/api/services/$serviceId');
      return ServiceModel.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
