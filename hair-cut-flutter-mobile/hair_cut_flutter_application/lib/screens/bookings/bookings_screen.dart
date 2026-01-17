import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/bookings/bookings_provider.dart';
import '../../models/booking_model.dart';
import '../../core/widgets/loading_widget.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/error_widget.dart' as custom;
import 'package:intl/intl.dart';

class BookingsScreen extends ConsumerStatefulWidget {
  const BookingsScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends ConsumerState<BookingsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(bookingsProvider.notifier).fetchUserBookings();
    });
  }

  String _getStatusText(BookingStatus status) {
    switch (status) {
      case BookingStatus.pending:
        return 'Chờ xác nhận';
      case BookingStatus.confirmed:
        return 'Đã xác nhận';
      case BookingStatus.cancelled:
        return 'Đã hủy';
      case BookingStatus.inProgress:
        return 'Đang thực hiện';
      case BookingStatus.completed:
        return 'Hoàn thành';
      case BookingStatus.success:
        return 'Thành công';
    }
  }

  Color _getStatusColor(BookingStatus status) {
    switch (status) {
      case BookingStatus.pending:
        return Colors.orange;
      case BookingStatus.confirmed:
        return Colors.blue;
      case BookingStatus.cancelled:
        return Colors.red;
      case BookingStatus.inProgress:
        return Colors.purple;
      case BookingStatus.completed:
      case BookingStatus.success:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bookingsState = ref.watch(bookingsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Lịch hẹn của tôi')),
      body: bookingsState.isLoading
          ? const LoadingWidget(text: 'Đang tải...')
          : bookingsState.error != null
          ? custom.ErrorWidget(
              message: bookingsState.error!,
              onRetry: () {
                ref.read(bookingsProvider.notifier).fetchUserBookings();
              },
            )
          : bookingsState.bookings.isEmpty
          ? const EmptyStateWidget(
              message: 'Bạn chưa có lịch hẹn nào',
              icon: Icons.calendar_today_outlined,
            )
          : RefreshIndicator(
              onRefresh: () async {
                await ref.read(bookingsProvider.notifier).fetchUserBookings();
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: bookingsState.bookings.length,
                itemBuilder: (context, index) {
                  final booking = bookingsState.bookings[index];
                  final dateTime = DateTime.parse(booking.appointmentDate);
                  final formattedDate = DateFormat(
                    'dd/MM/yyyy HH:mm',
                  ).format(dateTime);

                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: InkWell(
                      onTap: () {},
                      borderRadius: BorderRadius.circular(12),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Booking #${booking.id}',
                                  style: Theme.of(
                                    context,
                                  ).textTheme.titleMedium,
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _getStatusColor(
                                      booking.status,
                                    ).withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    _getStatusText(booking.status),
                                    style: TextStyle(
                                      color: _getStatusColor(booking.status),
                                      fontWeight: FontWeight.w600,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                const Icon(
                                  Icons.calendar_today,
                                  size: 16,
                                  color: Colors.grey,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  formattedDate,
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(
                                  Icons.location_on,
                                  size: 16,
                                  color: Colors.grey,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    booking.branch.name,
                                    style: Theme.of(
                                      context,
                                    ).textTheme.bodyMedium,
                                  ),
                                ),
                              ],
                            ),
                            if (booking.employee != null) ...[
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  const Icon(
                                    Icons.person,
                                    size: 16,
                                    color: Colors.grey,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    booking.employee!.fullName,
                                    style: Theme.of(
                                      context,
                                    ).textTheme.bodyMedium,
                                  ),
                                ],
                              ),
                            ],
                            const Divider(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Tổng tiền:',
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                                Text(
                                  '${booking.totalPrice}đ',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF8B4513),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
