import 'package:json_annotation/json_annotation.dart';

part 'booking_model.g.dart';

enum BookingStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('confirmed')
  confirmed,
  @JsonValue('cancelled')
  cancelled,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('success')
  success,
}

@JsonSerializable()
class BookingServiceItem {
  final int id;
  final int bookingId;
  final int serviceId;
  final String servicePrice;
  final BookingServiceInfo service;

  BookingServiceItem({
    required this.id,
    required this.bookingId,
    required this.serviceId,
    required this.servicePrice,
    required this.service,
  });

  factory BookingServiceItem.fromJson(Map<String, dynamic> json) =>
      _$BookingServiceItemFromJson(json);
  Map<String, dynamic> toJson() => _$BookingServiceItemToJson(this);
}

@JsonSerializable()
class BookingServiceInfo {
  final int id;
  final String serviceName;
  final String price;
  final int estimatedTime;

  BookingServiceInfo({
    required this.id,
    required this.serviceName,
    required this.price,
    required this.estimatedTime,
  });

  factory BookingServiceInfo.fromJson(Map<String, dynamic> json) =>
      _$BookingServiceInfoFromJson(json);
  Map<String, dynamic> toJson() => _$BookingServiceInfoToJson(this);
}

@JsonSerializable()
class Employee {
  final int id;
  final String fullName;
  final String phone;
  final String? email;

  Employee({
    required this.id,
    required this.fullName,
    required this.phone,
    this.email,
  });

  factory Employee.fromJson(Map<String, dynamic> json) =>
      _$EmployeeFromJson(json);
  Map<String, dynamic> toJson() => _$EmployeeToJson(this);
}

@JsonSerializable()
class Branch {
  final int id;
  final String name;
  final String address;
  final String? phone;
  final String? email;

  Branch({
    required this.id,
    required this.name,
    required this.address,
    this.phone,
    this.email,
  });

  factory Branch.fromJson(Map<String, dynamic> json) => _$BranchFromJson(json);
  Map<String, dynamic> toJson() => _$BranchToJson(this);
}

@JsonSerializable()
class Customer {
  final int id;
  final String fullName;
  final String phone;
  final String? email;
  final String? CCCD;

  Customer({
    required this.id,
    required this.fullName,
    required this.phone,
    this.email,
    this.CCCD,
  });

  factory Customer.fromJson(Map<String, dynamic> json) =>
      _$CustomerFromJson(json);
  Map<String, dynamic> toJson() => _$CustomerToJson(this);
}

@JsonSerializable()
class Booking {
  final int id;
  final int customerId;
  final String appointmentDate;
  final int? employeeId;
  final int branchId;
  final String? notes;
  final BookingStatus status;
  final String totalPrice;
  final String? totalAmount;
  final int? estimatedDuration;
  final String createdAt;
  final String updatedAt;
  final Customer? customer;
  final Employee? employee;
  final Branch branch;
  final List<BookingServiceItem>? services;
  final List<BookingServiceItem>? bookingServices;

  Booking({
    required this.id,
    required this.customerId,
    required this.appointmentDate,
    this.employeeId,
    required this.branchId,
    this.notes,
    required this.status,
    required this.totalPrice,
    this.totalAmount,
    this.estimatedDuration,
    required this.createdAt,
    required this.updatedAt,
    this.customer,
    this.employee,
    required this.branch,
    this.services,
    this.bookingServices,
  });

  factory Booking.fromJson(Map<String, dynamic> json) =>
      _$BookingFromJson(json);
  Map<String, dynamic> toJson() => _$BookingToJson(this);
}

@JsonSerializable()
class BookingCreateData {
  final String phoneNumber;
  final String appointmentDate;
  final List<int> serviceIds;
  final String? notes;
  final int? employeeId;
  final int branchId;

  BookingCreateData({
    required this.phoneNumber,
    required this.appointmentDate,
    required this.serviceIds,
    this.notes,
    this.employeeId,
    required this.branchId,
  });

  factory BookingCreateData.fromJson(Map<String, dynamic> json) =>
      _$BookingCreateDataFromJson(json);

  Map<String, dynamic> toJson() {
    final json = _$BookingCreateDataToJson(this);
    json.removeWhere((key, value) => value == null);
    return json;
  }
}
