import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../features/cart/cart_provider.dart';
import '../../core/widgets/empty_state_widget.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartState = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Giỏ hàng'),
        actions: [
          if (cartState.items.isNotEmpty)
            TextButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Xóa giỏ hàng'),
                    content: const Text(
                      'Bạn có chắc muốn xóa toàn bộ giỏ hàng?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Hủy'),
                      ),
                      TextButton(
                        onPressed: () {
                          ref.read(cartProvider.notifier).clearCart();
                          Navigator.pop(context);
                        },
                        child: const Text('Xóa'),
                      ),
                    ],
                  ),
                );
              },
              child: const Text('Xóa tất cả'),
            ),
        ],
      ),
      body: cartState.items.isEmpty
          ? const EmptyStateWidget(
              message: 'Giỏ hàng trống',
              icon: Icons.shopping_cart_outlined,
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: cartState.items.length,
                    separatorBuilder: (context, index) =>
                        const Divider(height: 24),
                    itemBuilder: (context, index) {
                      final item = cartState.items[index];
                      return _CartItemCard(
                        item: item,
                        onIncrease: () {
                          ref
                              .read(cartProvider.notifier)
                              .increaseQuantity(item.id);
                        },
                        onDecrease: () {
                          ref
                              .read(cartProvider.notifier)
                              .decreaseQuantity(item.id);
                        },
                        onRemove: () {
                          ref
                              .read(cartProvider.notifier)
                              .removeFromCart(item.id);
                        },
                      );
                    },
                  ),
                ),
                _CartSummary(cartState: cartState),
              ],
            ),
    );
  }
}

class _CartItemCard extends StatelessWidget {
  final dynamic item;
  final VoidCallback onIncrease;
  final VoidCallback onDecrease;
  final VoidCallback onRemove;

  const _CartItemCard({
    required this.item,
    required this.onIncrease,
    required this.onDecrease,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final product = item.product;
    final variant = item.variant;
    final imageUrl = variant?.imageUrl ?? product.imageUrl;

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Product Image
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: imageUrl != null
              ? CachedNetworkImage(
                  imageUrl: imageUrl,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    color: Colors.grey[300],
                    child: const Center(child: CircularProgressIndicator()),
                  ),
                  errorWidget: (context, url, error) => Container(
                    color: Colors.grey[300],
                    child: const Icon(Icons.image, size: 32),
                  ),
                )
              : Container(
                  width: 80,
                  height: 80,
                  color: Colors.grey[300],
                  child: const Icon(Icons.image, size: 32),
                ),
        ),
        const SizedBox(width: 12),

        // Product Info
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                product.name,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              if (variant != null) ...[
                const SizedBox(height: 4),
                Text(
                  'Phân loại: ${variant.name}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
              const SizedBox(height: 8),
              Text(
                '${item.price}đ',
                style: const TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  // Quantity Controls
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        InkWell(
                          onTap: onDecrease,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            child: const Icon(Icons.remove, size: 18),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            item.quantity.toString(),
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                        InkWell(
                          onTap: item.quantity < product.quantity
                              ? onIncrease
                              : null,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            child: Icon(
                              Icons.add,
                              size: 18,
                              color: item.quantity < product.quantity
                                  ? null
                                  : Colors.grey,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  // Remove Button
                  IconButton(
                    onPressed: onRemove,
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _CartSummary extends StatelessWidget {
  final dynamic cartState;

  const _CartSummary({required this.cartState});

  @override
  Widget build(BuildContext context) {
    return Container(
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
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tổng số lượng:',
                style: TextStyle(color: Colors.grey[700], fontSize: 14),
              ),
              Text(
                '${cartState.totalItems} sản phẩm',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Tổng tiền:',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Text(
                '${cartState.totalPrice.toStringAsFixed(0)}đ',
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                if (cartState.items.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Giỏ hàng trống')),
                  );
                  return;
                }
                context.push('/shopping/cart/payment');
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text(
                'Thanh toán',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
