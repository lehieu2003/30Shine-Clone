import 'package:json_annotation/json_annotation.dart';
import 'package:hair_cut_flutter_application/core/utils/helpers.dart';

part 'product_model.g.dart';

/// =======================
///  ProductImage
/// =======================
@JsonSerializable()
class ProductImage {
  @JsonKey(fromJson: intFromJson)
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
  @JsonKey(fromJson: intFromJson)
  final int id;

  final String productId;
  final String name;

  final String price;
  final String listedPrice;

  final String? sku;
  final String? imageUrl;

  @JsonKey(fromJson: boolFromJson)
  final bool isDiscount;

  @JsonKey(fromJson: intFromJson)
  final int discountPercent;

  @JsonKey(fromJson: boolFromJson)
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

  final String price;
  final String listedPrice;
  final String? cost;

  @JsonKey(fromJson: intFromJson)
  final int discountPercent;

  @JsonKey(fromJson: boolFromJson)
  final bool isDiscount;

  @JsonKey(fromJson: intFromJson)
  final int quantity;

  @JsonKey(fromJson: intFromJson)
  final int minimumStock;

  @JsonKey(fromJson: boolFromJson)
  final bool isOutOfStock;

  final String? imageUrl;
  final String? sku;
  final String? tags;
  final String? ingredients;
  final String? manual;

  @JsonKey(fromJson: numFromJson)
  final num ratingScore;

  @JsonKey(fromJson: intFromJson)
  final int totalSold;

  @JsonKey(fromJson: boolFromJson)
  final bool isActive;

  final String createdAt;
  final String? updatedAt;

  @JsonKey(defaultValue: [])
  final List<ProductImage> images;

  @JsonKey(defaultValue: [])
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
