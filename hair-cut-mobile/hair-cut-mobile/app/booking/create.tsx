import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { serviceApi } from '@/lib/apis/services';
import { branchApi } from '@/lib/apis/branch';
import { branchEmployeeApi } from '@/lib/apis/branchEmployee';
import { bookingApi } from '@/lib/apis/booking';
import { Service } from '@/types/service';
import { Branch } from '@/types/branch';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Employee {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
}

export default function CreateBookingScreen() {
  const { user, isAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [formData, setFormData] = useState({
    phoneNumber: user?.phone || '',
    appointmentDate: new Date(),
    serviceIds: [] as number[],
    branchId: 0,
    employeeId: 0,
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      router.replace('/auth/login');
      return;
    }
    fetchInitialData();
  }, [isAuth]);

  useEffect(() => {
    if (formData.branchId) {
      fetchEmployees(formData.branchId);
    }
  }, [formData.branchId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [servicesRes, branchesRes] = await Promise.all([
        serviceApi.fetchServices({ page: 1, size: 100 }),
        branchApi.getBranches({ page: 1, size: 100 }),
      ]);
      setServices(servicesRes.data || []);
      setBranches(branchesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (branchId: number) => {
    try {
      setLoadingEmployees(true);
      setEmployees([]); // Reset employees list
      const response = await branchEmployeeApi.getEmployeesByBranchId(branchId);
      console.log('Employees response:', response);

      // Handle different response structures
      let employeesList = [];
      if (Array.isArray(response)) {
        employeesList = response;
      } else if (
        response?.data?.employees &&
        Array.isArray(response.data.employees)
      ) {
        employeesList = response.data.employees;
      } else if (response?.data && Array.isArray(response.data)) {
        employeesList = response.data;
      } else if (response?.employees && Array.isArray(response.employees)) {
        employeesList = response.employees;
      }

      console.log('Employees list:', employeesList);
      console.log('First employee:', JSON.stringify(employeesList[0], null, 2));

      // Transform data to get employee info
      const transformedEmployees = employeesList.map((item: any) => ({
        id: item.employee?.id || item.employeeId,
        fullName: item.employee?.fullName || item.fullName || 'N/A',
        phone: item.employee?.phone || item.phone || '',
        email: item.employee?.email || item.email,
      }));

      console.log('Transformed employees:', transformedEmployees);
      setEmployees(transformedEmployees);

      if (transformedEmployees.length === 0) {
        Alert.alert('Thông báo', 'Chi nhánh này chưa có nhân viên nào');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách nhân viên');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const toggleService = (serviceId: number) => {
    setFormData((prev) => {
      const serviceIds = prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId];
      return { ...prev, serviceIds };
    });
  };

  const calculateTotal = () => {
    return services
      .filter((s) => formData.serviceIds.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  };

  const calculateDuration = () => {
    return services
      .filter((s) => formData.serviceIds.includes(s.id))
      .reduce((sum, s) => sum + s.estimatedTime, 0);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        appointmentDate: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          prev.appointmentDate.getHours(),
          prev.appointmentDate.getMinutes()
        ),
      }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData((prev) => ({
        ...prev,
        appointmentDate: new Date(
          prev.appointmentDate.getFullYear(),
          prev.appointmentDate.getMonth(),
          prev.appointmentDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        ),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.branchId) {
      Alert.alert('Lỗi', 'Vui lòng chọn chi nhánh');
      return;
    }

    if (formData.serviceIds.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một dịch vụ');
      return;
    }

    if (!formData.employeeId) {
      Alert.alert('Lỗi', 'Vui lòng chọn nhân viên');
      return;
    }

    try {
      setLoading(true);
      await bookingApi.createBooking({
        phoneNumber: formData.phoneNumber,
        appointmentDate: formData.appointmentDate.toISOString(),
        serviceIds: formData.serviceIds,
        branchId: formData.branchId,
        employeeId: formData.employeeId,
        notes: formData.notes || undefined,
      });

      Alert.alert('Thành công', 'Đặt lịch thành công!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/bookings'),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) {
    return <Loading fullScreen text='Đang tải...' />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Input
            label='Số điện thoại'
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
            placeholder='Nhập số điện thoại'
            keyboardType='phone-pad'
            icon='call-outline'
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn chi nhánh</Text>
          {branches.map((branch) => (
            <TouchableOpacity
              key={branch.id}
              style={[
                styles.optionItem,
                formData.branchId === branch.id && styles.optionItemActive,
              ]}
              onPress={() => setFormData({ ...formData, branchId: branch.id })}
            >
              <View style={styles.optionLeft}>
                <Ionicons
                  name={
                    formData.branchId === branch.id
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={24}
                  color={formData.branchId === branch.id ? '#8B4513' : '#999'}
                />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{branch.name}</Text>
                  <Text style={styles.optionSubtitle}>{branch.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {formData.branchId > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn nhân viên</Text>
            {loadingEmployees ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='small' color='#8B4513' />
                <Text style={styles.loadingText}>Đang tải nhân viên...</Text>
              </View>
            ) : employees.length === 0 ? (
              <Text style={styles.emptyText}>
                Chi nhánh này chưa có nhân viên
              </Text>
            ) : (
              employees.map((employee) => (
                <TouchableOpacity
                  key={employee.id}
                  style={[
                    styles.optionItem,
                    formData.employeeId === employee.id &&
                      styles.optionItemActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, employeeId: employee.id })
                  }
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={
                        formData.employeeId === employee.id
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={24}
                      color={
                        formData.employeeId === employee.id ? '#8B4513' : '#999'
                      }
                    />
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>
                        {employee.fullName}
                      </Text>
                      <Text style={styles.optionSubtitle}>
                        {employee.phone}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn dịch vụ</Text>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceItem,
                formData.serviceIds.includes(service.id) &&
                  styles.serviceItemActive,
              ]}
              onPress={() => toggleService(service.id)}
            >
              <View style={styles.serviceLeft}>
                <Ionicons
                  name={
                    formData.serviceIds.includes(service.id)
                      ? 'checkbox'
                      : 'square-outline'
                  }
                  size={24}
                  color={
                    formData.serviceIds.includes(service.id)
                      ? '#8B4513'
                      : '#999'
                  }
                />
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.serviceInfo}>
                    {service.price.toLocaleString('vi-VN')}đ •{' '}
                    {service.estimatedTime} phút
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày giờ</Text>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name='calendar-outline' size={24} color='#8B4513' />
            <View style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Ngày</Text>
              <Text style={styles.dateTimeValue}>
                {formData.appointmentDate.toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name='time-outline' size={24} color='#8B4513' />
            <View style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Giờ</Text>
              <Text style={styles.dateTimeValue}>
                {formData.appointmentDate.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.appointmentDate}
              mode='date'
              display='default'
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={formData.appointmentDate}
              mode='time'
              display='default'
              onChange={handleTimeChange}
            />
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <Input
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder='Nhập ghi chú (tùy chọn)'
            multiline
            numberOfLines={4}
            style={styles.notesInput}
          />
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>

      {formData.serviceIds.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {formData.serviceIds.length} dịch vụ • {calculateDuration()}{' '}
                phút
              </Text>
              <Text style={styles.summaryValue}>
                {calculateTotal().toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>
          <Button
            title='Xác nhận đặt lịch'
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemActive: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceItemActive: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceInfo: {
    fontSize: 14,
    color: '#666',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryContainer: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
