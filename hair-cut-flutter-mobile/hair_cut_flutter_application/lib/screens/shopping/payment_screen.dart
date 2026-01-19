import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../features/cart/cart_provider.dart';
import '../../services/network/payment_service.dart';

final paymentServiceProvider = Provider<PaymentService>(
  (ref) => PaymentService(),
);

class PaymentScreen extends ConsumerStatefulWidget {
  const PaymentScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  String _selectedMethod = 'momo'; // 'momo' or 'cod'
  bool _isLoading = false;

  String _formatPrice(double price) {
    return '${price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}₫';
  }

  Future<void> _handlePayment() async {
    final cartState = ref.read(cartProvider);

    if (cartState.items.isEmpty) {
      _showError('Giỏ hàng trống');
      return;
    }

    setState(() => _isLoading = true);

    try {
      final paymentService = ref.read(paymentServiceProvider);

      if (_selectedMethod == 'momo') {
        // Create MoMo payment
        final orderId = 'ORDER_${DateTime.now().millisecondsSinceEpoch}';
        final response = await paymentService.createMoMoPayment(
          orderId: orderId,
          amount: cartState.totalPrice,
          orderInfo: 'Thanh toán đơn hàng',
        );

        print('MoMo Response: $response');

        // Check for payUrl in different possible locations
        String? payUrl;
        if (response['payUrl'] != null) {
          payUrl = response['payUrl'] as String;
        } else if (response['data'] != null &&
            response['data']['payUrl'] != null) {
          payUrl = response['data']['payUrl'] as String;
        }

        if (payUrl != null && payUrl.isNotEmpty) {
          final uri = Uri.parse(payUrl);

          try {
            // Try to launch URL directly without checking canLaunchUrl first
            // This is because on Android, MoMo links may not be recognized until attempted
            final launched = await launchUrl(
              uri,
              mode: LaunchMode.externalApplication,
            );

            if (launched && mounted) {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Thông báo'),
                  content: const Text(
                    'Vui lòng hoàn tất thanh toán trên trình duyệt và quay lại ứng dụng',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                        context.go('/shopping');
                      },
                      child: const Text('OK'),
                    ),
                  ],
                ),
              );
            } else if (!launched) {
              _showError('Không thể mở trang thanh toán MoMo');
            }
          } catch (e) {
            print('Launch URL error: $e');
            _showError('Không thể mở trang thanh toán MoMo: $e');
          }
        } else {
          _showError('Không tìm thấy link thanh toán MoMo. Vui lòng thử lại.');
        }
      } else {
        // COD payment
        await paymentService.createCODOrder(
          cartId: DateTime.now().millisecondsSinceEpoch.toString(),
        );

        if (mounted) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              title: const Text('Đặt hàng thành công'),
              content: const Text(
                'Đơn hàng của bạn đã được tạo. Vui lòng thanh toán khi nhận hàng.',
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    ref.read(cartProvider.notifier).clearCart();
                    Navigator.pop(context);
                    context.go('/shopping');
                  },
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }
      }
    } catch (error) {
      _showError('Không thể xử lý thanh toán: $error');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Lỗi'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cartState = ref.watch(cartProvider);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(title: const Text('Thanh toán'), centerTitle: true),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Order Summary
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    color: Colors.white,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Đơn hàng',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        ...cartState.items.map((item) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    item.product.name,
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: Colors.black87,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                Text(
                                  'x${item.quantity}',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  _formatPrice(item.totalPrice),
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF8B4513),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ],
                    ),
                  ),

                  // Payment Method
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    color: Colors.white,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Phương thức thanh toán',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        _buildPaymentMethodOption(
                          value: 'momo',
                          icon: Icons.account_balance_wallet_outlined,
                          title: 'Ví MoMo',
                        ),
                        const SizedBox(height: 12),
                        _buildPaymentMethodOption(
                          value: 'cod',
                          icon: Icons.payments_outlined,
                          title: 'Thanh toán khi nhận hàng (COD)',
                        ),
                      ],
                    ),
                  ),

                  // Price Summary
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    color: Colors.white,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Chi tiết thanh toán',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Tạm tính',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                            Text(
                              _formatPrice(cartState.totalPrice),
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Phí vận chuyển',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                            const Text(
                              'Miễn phí',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Tổng cộng',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              _formatPrice(cartState.totalPrice),
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
                ],
              ),
            ),
          ),

          // Bottom Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: const Offset(0, -3),
                ),
              ],
            ),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _handlePayment,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  backgroundColor: const Color(0xFF8B4513),
                  disabledBackgroundColor: Colors.grey[300],
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                        ),
                      )
                    : const Text(
                        'Xác nhận thanh toán',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodOption({
    required String value,
    required IconData icon,
    required String title,
  }) {
    final isSelected = _selectedMethod == value;

    return InkWell(
      onTap: () {
        setState(() {
          _selectedMethod = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? const Color(0xFF8B4513) : Colors.grey[300]!,
          ),
          borderRadius: BorderRadius.circular(8),
          color: isSelected ? const Color(0xFFFFF8F0) : Colors.white,
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 24,
              color: isSelected ? const Color(0xFF8B4513) : Colors.grey[600],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  color: isSelected
                      ? const Color(0xFF8B4513)
                      : Colors.grey[600],
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ),
            if (isSelected)
              const Icon(
                Icons.check_circle,
                size: 24,
                color: Color(0xFF8B4513),
              ),
          ],
        ),
      ),
    );
  }
}
