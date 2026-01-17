import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/product_model.dart';
import '../../services/network/product_service.dart';

final productServiceProvider = Provider<ProductService>(
  (ref) => ProductService(),
);

class ProductsState {
  final List<Product> products;
  final bool isLoading;
  final String? error;
  final int total;
  final int page;

  ProductsState({
    this.products = const [],
    this.isLoading = false,
    this.error,
    this.total = 0,
    this.page = 1,
  });

  ProductsState copyWith({
    List<Product>? products,
    bool? isLoading,
    String? error,
    int? total,
    int? page,
  }) {
    return ProductsState(
      products: products ?? this.products,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      total: total ?? this.total,
      page: page ?? this.page,
    );
  }
}

class ProductsNotifier extends Notifier<ProductsState> {
  @override
  ProductsState build() {
    return ProductsState();
  }

  Future<void> fetchProducts({
    int page = 1,
    int size = 10,
    String? search,
  }) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final productService = ref.read(productServiceProvider);
      final result = await productService.fetchProducts(
        page: page,
        size: size,
        search: search,
      );
      state = state.copyWith(
        products: result['data'] as List<Product>,
        total: result['total'] as int,
        page: result['page'] as int,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

final productsProvider = NotifierProvider<ProductsNotifier, ProductsState>(
  () => ProductsNotifier(),
);

final productDetailProvider = FutureProvider.family<Product, String>((
  ref,
  id,
) async {
  final service = ref.watch(productServiceProvider);
  return await service.fetchProductById(id);
});
