import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:go_router/go_router.dart';
import '../../models/product_model.dart';
import '../../features/products/products_provider.dart';
import '../../features/cart/cart_provider.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailScreen({Key? key, required this.productId})
    : super(key: key);

  @override
  ConsumerState<ProductDetailScreen> createState() =>
      _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen> {
  int _selectedImageIndex = 0;
  ProductVariant? _selectedVariant;
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    final productAsync = ref.watch(productDetailProvider(widget.productId));

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Chi tiết sản phẩm'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // Share functionality
            },
          ),
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {
              // Favorite functionality
            },
          ),
        ],
      ),
      body: productAsync.when(
        data: (product) => _buildProductDetail(product),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Lỗi: $error'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.invalidate(productDetailProvider(widget.productId));
                },
                child: const Text('Thử lại'),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: productAsync.whenOrNull(
        data: (product) => _buildBottomBar(product),
      ),
    );
  }

  Widget _buildProductDetail(Product product) {
    final selectedVariant = _selectedVariant;
    final displayPrice = selectedVariant?.price ?? product.price;
    final displayListedPrice =
        selectedVariant?.listedPrice ?? product.listedPrice;
    final displayIsDiscount = selectedVariant?.isDiscount ?? product.isDiscount;
    final displayDiscountPercent =
        selectedVariant?.discountPercent ?? product.discountPercent;
    final displayIsOutOfStock =
        selectedVariant?.isOutOfStock ?? product.isOutOfStock;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Gallery
          _buildImageGallery(product),

          // Product Info
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Product Name
                Text(
                  product.name,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),

                // Brand & Category
                if (product.brand != null)
                  Text(
                    'Thương hiệu: ${product.brand}',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                if (product.category != null) const SizedBox(height: 4),
                if (product.category != null)
                  Text(
                    'Danh mục: ${product.category}',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                const SizedBox(height: 12),

                // Rating & Sold
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 20),
                    const SizedBox(width: 4),
                    Text(
                      product.ratingScore.toString(),
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 16),
                    Text(
                      'Đã bán: ${product.totalSold}',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Price
                Row(
                  children: [
                    Text(
                      '${displayPrice}đ',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    if (displayIsDiscount) ...[
                      const SizedBox(width: 12),
                      Text(
                        '${displayListedPrice}đ',
                        style: TextStyle(
                          fontSize: 16,
                          decoration: TextDecoration.lineThrough,
                          color: Colors.grey[500],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '-$displayDiscountPercent%',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 16),

                // Stock Status
                if (displayIsOutOfStock)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.red[50],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Hết hàng',
                      style: TextStyle(color: Colors.red),
                    ),
                  ),

                const Divider(height: 32),

                // Variants
                if (product.variants.isNotEmpty) ...[
                  const Text(
                    'Phân loại',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: product.variants.map((variant) {
                      final isSelected = _selectedVariant?.id == variant.id;
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedVariant = variant;
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: isSelected
                                  ? Theme.of(context).primaryColor
                                  : Colors.grey[300]!,
                              width: isSelected ? 2 : 1,
                            ),
                            borderRadius: BorderRadius.circular(8),
                            color: isSelected
                                ? Theme.of(
                                    context,
                                  ).primaryColor.withOpacity(0.1)
                                : Colors.white,
                          ),
                          child: Text(
                            variant.name,
                            style: TextStyle(
                              color: isSelected
                                  ? Theme.of(context).primaryColor
                                  : Colors.black87,
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const Divider(height: 32),
                ],

                // Quantity Selector
                const Text(
                  'Số lượng',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    IconButton(
                      onPressed: _quantity > 1
                          ? () => setState(() => _quantity--)
                          : null,
                      icon: const Icon(Icons.remove_circle_outline),
                      color: Theme.of(context).primaryColor,
                    ),
                    Container(
                      width: 60,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey[300]!),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        _quantity.toString(),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: _quantity < product.quantity
                          ? () => setState(() => _quantity++)
                          : null,
                      icon: const Icon(Icons.add_circle_outline),
                      color: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Còn ${product.quantity} sản phẩm',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
                const Divider(height: 32),

                // Description
                if (product.description != null) ...[
                  const Text(
                    'Mô tả sản phẩm',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Html(
                    data: product.description!,
                    style: {
                      "body": Style(
                        margin: Margins.zero,
                        padding: HtmlPaddings.zero,
                      ),
                      "p": Style(margin: Margins.only(bottom: 8)),
                    },
                  ),
                  const SizedBox(height: 16),
                ],

                // Ingredients
                if (product.ingredients != null) ...[
                  const Text(
                    'Thành phần',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Html(
                    data: product.ingredients!,
                    style: {
                      "body": Style(
                        margin: Margins.zero,
                        padding: HtmlPaddings.zero,
                      ),
                    },
                  ),
                  const SizedBox(height: 16),
                ],

                // Manual
                if (product.manual != null) ...[
                  const Text(
                    'Hướng dẫn sử dụng',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Html(
                    data: product.manual!,
                    style: {
                      "body": Style(
                        margin: Margins.zero,
                        padding: HtmlPaddings.zero,
                      ),
                    },
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImageGallery(Product product) {
    final images = product.images.isNotEmpty
        ? product.images
        : (product.imageUrl != null
              ? [
                  ProductImage(
                    id: 0,
                    productId: product.id,
                    name: 'main',
                    url: product.imageUrl!,
                  ),
                ]
              : <ProductImage>[]);

    if (images.isEmpty) {
      return Container(
        height: 300,
        color: Colors.grey[200],
        child: const Center(child: Icon(Icons.image_not_supported, size: 64)),
      );
    }

    return Column(
      children: [
        Container(
          height: 300,
          color: Colors.grey[100],
          child: PageView.builder(
            itemCount: images.length,
            onPageChanged: (index) {
              setState(() {
                _selectedImageIndex = index;
              });
            },
            itemBuilder: (context, index) {
              return CachedNetworkImage(
                imageUrl: images[index].url,
                fit: BoxFit.contain,
                placeholder: (context, url) =>
                    const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) =>
                    const Center(child: Icon(Icons.error, size: 48)),
              );
            },
          ),
        ),
        if (images.length > 1)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                images.length,
                (index) => Container(
                  width: 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _selectedImageIndex == index
                        ? Theme.of(context).primaryColor
                        : Colors.grey[300],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildBottomBar(Product product) {
    final isOutOfStock = _selectedVariant?.isOutOfStock ?? product.isOutOfStock;

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
      child: Row(
        children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: isOutOfStock
                  ? null
                  : () {
                      ref
                          .read(cartProvider.notifier)
                          .addToCart(
                            product: product,
                            variant: _selectedVariant,
                            quantity: _quantity,
                          );

                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: const Text('Đã thêm vào giỏ hàng'),
                          duration: const Duration(seconds: 2),
                          action: SnackBarAction(
                            label: 'Xem giỏ hàng',
                            onPressed: () => context.push('/shopping/cart'),
                          ),
                        ),
                      );
                    },
              icon: const Icon(Icons.shopping_cart_outlined),
              label: const Text('Thêm vào giỏ'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: isOutOfStock
                  ? null
                  : () {
                      // Buy now
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Mua ngay'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('Mua ngay'),
            ),
          ),
        ],
      ),
    );
  }
}
