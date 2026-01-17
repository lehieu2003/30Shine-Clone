import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/booking_model.dart';
import '../../services/network/booking_service.dart';

final bookingServiceProvider = Provider<BookingService>(
  (ref) => BookingService(),
);

class BookingsState {
  final List<Booking> bookings;
  final bool isLoading;
  final String? error;

  BookingsState({this.bookings = const [], this.isLoading = false, this.error});

  BookingsState copyWith({
    List<Booking>? bookings,
    bool? isLoading,
    String? error,
  }) {
    return BookingsState(
      bookings: bookings ?? this.bookings,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class BookingsNotifier extends Notifier<BookingsState> {
  @override
  BookingsState build() {
    return BookingsState();
  }

  Future<void> fetchUserBookings({
    int page = 1,
    int size = 10,
    BookingStatus? status,
  }) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final bookingService = ref.read(bookingServiceProvider);
      final result = await bookingService.getUserBookings(
        page: page,
        size: size,
        status: status,
      );
      state = state.copyWith(
        bookings: result['data'] as List<Booking>,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<Booking> createBooking(BookingCreateData bookingData) async {
    try {
      final bookingService = ref.read(bookingServiceProvider);
      final booking = await bookingService.createBooking(bookingData);
      state = state.copyWith(bookings: [booking, ...state.bookings]);
      return booking;
    } catch (e) {
      rethrow;
    }
  }
}

final bookingsProvider = NotifierProvider<BookingsNotifier, BookingsState>(
  () => BookingsNotifier(),
);

final bookingDetailProvider = FutureProvider.family<Booking, int>((
  ref,
  id,
) async {
  final service = ref.watch(bookingServiceProvider);
  return await service.getBookingById(id);
});
