import 'package:json_annotation/json_annotation.dart';

part 'service_model.g.dart';

@JsonSerializable()
class ServiceStep {
  final int? id;
  final int stepOrder;
  final String stepTitle;
  final String? stepDescription;
  final String? stepImageUrl;

  ServiceStep({
    this.id,
    required this.stepOrder,
    required this.stepTitle,
    this.stepDescription,
    this.stepImageUrl,
  });

  factory ServiceStep.fromJson(Map<String, dynamic> json) =>
      _$ServiceStepFromJson(json);
  Map<String, dynamic> toJson() => _$ServiceStepToJson(this);
}

@JsonSerializable()
class ServiceModel {
  final int id;
  final String serviceName;
  final int estimatedTime;
  final String price;
  final String description;
  final String bannerImageUrl;
  final int categoryId;
  final bool? isActive;
  final List<ServiceStep>? steps;
  final String? createdAt;
  final String? updatedAt;

  ServiceModel({
    required this.id,
    required this.serviceName,
    required this.estimatedTime,
    required this.price,
    required this.description,
    required this.bannerImageUrl,
    required this.categoryId,
    this.isActive,
    this.steps,
    this.createdAt,
    this.updatedAt,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) =>
      _$ServiceModelFromJson(json);
  Map<String, dynamic> toJson() => _$ServiceModelToJson(this);
}
