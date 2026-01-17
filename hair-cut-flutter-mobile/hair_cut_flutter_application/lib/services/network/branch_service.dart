import 'package:dio/dio.dart';
import '../network/dio_client.dart';
import '../../models/branch_model.dart';

class BranchService {
  final Dio _dio = DioClient().dio;

  Future<Map<String, dynamic>> fetchBranches({
    String? keyword,
    int page = 1,
    int size = 20,
    String sortBy = 'createdAt',
    String sortDirection = 'desc',
    bool? isActive,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'size': size,
        'sortBy': sortBy,
        'sortDirection': sortDirection,
      };

      if (keyword != null && keyword.isNotEmpty) {
        queryParams['keyword'] = keyword;
      }
      if (isActive != null) {
        queryParams['isActive'] = isActive;
      }

      final response = await _dio.get(
        '/api/branches',
        queryParameters: queryParams,
      );

      return {
        'data': (response.data['data'] as List)
            .map((json) => Branch.fromJson(json))
            .toList(),
        'total': response.data['meta']['total'],
        'page': response.data['meta']['page'],
        'size': response.data['meta']['size'],
      };
    } catch (e) {
      rethrow;
    }
  }

  Future<Branch> getBranchById(int id) async {
    try {
      final response = await _dio.get('/api/branches/$id');
      return Branch.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
