// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductImage _$ProductImageFromJson(Map<String, dynamic> json) => ProductImage(
  id: intFromJson(json['id']),
  productId: json['productId'] as String,
  name: json['name'] as String,
  url: json['url'] as String,
  alt: json['alt'] as String?,
);

Map<String, dynamic> _$ProductImageToJson(ProductImage instance) =>
    <String, dynamic>{
      'id': instance.id,
      'productId': instance.productId,
      'name': instance.name,
      'url': instance.url,
      'alt': instance.alt,
    };

ProductVariant _$ProductVariantFromJson(Map<String, dynamic> json) =>
    ProductVariant(
      id: intFromJson(json['id']),
      productId: json['productId'] as String,
      name: json['name'] as String,
      price: json['price'] as String,
      listedPrice: json['listedPrice'] as String,
      sku: json['sku'] as String?,
      imageUrl: json['imageUrl'] as String?,
      isDiscount: boolFromJson(json['isDiscount']),
      discountPercent: intFromJson(json['discountPercent']),
      isOutOfStock: boolFromJson(json['isOutOfStock']),
    );

Map<String, dynamic> _$ProductVariantToJson(ProductVariant instance) =>
    <String, dynamic>{
      'id': instance.id,
      'productId': instance.productId,
      'name': instance.name,
      'price': instance.price,
      'listedPrice': instance.listedPrice,
      'sku': instance.sku,
      'imageUrl': instance.imageUrl,
      'isDiscount': instance.isDiscount,
      'discountPercent': instance.discountPercent,
      'isOutOfStock': instance.isOutOfStock,
    };

Product _$ProductFromJson(Map<String, dynamic> json) => Product(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  description: json['description'] as String?,
  shortDescription: json['shortDescription'] as String?,
  brand: json['brand'] as String?,
  brandSlug: json['brandSlug'] as String?,
  category: json['category'] as String?,
  categorySlug: json['categorySlug'] as String?,
  subcategory: json['subcategory'] as String?,
  subcategorySlug: json['subcategorySlug'] as String?,
  price: json['price'] as String,
  listedPrice: json['listedPrice'] as String,
  cost: json['cost'] as String?,
  discountPercent: intFromJson(json['discountPercent']),
  isDiscount: boolFromJson(json['isDiscount']),
  quantity: intFromJson(json['quantity']),
  minimumStock: intFromJson(json['minimumStock']),
  isOutOfStock: boolFromJson(json['isOutOfStock']),
  imageUrl: json['imageUrl'] as String?,
  sku: json['sku'] as String?,
  tags: json['tags'] as String?,
  ingredients: json['ingredients'] as String?,
  manual: json['manual'] as String?,
  ratingScore: numFromJson(json['ratingScore']),
  totalSold: intFromJson(json['totalSold']),
  isActive: boolFromJson(json['isActive']),
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String?,
  images:
      (json['images'] as List<dynamic>?)
          ?.map((e) => ProductImage.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
  variants:
      (json['variants'] as List<dynamic>?)
          ?.map((e) => ProductVariant.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
);

Map<String, dynamic> _$ProductToJson(Product instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'slug': instance.slug,
  'description': instance.description,
  'shortDescription': instance.shortDescription,
  'brand': instance.brand,
  'brandSlug': instance.brandSlug,
  'category': instance.category,
  'categorySlug': instance.categorySlug,
  'subcategory': instance.subcategory,
  'subcategorySlug': instance.subcategorySlug,
  'price': instance.price,
  'listedPrice': instance.listedPrice,
  'cost': instance.cost,
  'discountPercent': instance.discountPercent,
  'isDiscount': instance.isDiscount,
  'quantity': instance.quantity,
  'minimumStock': instance.minimumStock,
  'isOutOfStock': instance.isOutOfStock,
  'imageUrl': instance.imageUrl,
  'sku': instance.sku,
  'tags': instance.tags,
  'ingredients': instance.ingredients,
  'manual': instance.manual,
  'ratingScore': instance.ratingScore,
  'totalSold': instance.totalSold,
  'isActive': instance.isActive,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
  'images': instance.images.map((e) => e.toJson()).toList(),
  'variants': instance.variants.map((e) => e.toJson()).toList(),
};
