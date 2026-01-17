import 'package:dio/dio.dart';
import '../network/dio_client.dart';
import '../../models/booking_model.dart';

class BookingService {
  final Dio _dio = DioClient().dio;

  Future<Booking> getBookingById(int bookingId) async {
    try {
      final response = await _dio.get('/api/bookings/$bookingId');
      return Booking.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Booking> createBooking(BookingCreateData bookingData) async {
    try {
      final response = await _dio.post(
        '/api/bookings',
        data: bookingData.toJson(),
      );
      return Booking.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> getUserBookings({
    int page = 1,
    int size = 10,
    String sortBy = 'appointmentDate',
    String sortDirection = 'desc',
    BookingStatus? status,
  }) async {
    try {
      final queryParams = {
        'page': page,
        'size': size,
        'sortBy': sortBy,
        'sortDirection': sortDirection,
      };

      if (status != null) {
        queryParams['status'] = status.toString().split('.').last;
      }

      final response = await _dio.get(
        '/api/bookings/my-bookings',
        queryParameters: queryParams,
      );

      return {
        'success': response.data['success'],
        'data': (response.data['data'] as List)
            .map((json) => Booking.fromJson(json))
            .toList(),
        'meta': response.data['meta'],
      };
    } catch (e) {
      rethrow;
    }
  }
}
