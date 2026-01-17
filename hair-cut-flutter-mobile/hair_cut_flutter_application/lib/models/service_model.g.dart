// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ServiceStep _$ServiceStepFromJson(Map<String, dynamic> json) => ServiceStep(
  id: (json['id'] as num?)?.toInt(),
  stepOrder: (json['stepOrder'] as num).toInt(),
  stepTitle: json['stepTitle'] as String,
  stepDescription: json['stepDescription'] as String?,
  stepImageUrl: json['stepImageUrl'] as String?,
);

Map<String, dynamic> _$ServiceStepToJson(ServiceStep instance) =>
    <String, dynamic>{
      'id': instance.id,
      'stepOrder': instance.stepOrder,
      'stepTitle': instance.stepTitle,
      'stepDescription': instance.stepDescription,
      'stepImageUrl': instance.stepImageUrl,
    };

ServiceModel _$ServiceModelFromJson(Map<String, dynamic> json) => ServiceModel(
  id: (json['id'] as num).toInt(),
  serviceName: json['serviceName'] as String,
  estimatedTime: (json['estimatedTime'] as num).toInt(),
  price: json['price'] as String,
  description: json['description'] as String,
  bannerImageUrl: json['bannerImageUrl'] as String,
  categoryId: (json['categoryId'] as num).toInt(),
  isActive: json['isActive'] as bool?,
  steps: (json['steps'] as List<dynamic>?)
      ?.map((e) => ServiceStep.fromJson(e as Map<String, dynamic>))
      .toList(),
  createdAt: json['createdAt'] as String?,
  updatedAt: json['updatedAt'] as String?,
);

Map<String, dynamic> _$ServiceModelToJson(ServiceModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'serviceName': instance.serviceName,
      'estimatedTime': instance.estimatedTime,
      'price': instance.price,
      'description': instance.description,
      'bannerImageUrl': instance.bannerImageUrl,
      'categoryId': instance.categoryId,
      'isActive': instance.isActive,
      'steps': instance.steps,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
