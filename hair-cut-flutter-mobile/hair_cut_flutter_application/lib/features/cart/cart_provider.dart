import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/cart_model.dart';
import '../../services/network/cart_service.dart';
import '../auth/auth_provider.dart';

final cartServiceProvider = Provider<CartService>((ref) => CartService());

class CartState {
  final Cart? cart;
  final bool isLoading;
  final String? error;

  CartState({this.cart, this.isLoading = false, this.error});

  CartState copyWith({Cart? cart, bool? isLoading, String? error}) {
    return CartState(
      cart: cart ?? this.cart,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class CartNotifier extends Notifier<CartState> {
  @override
  CartState build() {
    _init();
    return CartState();
  }

  Future<void> _init() async {
    final isAuth = ref.read(authProvider).isAuth;
    if (!isAuth) {
      state = state.copyWith(isLoading: false);
      return;
    }

    await fetchCart();
  }

  Future<void> fetchCart() async {
    final isAuth = ref.read(authProvider).isAuth;
    if (!isAuth) {
      state = state.copyWith(cart: null, isLoading: false);
      return;
    }

    try {
      state = state.copyWith(isLoading: true, error: null);
      final cartService = ref.read(cartServiceProvider);
      final cart = await cartService.getCart();
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> addToCart(String productId, int quantity) async {
    final isAuth = ref.read(authProvider).isAuth;
    if (!isAuth) return;

    try {
      final cartService = ref.read(cartServiceProvider);
      final cart = await cartService.addToCart(productId, quantity);
      state = state.copyWith(cart: cart);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> updateCartItem(String productId, int quantity) async {
    final isAuth = ref.read(authProvider).isAuth;
    if (!isAuth || state.cart == null) return;

    // Optimistic update
    final updatedItems = state.cart!.items.map((item) {
      if (item.id == productId) {
        return CartItem(
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: quantity,
          product: item.product,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        );
      }
      return item;
    }).toList();

    final updatedCart = Cart(
      id: state.cart!.id,
      userId: state.cart!.userId,
      items: updatedItems,
      createdAt: state.cart!.createdAt,
      updatedAt: state.cart!.updatedAt,
    );

    state = state.copyWith(cart: updatedCart);

    try {
      final cartService = ref.read(cartServiceProvider);
      await cartService.updateCartItem(productId, quantity);
    } catch (e) {
      // Revert on error
      await fetchCart();
      rethrow;
    }
  }

  Future<void> removeFromCart(String productId) async {
    final isAuth = ref.read(authProvider).isAuth;
    if (!isAuth || state.cart == null) return;

    final updatedItems = state.cart!.items
        .where((item) => item.id != productId)
        .toList();

    final updatedCart = Cart(
      id: state.cart!.id,
      userId: state.cart!.userId,
      items: updatedItems,
      createdAt: state.cart!.createdAt,
      updatedAt: state.cart!.updatedAt,
    );

    state = state.copyWith(cart: updatedCart);
  }

  Future<void> clearCart() async {
    final isAuth = ref.read(authProvider).isAuth;
    if (!isAuth || state.cart == null) return;

    try {
      for (var item in state.cart!.items) {
        await removeFromCart(item.productId);
      }
      await fetchCart();
    } catch (e) {
      rethrow;
    }
  }

  double getTotalPrice() {
    return state.cart?.totalPrice ?? 0;
  }

  int getTotalItems() {
    return state.cart?.totalItems ?? 0;
  }
}

final cartProvider = NotifierProvider<CartNotifier, CartState>(
  () => CartNotifier(),
);
