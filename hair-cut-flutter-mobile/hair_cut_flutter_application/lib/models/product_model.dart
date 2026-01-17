import 'package:json_annotation/json_annotation.dart';

part 'product_model.g.dart';

@JsonSerializable()
class ProductImage {
  @JsonKey(defaultValue: 0)
  final int id;

  final String productId;
  final String name;
  final String url;
  final String? alt;

  ProductImage({
    required this.id,
    required this.productId,
    required this.name,
    required this.url,
    this.alt,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) =>
      _$ProductImageFromJson(json);
  Map<String, dynamic> toJson() => _$ProductImageToJson(this);
}

/// =======================
///  ProductVariant
/// =======================
@JsonSerializable()
class ProductVariant {
  @JsonKey(defaultValue: 0)
  final int id;

  final String productId;
  final String name;

  final String price;
  final String listedPrice;

  final String? sku;
  final String? imageUrl;

  final bool isDiscount;

  @JsonKey(defaultValue: 0)
  final int discountPercent;

  final bool isOutOfStock;

  ProductVariant({
    required this.id,
    required this.productId,
    required this.name,
    required this.price,
    required this.listedPrice,
    this.sku,
    this.imageUrl,
    required this.isDiscount,
    required this.discountPercent,
    required this.isOutOfStock,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) =>
      _$ProductVariantFromJson(json);
  Map<String, dynamic> toJson() => _$ProductVariantToJson(this);
}

/// =======================
///  Product
/// =======================
@JsonSerializable(explicitToJson: true)
class Product {
  final String id;
  final String name;
  final String slug;

  final String? description;
  final String? shortDescription;
  final String? brand;
  final String? brandSlug;
  final String? category;
  final String? categorySlug;
  final String? subcategory;
  final String? subcategorySlug;

  // JSON là string "880000"
  final String price;
  final String listedPrice;
  final String? cost;

  // JSON: "discountPercent": 0 (số)
  @JsonKey(defaultValue: 0)
  final int discountPercent;

  final bool isDiscount;

  // Nếu backend lỡ trả null → tự về 0, tránh lỗi Null cast
  @JsonKey(defaultValue: 0)
  final int quantity;

  @JsonKey(defaultValue: 0)
  final int minimumStock;

  final bool isOutOfStock;

  final String? imageUrl;
  final String? sku;
  final String? tags;
  final String? ingredients;
  final String? manual;

  @JsonKey(defaultValue: 0)
  final num ratingScore;

  @JsonKey(defaultValue: 0)
  final int totalSold;

  final bool isActive;
  final String createdAt;
  final String? updatedAt;

  final List<ProductImage> images;
  final List<ProductVariant> variants;

  Product({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.shortDescription,
    this.brand,
    this.brandSlug,
    this.category,
    this.categorySlug,
    this.subcategory,
    this.subcategorySlug,
    required this.price,
    required this.listedPrice,
    this.cost,
    required this.discountPercent,
    required this.isDiscount,
    required this.quantity,
    required this.minimumStock,
    required this.isOutOfStock,
    this.imageUrl,
    this.sku,
    this.tags,
    this.ingredients,
    this.manual,
    required this.ratingScore,
    required this.totalSold,
    required this.isActive,
    required this.createdAt,
    this.updatedAt,
    required this.images,
    required this.variants,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);
}
