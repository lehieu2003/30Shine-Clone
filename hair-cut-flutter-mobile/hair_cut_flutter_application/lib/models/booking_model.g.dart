// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BookingServiceItem _$BookingServiceItemFromJson(Map<String, dynamic> json) =>
    BookingServiceItem(
      id: (json['id'] as num).toInt(),
      bookingId: (json['bookingId'] as num).toInt(),
      serviceId: (json['serviceId'] as num).toInt(),
      servicePrice: json['servicePrice'] as String,
      service: BookingServiceInfo.fromJson(
        json['service'] as Map<String, dynamic>,
      ),
    );

Map<String, dynamic> _$BookingServiceItemToJson(BookingServiceItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'bookingId': instance.bookingId,
      'serviceId': instance.serviceId,
      'servicePrice': instance.servicePrice,
      'service': instance.service,
    };

BookingServiceInfo _$BookingServiceInfoFromJson(Map<String, dynamic> json) =>
    BookingServiceInfo(
      id: (json['id'] as num).toInt(),
      serviceName: json['serviceName'] as String,
      price: json['price'] as String,
      estimatedTime: (json['estimatedTime'] as num).toInt(),
    );

Map<String, dynamic> _$BookingServiceInfoToJson(BookingServiceInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'serviceName': instance.serviceName,
      'price': instance.price,
      'estimatedTime': instance.estimatedTime,
    };

Employee _$EmployeeFromJson(Map<String, dynamic> json) => Employee(
  id: (json['id'] as num).toInt(),
  fullName: json['fullName'] as String,
  phone: json['phone'] as String,
  email: json['email'] as String?,
);

Map<String, dynamic> _$EmployeeToJson(Employee instance) => <String, dynamic>{
  'id': instance.id,
  'fullName': instance.fullName,
  'phone': instance.phone,
  'email': instance.email,
};

Branch _$BranchFromJson(Map<String, dynamic> json) => Branch(
  id: (json['id'] as num).toInt(),
  name: json['name'] as String,
  address: json['address'] as String,
  phone: json['phone'] as String?,
  email: json['email'] as String?,
);

Map<String, dynamic> _$BranchToJson(Branch instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'address': instance.address,
  'phone': instance.phone,
  'email': instance.email,
};

Customer _$CustomerFromJson(Map<String, dynamic> json) => Customer(
  id: (json['id'] as num).toInt(),
  fullName: json['fullName'] as String,
  phone: json['phone'] as String,
  email: json['email'] as String?,
  CCCD: json['CCCD'] as String?,
);

Map<String, dynamic> _$CustomerToJson(Customer instance) => <String, dynamic>{
  'id': instance.id,
  'fullName': instance.fullName,
  'phone': instance.phone,
  'email': instance.email,
  'CCCD': instance.CCCD,
};

Booking _$BookingFromJson(Map<String, dynamic> json) => Booking(
  id: (json['id'] as num).toInt(),
  customerId: (json['customerId'] as num).toInt(),
  appointmentDate: json['appointmentDate'] as String,
  employeeId: (json['employeeId'] as num?)?.toInt(),
  branchId: (json['branchId'] as num).toInt(),
  notes: json['notes'] as String?,
  status: $enumDecode(_$BookingStatusEnumMap, json['status']),
  totalPrice: json['totalPrice'] as String,
  totalAmount: json['totalAmount'] as String?,
  estimatedDuration: (json['estimatedDuration'] as num?)?.toInt(),
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
  customer: json['customer'] == null
      ? null
      : Customer.fromJson(json['customer'] as Map<String, dynamic>),
  employee: json['employee'] == null
      ? null
      : Employee.fromJson(json['employee'] as Map<String, dynamic>),
  branch: Branch.fromJson(json['branch'] as Map<String, dynamic>),
  services: (json['services'] as List<dynamic>?)
      ?.map((e) => BookingServiceItem.fromJson(e as Map<String, dynamic>))
      .toList(),
  bookingServices: (json['bookingServices'] as List<dynamic>?)
      ?.map((e) => BookingServiceItem.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$BookingToJson(Booking instance) => <String, dynamic>{
  'id': instance.id,
  'customerId': instance.customerId,
  'appointmentDate': instance.appointmentDate,
  'employeeId': instance.employeeId,
  'branchId': instance.branchId,
  'notes': instance.notes,
  'status': _$BookingStatusEnumMap[instance.status]!,
  'totalPrice': instance.totalPrice,
  'totalAmount': instance.totalAmount,
  'estimatedDuration': instance.estimatedDuration,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
  'customer': instance.customer,
  'employee': instance.employee,
  'branch': instance.branch,
  'services': instance.services,
  'bookingServices': instance.bookingServices,
};

const _$BookingStatusEnumMap = {
  BookingStatus.pending: 'pending',
  BookingStatus.confirmed: 'confirmed',
  BookingStatus.cancelled: 'cancelled',
  BookingStatus.inProgress: 'in_progress',
  BookingStatus.completed: 'completed',
  BookingStatus.success: 'success',
};

BookingCreateData _$BookingCreateDataFromJson(Map<String, dynamic> json) =>
    BookingCreateData(
      phoneNumber: json['phoneNumber'] as String,
      appointmentDate: json['appointmentDate'] as String,
      serviceIds: (json['serviceIds'] as List<dynamic>)
          .map((e) => (e as num).toInt())
          .toList(),
      notes: json['notes'] as String?,
      employeeId: (json['employeeId'] as num?)?.toInt(),
      branchId: (json['branchId'] as num).toInt(),
    );

Map<String, dynamic> _$BookingCreateDataToJson(BookingCreateData instance) =>
    <String, dynamic>{
      'phoneNumber': instance.phoneNumber,
      'appointmentDate': instance.appointmentDate,
      'serviceIds': instance.serviceIds,
      'notes': instance.notes,
      'employeeId': instance.employeeId,
      'branchId': instance.branchId,
    };
