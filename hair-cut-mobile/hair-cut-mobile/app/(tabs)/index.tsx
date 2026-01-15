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
import { serviceApi } from '@/lib/apis/services';
import { Service } from '@/types/service';
import { ServiceCard } from '@/components/ServiceCard';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, isAuth } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await serviceApi.fetchServices({
        page: 1,
        size: 10,
      });
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  if (!isAuth) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name='cut-outline' size={80} color='#8B4513' />
        <Text style={styles.welcomeTitle}>Chào mừng đến với Hair Cut</Text>
        <Text style={styles.welcomeSubtitle}>
          Đăng nhập để đặt lịch cắt tóc và trải nghiệm dịch vụ tốt nhất
        </Text>
        <View style={styles.authButtons}>
          <Button
            title='Đăng nhập'
            onPress={() => router.push('/auth/login')}
            style={styles.authButton}
          />
          <Button
            title='Đăng ký'
            onPress={() => router.push('/auth/register')}
            variant='outline'
            style={styles.authButton}
          />
        </View>
      </View>
    );
  }

  if (loading) {
    return <Loading fullScreen text='Đang tải...' />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.userName}>{user?.fullName || 'Khách hàng'}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => router.push('/booking/create')}
        >
          <Ionicons name='calendar' size={24} color='#fff' />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
          {services.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dịch vụ nào</Text>
          ) : (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => router.push(`/service/${service.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  authButtons: {
    width: '100%',
    gap: 12,
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
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  bookingButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
