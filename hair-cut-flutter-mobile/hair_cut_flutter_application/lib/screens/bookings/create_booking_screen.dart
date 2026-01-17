import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/service_model.dart';
import '../../models/branch_model.dart' as branch_model;
import '../../services/network/service_service.dart';
import '../../services/network/branch_service.dart';
import '../../services/network/booking_service.dart';
import '../../services/network/dio_client.dart';
import '../../models/booking_model.dart';
import '../../features/auth/auth_provider.dart';

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

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['employee']?['id'] ?? json['employeeId'] ?? json['id'],
      fullName: json['employee']?['fullName'] ?? json['fullName'] ?? 'N/A',
      phone: json['employee']?['phone'] ?? json['phone'] ?? '',
      email: json['employee']?['email'] ?? json['email'],
    );
  }
}

class CreateBookingScreen extends ConsumerStatefulWidget {
  const CreateBookingScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<CreateBookingScreen> createState() =>
      _CreateBookingScreenState();
}

class _CreateBookingScreenState extends ConsumerState<CreateBookingScreen> {
  final _phoneController = TextEditingController();
  final _notesController = TextEditingController();

  List<ServiceModel> _services = [];
  List<branch_model.Branch> _branches = [];
  List<Employee> _employees = [];

  int? _selectedBranchId;
  int? _selectedEmployeeId;
  List<int> _selectedServiceIds = [];
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();

