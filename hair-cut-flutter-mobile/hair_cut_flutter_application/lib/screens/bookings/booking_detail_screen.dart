import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/network/booking_service.dart';
import '../../models/booking_model.dart';

final bookingDetailProvider = FutureProvider.family<Booking, int>((
  ref,
  id,
) async {
  return await BookingService().getBookingById(id);
});

const statusColors = {
  'pending': Color(0xFFFFA500),
  'confirmed': Color(0xFF4169E1),
  'in_progress': Color(0xFF9370DB),
  'completed': Color(0xFF32CD32),
  'cancelled': Color(0xFFDC143C),
  'success': Color(0xFF32CD32),
};

const statusLabels = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Đã xác nhận',
  'in_progress': 'Đang thực hiện',
  'completed': 'Hoàn thành',
  'cancelled': 'Đã hủy',
  'success': 'Thành công',
};

class BookingDetailScreen extends ConsumerWidget {
  final int bookingId;

  const BookingDetailScreen({Key? key, required this.bookingId})
    : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookingAsync = ref.watch(bookingDetailProvider(bookingId));

    return Scaffold(
      appBar: AppBar(title: const Text('Chi tiết lịch hẹn')),
      body: bookingAsync.when(
        data: (booking) => _buildContent(context, booking),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 80, color: Colors.grey),
              const SizedBox(height: 16),
              Text('Không thể tải thông tin: $error'),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Quay lại'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, Booking booking) {
    final statusValue = booking.status.toString().split('.').last;
    final statusColor = statusColors[statusValue] ?? Colors.grey;
    final statusLabel = statusLabels[statusValue] ?? statusValue;

    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            color: statusColor,
            child: Column(
              children: [
                const Icon(Icons.check_circle, size: 48, color: Colors.white),
                const SizedBox(height: 12),
                Text(
                  statusLabel,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          Card(
            margin: const EdgeInsets.all(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Thông tin đặt lịch',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  _buildInfoRow(
                    Icons.calendar_today,
                    'Ngày giờ hẹn',
                    _formatDateTime(booking.appointmentDate),
                    null,
                  ),
                  const Divider(),
                  _buildInfoRow(
                    Icons.location_on,
                    'Chi nhánh',
                    booking.branch.name,
                    booking.branch.address,
                  ),
                  if (booking.employee != null) ...[
                    const Divider(),
                    _buildInfoRow(
                      Icons.person,
                      'Nhân viên',
                      booking.employee!.fullName,
                      booking.employee!.phone,
                    ),
                  ],
                ],
              ),
            ),
          ),
          Card(
            margin: const EdgeInsets.all(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Dịch vụ',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  if (booking.services != null && booking.services!.isNotEmpty)
                    ...booking.services!.map(
                      (bs) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    bs.service.serviceName,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    '${bs.service.estimatedTime} phút',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              '${bs.servicePrice}đ',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF8B4513),
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    const Text(
                      'Không có dịch vụ nào',
                      style: TextStyle(color: Colors.grey),
                    ),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Tổng cộng',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${booking.totalPrice}đ',
                        style: const TextStyle(
                          fontSize: 24,
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
          if (booking.notes != null && booking.notes!.isNotEmpty)
            Card(
              margin: const EdgeInsets.all(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Ghi chú',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(booking.notes!),
                  ],
                ),
              ),
            ),
          if (booking.customer != null)
            Card(
              margin: const EdgeInsets.all(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Thông tin khách hàng',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      booking.customer!.fullName,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      booking.customer!.phone,
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                    if (booking.customer!.email != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        booking.customer!.email!,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildInfoRow(
    IconData icon,
    String label,
    String value,
    String? subtitle,
  ) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: Colors.grey),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  String _formatDateTime(String dateStr) {
    final date = DateTime.parse(dateStr);
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
