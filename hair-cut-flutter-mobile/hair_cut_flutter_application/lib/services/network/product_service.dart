import 'package:dio/dio.dart';
import '../network/dio_client.dart';
import '../../models/product_model.dart';

class ProductService {
  final Dio _dio = DioClient().dio;

  Future<Map<String, dynamic>> fetchProducts({
    int page = 1,
    int size = 10,
    String? search,
    String? category,
    String? brand,
    double? minPrice,
    double? maxPrice,
    String? sortBy,
  }) async {
    try {
      final queryParams = <String, dynamic>{'page': page, 'size': size};

      if (search != null) queryParams['search'] = search;
      if (category != null) queryParams['category'] = category;
      if (brand != null) queryParams['brand'] = brand;
      if (minPrice != null) queryParams['minPrice'] = minPrice;
      if (maxPrice != null) queryParams['maxPrice'] = maxPrice;
      if (sortBy != null) queryParams['sortBy'] = sortBy;

      final response = await _dio.get(
        '/api/products',
        queryParameters: queryParams,
      );

      return {
        'data': (response.data['data'] as List).map((json) {
          try {
            return Product.fromJson(json);
          } catch (e) {
            rethrow;
          }
        }).toList(),
        'total': response.data['meta']['total'],
        'page': page,
        'size': size,
      };
    } catch (e) {
      rethrow;
    }
  }

  Future<Product> fetchProductById(String id) async {
    try {
      final response = await _dio.get('/api/products/$id');
      return Product.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Product>> searchProducts(String query) async {
    try {
      final response = await _dio.get(
        '/api/products/search',
        queryParameters: {'q': query},
      );
      return (response.data as List)
          .map((json) => Product.fromJson(json))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Product>> getAllProducts() async {
    try {
      final response = await _dio.get('/api/products');
      final data = response.data['data'];
      if (data is List) {
        return data.map((json) => Product.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }
}
