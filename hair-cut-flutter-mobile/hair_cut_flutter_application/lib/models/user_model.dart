import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class User {
  final int id;
  final String fullName;
  final String email;
  final String phone;
  final String role;
  final String status;
  final bool? gender;
  final String? address;
  final String? birthDate;
  final String? CCCD;
  final String? availabilityStatus;
  final String? createdAt;

  User({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.role,
    required this.status,
    this.gender,
    this.address,
    this.birthDate,
    this.CCCD,
    this.availabilityStatus,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
