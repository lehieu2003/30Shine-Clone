import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { bookingApi, BookingStatus } from '@/lib/apis/booking';
import { Booking } from '@/types/booking';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusColors: Record<BookingStatus, string> = {
  [BookingStatus.pending]: '#FFA500',
  [BookingStatus.confirmed]: '#4169E1',
  [BookingStatus.in_progress]: '#9370DB',
  [BookingStatus.completed]: '#32CD32',
  [BookingStatus.cancelled]: '#DC143C',
  [BookingStatus.success]: '#32CD32',
};

const statusLabels: Record<BookingStatus, string> = {
  [BookingStatus.pending]: 'Chờ xác nhận',
  [BookingStatus.confirmed]: 'Đã xác nhận',
  [BookingStatus.in_progress]: 'Đang thực hiện',
  [BookingStatus.completed]: 'Hoàn thành',
  [BookingStatus.cancelled]: 'Đã hủy',
  [BookingStatus.success]: 'Thành công',
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getBookingById(id as string);
      console.log('Booking detail response:', JSON.stringify(data, null, 2));
      console.log('Branch:', data.branch);
      console.log('Employee:', data.employee);
      console.log('BookingServices:', data.bookingServices);
      console.log('Services:', data.services);
      console.log('Customer:', data.customer);

      // Transform data to match expected format
      const transformedData = {
        ...data,
        bookingServices: data.services || data.bookingServices || [],
        totalAmount: Number(data.totalPrice || data.totalAmount || 0),
      };

      setBooking(transformedData as any);
    } catch (error) {
      console.error('Error fetching booking detail:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#8B4513' />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name='alert-circle-outline' size={80} color='#999' />
        <Text style={styles.errorText}>Không tìm thấy thông tin đặt lịch</Text>
        <Button
          title='Quay lại'
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const statusColor = statusColors[booking.status as BookingStatus] || '#999';
  const statusLabel =
    statusLabels[booking.status as BookingStatus] || booking.status;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
          <Ionicons name='checkmark-circle' size={48} color='#fff' />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin đặt lịch</Text>

          <View style={styles.infoRow}>
            <Ionicons name='calendar-outline' size={20} color='#666' />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ngày giờ hẹn</Text>
              <Text style={styles.infoValue}>
                {new Date(booking.appointmentDate).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {booking.branch ? (
            <View style={styles.infoRow}>
              <Ionicons name='location-outline' size={20} color='#666' />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Chi nhánh</Text>
                <Text style={styles.infoValue}>
                  {booking.branch?.name || 'N/A'}
                </Text>
                <Text style={styles.infoSubtext}>
                  {booking.branch?.address || ''}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Ionicons name='location-outline' size={20} color='#666' />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Chi nhánh</Text>
                <Text style={styles.infoValue}>ID: {booking.branchId}</Text>
              </View>
            </View>
          )}

          {booking.employee && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name='person-outline' size={20} color='#666' />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nhân viên</Text>
                  <Text style={styles.infoValue}>
                    {booking.employee?.fullName || 'N/A'}
                  </Text>
                  <Text style={styles.infoSubtext}>
                    {booking.employee?.phone || ''}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ</Text>
          {booking.bookingServices && booking.bookingServices.length > 0 ? (
            booking.bookingServices.map((bs, index) => (
              <View key={index} style={styles.serviceRow}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>
                    {bs?.service?.serviceName || 'N/A'}
                  </Text>
                  <Text style={styles.serviceTime}>
                    {bs?.service?.estimatedTime || 0} phút
                  </Text>
                </View>
                <Text style={styles.servicePrice}>
                  {(bs?.servicePrice || 0).toLocaleString('vi-VN')}đ
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Không có dịch vụ nào</Text>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {booking.totalAmount?.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </Card>

        {booking.notes && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>
              {booking.customer?.fullName || 'N/A'}
            </Text>
            <Text style={styles.customerPhone}>
              {booking.customer?.phone || ''}
            </Text>
            {booking.customer?.email && (
              <Text style={styles.customerEmail}>{booking.customer.email}</Text>
            )}
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>

      {booking.status === BookingStatus.pending && (
        <View style={styles.footer}>
          <Button
            title='Hủy lịch hẹn'
            onPress={() => {
              Alert.alert(
                'Hủy lịch hẹn',
                'Bạn có chắc chắn muốn hủy lịch hẹn này?',
                [
                  { text: 'Không', style: 'cancel' },
                  {
                    text: 'Hủy lịch',
                    style: 'destructive',
                    onPress: async () => {
                      // TODO: Implement cancel booking API
                      Alert.alert('Thông báo', 'Tính năng đang phát triển');
                    },
                  },
                ]
              );
            }}
            variant='outline'
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 32,
  },
  content: {
    flex: 1,
  },
  statusBanner: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceTime: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B4513',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  customerInfo: {
    paddingVertical: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  customerPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});
