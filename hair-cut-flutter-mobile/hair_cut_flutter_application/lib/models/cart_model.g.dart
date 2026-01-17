// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cart_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CartItem _$CartItemFromJson(Map<String, dynamic> json) => CartItem(
  id: json['id'] as String,
  cartId: json['cartId'] as String,
  productId: json['productId'] as String,
  quantity: (json['quantity'] as num).toInt(),
  product: Product.fromJson(json['product'] as Map<String, dynamic>),
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$CartItemToJson(CartItem instance) => <String, dynamic>{
  'id': instance.id,
  'cartId': instance.cartId,
  'productId': instance.productId,
  'quantity': instance.quantity,
  'product': instance.product,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};

Cart _$CartFromJson(Map<String, dynamic> json) => Cart(
  id: json['id'] as String,
  userId: json['userId'] as String,
  items: (json['items'] as List<dynamic>)
      .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
      .toList(),
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$CartToJson(Cart instance) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'items': instance.items,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};
