import 'package:json_annotation/json_annotation.dart';

part 'branch_model.g.dart';

@JsonSerializable()
class Branch {
  final int id;
  final String name;
  final String address;
  final String? phone;
  final String? email;
  final String? description;
  final String? imageUrl;
  final double? latitude;
  final double? longitude;
  final bool isActive;
  final String createdAt;
  final String? updatedAt;

  Branch({
    required this.id,
    required this.name,
    required this.address,
    this.phone,
    this.email,
    this.description,
    this.imageUrl,
    this.latitude,
    this.longitude,
    required this.isActive,
    required this.createdAt,
    this.updatedAt,
  });

  factory Branch.fromJson(Map<String, dynamic> json) => _$BranchFromJson(json);
  Map<String, dynamic> toJson() => _$BranchToJson(this);
}
