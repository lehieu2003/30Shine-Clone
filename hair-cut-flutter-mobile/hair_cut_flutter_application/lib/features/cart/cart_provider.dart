import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/cart_model.dart';
import '../../models/product_model.dart';

class LocalCartItem {
  final String id;
  final Product product;
  final ProductVariant? variant;
  final int quantity;
  final String price;

  LocalCartItem({
    required this.id,
    required this.product,
    this.variant,
    required this.quantity,
    required this.price,
  });

  LocalCartItem copyWith({
    String? id,
    Product? product,
    ProductVariant? variant,
    int? quantity,
    String? price,
  }) {
    return LocalCartItem(
      id: id ?? this.id,
      product: product ?? this.product,
      variant: variant ?? this.variant,
      quantity: quantity ?? this.quantity,
      price: price ?? this.price,
    );
  }

  double get totalPrice {
    return double.parse(price) * quantity;
  }
}

class CartState {
  final List<LocalCartItem> items;
  final bool isLoading;
  final String? error;

  CartState({this.items = const [], this.isLoading = false, this.error});

  CartState copyWith({
    List<LocalCartItem>? items,
    bool? isLoading,
    String? error,
  }) {
    return CartState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  int get totalItems {
    return items.fold(0, (sum, item) => sum + item.quantity);
  }

  double get totalPrice {
    return items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }
}

class CartNotifier extends Notifier<CartState> {
  @override
  CartState build() {
    return CartState();
  }

  void addToCart({
    required Product product,
    ProductVariant? variant,
    int quantity = 1,
  }) {
    final items = List<LocalCartItem>.from(state.items);

    // Check if item already exists in cart
    final existingIndex = items.indexWhere(
      (item) =>
          item.product.id == product.id && item.variant?.id == variant?.id,
    );

    if (existingIndex >= 0) {
      // Update quantity of existing item
      final existingItem = items[existingIndex];
      items[existingIndex] = existingItem.copyWith(
        quantity: existingItem.quantity + quantity,
      );
    } else {
      // Add new item
      final price = variant?.price ?? product.price;
      final newItem = LocalCartItem(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        product: product,
        variant: variant,
        quantity: quantity,
        price: price,
      );
      items.add(newItem);
    }

    state = state.copyWith(items: items);
  }

  void updateQuantity(String itemId, int quantity) {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    final items = List<LocalCartItem>.from(state.items);
    final index = items.indexWhere((item) => item.id == itemId);

    if (index >= 0) {
      items[index] = items[index].copyWith(quantity: quantity);
      state = state.copyWith(items: items);
    }
  }

  void removeFromCart(String itemId) {
    final items = state.items.where((item) => item.id != itemId).toList();
    state = state.copyWith(items: items);
  }

  void clearCart() {
    state = state.copyWith(items: []);
  }

  void increaseQuantity(String itemId) {
    final items = List<LocalCartItem>.from(state.items);
    final index = items.indexWhere((item) => item.id == itemId);

    if (index >= 0) {
      final item = items[index];
      final maxQuantity = item.product.quantity;

      if (item.quantity < maxQuantity) {
        items[index] = item.copyWith(quantity: item.quantity + 1);
        state = state.copyWith(items: items);
      }
    }
  }

  void decreaseQuantity(String itemId) {
    final items = List<LocalCartItem>.from(state.items);
    final index = items.indexWhere((item) => item.id == itemId);

    if (index >= 0) {
      final item = items[index];

      if (item.quantity > 1) {
        items[index] = item.copyWith(quantity: item.quantity - 1);
        state = state.copyWith(items: items);
      } else {
        removeFromCart(itemId);
      }
    }
  }
}

final cartProvider = NotifierProvider<CartNotifier, CartState>(
  () => CartNotifier(),
);
