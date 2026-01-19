import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/products/products_provider.dart';
import '../../features/cart/cart_provider.dart';
import '../../core/widgets/loading_widget.dart';
import '../../core/widgets/empty_state_widget.dart';
import '../../core/widgets/error_widget.dart' as custom;

class ShoppingScreen extends ConsumerStatefulWidget {
  const ShoppingScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ShoppingScreen> createState() => _ShoppingScreenState();
}

class _ShoppingScreenState extends ConsumerState<ShoppingScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(productsProvider.notifier).fetchProducts(size: 20);
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String value) {
    setState(() => _searchQuery = value);
    ref.read(productsProvider.notifier).fetchProducts(search: value, size: 20);
  }

  @override
  Widget build(BuildContext context) {
    final productsState = ref.watch(productsProvider);
    final cartState = ref.watch(cartProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sản phẩm'),
        actions: [
          Stack(
            children: [
              IconButton(
                onPressed: () => context.push('/shopping/cart'),
                icon: const Icon(Icons.shopping_cart),
              ),
              if (cartState.totalItems > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      cartState.totalItems.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Tìm kiếm sản phẩm...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _onSearchChanged('');
                        },
                      )
                    : null,
              ),
            ),
          ),
          Expanded(
            child: productsState.isLoading
                ? const LoadingWidget(text: 'Đang tải...')
                : productsState.error != null
                ? custom.ErrorWidget(
                    message: productsState.error!,
                    onRetry: () {
                      ref
                          .read(productsProvider.notifier)
                          .fetchProducts(size: 20);
                    },
                  )
                : productsState.products.isEmpty
                ? const EmptyStateWidget(
                    message: 'Không tìm thấy sản phẩm nào',
                    icon: Icons.shopping_bag_outlined,
                  )
                : RefreshIndicator(
                    onRefresh: () async {
                      await ref
                          .read(productsProvider.notifier)
                          .fetchProducts(search: _searchQuery, size: 20);
                    },
                    child: GridView.builder(
                      padding: const EdgeInsets.all(16),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.7,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                          ),
                      itemCount: productsState.products.length,
                      itemBuilder: (context, index) {
                        final product = productsState.products[index];
                        return Card(
                          child: Stack(
                            children: [
                              InkWell(
                                onTap: () =>
                                    context.push('/shopping/${product.id}'),
                                borderRadius: BorderRadius.circular(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: ClipRRect(
                                        borderRadius:
                                            const BorderRadius.vertical(
                                              top: Radius.circular(12),
                                            ),
                                        child: Image.network(
                                          product.imageUrl ?? '',
                                          width: double.infinity,
                                          fit: BoxFit.cover,
                                          errorBuilder:
                                              (context, error, stackTrace) =>
                                                  Container(
                                                    color: Colors.grey[300],
                                                    child: const Icon(
                                                      Icons.image,
                                                      size: 48,
                                                    ),
                                                  ),
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(8),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            product.name,
                                            style: Theme.of(
                                              context,
                                            ).textTheme.titleSmall,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          if (product.isDiscount) ...[
                                            Text(
                                              '${product.listedPrice}đ',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                decoration:
                                                    TextDecoration.lineThrough,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                          ],
                                          Row(
                                            children: [
                                              Text(
                                                '${product.price}đ',
                                                style: const TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.bold,
                                                  color: Color(0xFF8B4513),
                                                ),
                                              ),
                                              if (product.isDiscount) ...[
                                                const SizedBox(width: 4),
                                                Container(
                                                  padding:
                                                      const EdgeInsets.symmetric(
                                                        horizontal: 4,
                                                        vertical: 2,
                                                      ),
                                                  decoration: BoxDecoration(
                                                    color: Colors.red,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          4,
                                                        ),
                                                  ),
                                                  child: Text(
                                                    '-${product.discountPercent}%',
                                                    style: const TextStyle(
                                                      fontSize: 10,
                                                      color: Colors.white,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Add to Cart Button
                              Positioned(
                                right: 5,
                                bottom: 2,
                                child: Material(
                                  color: Colors.transparent,
                                  child: InkWell(
                                    onTap: () {
                                      if (product.isOutOfStock) {
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          const SnackBar(
                                            content: Text('Sản phẩm hết hàng'),
                                            duration: Duration(seconds: 1),
                                          ),
                                        );
                                        return;
                                      }

                                      ref
                                          .read(cartProvider.notifier)
                                          .addToCart(
                                            product: product,
                                            quantity: 1,
                                          );

                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        SnackBar(
                                          content: const Text(
                                            'Đã thêm vào giỏ hàng',
                                          ),
                                          duration: const Duration(seconds: 1),
                                          action: SnackBarAction(
                                            label: 'Xem',
                                            onPressed: () =>
                                                context.push('/shopping/cart'),
                                          ),
                                        ),
                                      );
                                    },
                                    borderRadius: BorderRadius.circular(20),
                                    child: Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: product.isOutOfStock
                                            ? Colors.grey
                                            : const Color(0xFF8B4513),
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(
                                              0.2,
                                            ),
                                            blurRadius: 4,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: const Icon(
                                        Icons.add,
                                        color: Colors.white,
                                        size: 15,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
