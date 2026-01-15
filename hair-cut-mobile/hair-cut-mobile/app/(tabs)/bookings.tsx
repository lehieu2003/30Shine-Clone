import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { bookingApi, BookingStatus } from '@/lib/apis/booking';
import { Booking } from '@/types/booking';
import { BookingCard } from '@/components/BookingCard';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusFilters = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ xác nhận', value: BookingStatus.pending },
  { label: 'Đã xác nhận', value: BookingStatus.confirmed },
  { label: 'Hoàn thành', value: BookingStatus.completed },
  { label: 'Đã hủy', value: BookingStatus.cancelled },
];

export default function BookingsScreen() {
  const { isAuth } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchBookings = async (status = '') => {
    try {
      setLoading(true);
      const response = await bookingApi.getUserBookings({
        page: 1,
        size: 50,
        status: status || undefined,
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchBookings(selectedStatus);
    }
  }, [isAuth, selectedStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(selectedStatus);
  };

  if (!isAuth) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name='calendar-outline' size={80} color='#8B4513' />
        <Text style={styles.authTitle}>Vui lòng đăng nhập</Text>
        <Text style={styles.authSubtitle}>
          Đăng nhập để xem lịch hẹn của bạn
        </Text>
        <View style={styles.authButtons}>
          <Button
            title='Đăng nhập'
            onPress={() => router.push('/auth/login')}
            style={styles.authButton}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch hẹn của tôi</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/booking/create')}
        >
          <Ionicons name='add' size={24} color='#fff' />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedStatus === filter.value && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedStatus(filter.value)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === filter.value && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <Loading fullScreen text='Đang tải...' />
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.list}>
            {bookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name='calendar-outline' size={80} color='#ddd' />
                <Text style={styles.emptyText}>Chưa có lịch hẹn nào</Text>
                <Button
                  title='Đặt lịch ngay'
                  onPress={() => router.push('/booking/create')}
                  style={styles.emptyButton}
                />
              </View>
            ) : (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onPress={() => router.push(`/booking/${booking.id}`)}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  authButtons: {
    width: '100%',
  },
  authButton: {
    width: '100%',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterContent: {
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: '#8B4513',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});
