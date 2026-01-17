// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
  id: (json['id'] as num).toInt(),
  fullName: json['fullName'] as String,
  email: json['email'] as String,
  phone: json['phone'] as String,
  role: json['role'] as String,
  status: json['status'] as String,
  gender: json['gender'] as bool?,
  address: json['address'] as String?,
  birthDate: json['birthDate'] as String?,
  CCCD: json['CCCD'] as String?,
  availabilityStatus: json['availabilityStatus'] as String?,
  createdAt: json['createdAt'] as String?,
);

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
  'id': instance.id,
  'fullName': instance.fullName,
  'email': instance.email,
  'phone': instance.phone,
  'role': instance.role,
  'status': instance.status,
  'gender': instance.gender,
  'address': instance.address,
  'birthDate': instance.birthDate,
  'CCCD': instance.CCCD,
  'availabilityStatus': instance.availabilityStatus,
  'createdAt': instance.createdAt,
};
