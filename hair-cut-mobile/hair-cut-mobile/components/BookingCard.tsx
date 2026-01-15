import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Booking, BookingStatus } from '@/types/booking';
import { Ionicons } from '@expo/vector-icons';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

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

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
}) => {
  const statusColor = statusColors[booking.status as BookingStatus] || '#999';
  const statusLabel =
    statusLabels[booking.status as BookingStatus] || booking.status;

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Ionicons name='calendar-outline' size={20} color='#8B4513' />
          <Text style={styles.date}>
            {new Date(booking.appointmentDate).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      {booking.bookingServices && booking.bookingServices.length > 0 && (
        <View style={styles.services}>
          <Text style={styles.servicesLabel}>Dịch vụ:</Text>
          {booking.bookingServices.map((bs, index) => (
            <Text key={index} style={styles.serviceName}>
              • {bs?.service?.serviceName || 'N/A'}
            </Text>
          ))}
        </View>
      )}

      {booking.employee && (
        <View style={styles.row}>
          <Ionicons name='person-outline' size={16} color='#666' />
          <Text style={styles.info}>
            Thợ: {booking.employee?.fullName || 'N/A'}
          </Text>
        </View>
      )}

      {booking.branch && (
        <View style={styles.row}>
          <Ionicons name='location-outline' size={16} color='#666' />
          <Text style={styles.info}>{booking.branch?.name || 'N/A'}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.total}>
          {booking.totalAmount?.toLocaleString('vi-VN')}đ
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  services: {
    marginBottom: 12,
  },
  servicesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'right',
  },
});