  bool _isLoading = true;
  bool _isLoadingEmployees = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).user;
    _phoneController.text = user?.phone ?? '';
    _fetchInitialData();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _fetchInitialData() async {
    try {
      setState(() => _isLoading = true);

      final serviceService = ServiceService();
      final branchService = BranchService();

      final servicesResult = await serviceService.fetchServices(size: 100);
      final branchesResult = await branchService.fetchBranches(
        size: 100,
        isActive: true,
      );

      setState(() {
        _services = servicesResult['data'] as List<ServiceModel>;
        _branches = branchesResult['data'] as List<branch_model.Branch>;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Không thể tải dữ liệu: $e')));
      }
    }
  }

  Future<void> _fetchEmployees(int branchId) async {
    try {
      setState(() {
        _isLoadingEmployees = true;
        _employees = [];
        _selectedEmployeeId = null;
      });

      final dio = DioClient().dio;
      // Try different possible endpoints
      try {
        final response = await dio.get(
          '/api/branch-employees',
          queryParameters: {'branchId': branchId},
        );

        List employeesList = [];
        if (response.data is List) {
          employeesList = response.data;
        } else if (response.data?['data']?['branchEmployees'] is List) {
          employeesList = response.data['data']['branchEmployees'];
        } else if (response.data?['data'] is List) {
          employeesList = response.data['data'];
        }

        final employees = employeesList
            .map((e) => Employee.fromJson(e))
            .toList();

        setState(() {
          _employees = employees;
          _isLoadingEmployees = false;
        });
      } catch (e) {
        // If endpoint doesn't exist, allow booking without employee selection
        setState(() {
          _employees = [];
          _isLoadingEmployees = false;
        });
      }
    } catch (e) {
      setState(() => _isLoadingEmployees = false);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Không thể tải nhân viên: $e')));
      }
    }
  }

  void _toggleService(int serviceId) {
    setState(() {
      if (_selectedServiceIds.contains(serviceId)) {
        _selectedServiceIds.remove(serviceId);
      } else {
        _selectedServiceIds.add(serviceId);
      }
    });
  }

  int _calculateTotal() {
    return _services
        .where((s) => _selectedServiceIds.contains(s.id))
        .fold(0, (sum, s) => sum + int.parse(s.price));
  }

  int _calculateDuration() {
    return _services
        .where((s) => _selectedServiceIds.contains(s.id))
        .fold(0, (sum, s) => sum + s.estimatedTime);
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null) {
      setState(() => _selectedTime = picked);
    }
  }

  Future<void> _handleSubmit() async {
    if (_selectedBranchId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Vui lòng chọn chi nhánh')));
      return;
    }

    if (_selectedServiceIds.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn ít nhất một dịch vụ')),
      );
      return;
    }

    // Make employee selection optional if no employees available
    if (_employees.isNotEmpty && _selectedEmployeeId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Vui lòng chọn nhân viên')));
      return;
    }

    try {
      setState(() => _isSubmitting = true);

      final appointmentDateTime = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      final bookingData = BookingCreateData(
        phoneNumber: _phoneController.text.trim(),
        appointmentDate: appointmentDateTime.toIso8601String(),
        serviceIds: _selectedServiceIds,
        branchId: _selectedBranchId!,
        employeeId: _selectedEmployeeId!,
        notes: _notesController.text.isNotEmpty ? _notesController.text : null,
      );

      await BookingService().createBooking(bookingData);

      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Đặt lịch thành công!')));
        context.go('/bookings');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Không thể đặt lịch: $e')));
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Đặt lịch hẹn')),
      body: Stack(
        children: [
          ListView(
            padding: const EdgeInsets.only(bottom: 100),
            children: [
              _buildSection(
                'Thông tin khách hàng',
                TextField(
                  controller: _phoneController,
                  decoration: const InputDecoration(
                    labelText: 'Số điện thoại',
                    hintText: 'Nhập số điện thoại',
                    prefixIcon: Icon(Icons.phone),
                  ),
                  keyboardType: TextInputType.phone,
                ),
              ),
              _buildSection(
                'Chọn chi nhánh',
                Column(
                  children: _branches.map((branch) {
                    final isSelected = _selectedBranchId == branch.id;
                    return Card(
                      color: isSelected ? Colors.brown.shade50 : null,
                      child: ListTile(
                        leading: Icon(
                          isSelected
                              ? Icons.radio_button_checked
                              : Icons.radio_button_unchecked,
                          color: isSelected ? const Color(0xFF8B4513) : null,
                        ),
                        title: Text(branch.name),
                        subtitle: Text(branch.address),
                        onTap: () {
                          setState(() => _selectedBranchId = branch.id);
                          _fetchEmployees(branch.id);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
              if (_selectedBranchId != null)
                _buildSection(
                  'Chọn nhân viên',
                  _isLoadingEmployees
                      ? const Center(
                          child: Padding(
                            padding: EdgeInsets.all(20),
                            child: CircularProgressIndicator(),
                          ),
                        )
                      : _employees.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.all(20),
                          child: Text(
                            'Chi nhánh này chưa có nhân viên',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey),
                          ),
                        )
                      : Column(
                          children: _employees.map((employee) {
                            final isSelected =
                                _selectedEmployeeId == employee.id;
                            return Card(
                              color: isSelected ? Colors.brown.shade50 : null,
                              child: ListTile(
                                leading: Icon(
                                  isSelected
                                      ? Icons.radio_button_checked
                                      : Icons.radio_button_unchecked,
                                  color: isSelected
                                      ? const Color(0xFF8B4513)
                                      : null,
                                ),
                                title: Text(employee.fullName),
                                subtitle: Text(employee.phone),
                                onTap: () => setState(
                                  () => _selectedEmployeeId = employee.id,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                ),
              _buildSection(
                'Chọn dịch vụ',
                Column(
                  children: _services.map((service) {
                    final isSelected = _selectedServiceIds.contains(service.id);
                    return Card(
                      color: isSelected ? Colors.brown.shade50 : null,
                      child: ListTile(
                        leading: Icon(
                          isSelected
                              ? Icons.check_box
                              : Icons.check_box_outline_blank,
                          color: isSelected ? const Color(0xFF8B4513) : null,
                        ),
                        title: Text(service.serviceName),
                        subtitle: Text(
                          '${service.price}đ • ${service.estimatedTime} phút',
                        ),
                        onTap: () => _toggleService(service.id),
                      ),
                    );
                  }).toList(),
                ),
              ),
              _buildSection(
                'Chọn ngày giờ',
                Column(
                  children: [
                    Card(
                      child: ListTile(
                        leading: const Icon(
                          Icons.calendar_today,
                          color: Color(0xFF8B4513),
                        ),
                        title: const Text('Ngày'),
                        subtitle: Text(
                          '${_selectedDate.day.toString().padLeft(2, '0')}/${_selectedDate.month.toString().padLeft(2, '0')}/${_selectedDate.year}',
                        ),
                        onTap: _selectDate,
                      ),
                    ),
                    Card(
                      child: ListTile(
                        leading: const Icon(
                          Icons.access_time,
                          color: Color(0xFF8B4513),
                        ),
                        title: const Text('Giờ'),
                        subtitle: Text(
                          '${_selectedTime.hour.toString().padLeft(2, '0')}:${_selectedTime.minute.toString().padLeft(2, '0')}',
                        ),
                        onTap: _selectTime,
                      ),
                    ),
                  ],
                ),
              ),
              _buildSection(
                'Ghi chú',
                TextField(
                  controller: _notesController,
                  decoration: const InputDecoration(
                    hintText: 'Nhập ghi chú (tùy chọn)',
                  ),
                  maxLines: 4,
                ),
              ),
            ],
          ),
          if (_selectedServiceIds.isNotEmpty)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 4,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${_selectedServiceIds.length} dịch vụ • ${_calculateDuration()} phút',
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                        Text(
                          '${_calculateTotal()}đ',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF8B4513),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _handleSubmit,
                        child: _isSubmitting
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : const Text('Xác nhận đặt lịch'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, Widget child) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            child,
          ],
        ),
      ),
    );
  }
}
