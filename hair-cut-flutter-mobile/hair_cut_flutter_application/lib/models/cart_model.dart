import 'package:json_annotation/json_annotation.dart';
import 'product_model.dart';

part 'cart_model.g.dart';

@JsonSerializable()
class CartItem {
  final String id;
  final String cartId;
  final String productId;
  final int quantity;
  final Product product;
  final String createdAt;
  final String updatedAt;

  CartItem({
    required this.id,
    required this.cartId,
    required this.productId,
    required this.quantity,
    required this.product,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) =>
      _$CartItemFromJson(json);
  Map<String, dynamic> toJson() => _$CartItemToJson(this);
}

@JsonSerializable()
class Cart {
  final String id;
  final String userId;
  final List<CartItem> items;
  final String createdAt;
  final String updatedAt;

  Cart({
    required this.id,
    required this.userId,
    required this.items,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Cart.fromJson(Map<String, dynamic> json) => _$CartFromJson(json);
  Map<String, dynamic> toJson() => _$CartToJson(this);

  double get totalPrice {
    return items.fold(0.0, (sum, item) {
      final price = item.product.isDiscount
          ? double.parse(item.product.price)
          : double.parse(item.product.listedPrice);
      return sum + (price * item.quantity);
    });
  }

  int get totalItems {
    return items.fold(0, (sum, item) => sum + item.quantity);
  }
}
