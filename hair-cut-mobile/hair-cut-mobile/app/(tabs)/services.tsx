import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
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

export default function ServicesScreen() {
  const { isAuth } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = async (keyword = '') => {
    try {
      setLoading(true);
      const response = await serviceApi.fetchServices({
        keyword,
        page: 1,
        size: 50,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices(searchQuery);
  };

  if (!isAuth) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name='cut-outline' size={80} color='#8B4513' />
        <Text style={styles.authTitle}>Vui lòng đăng nhập</Text>
        <Text style={styles.authSubtitle}>
          Đăng nhập để xem danh sách dịch vụ
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.flex}>
          <View style={styles.header}>
            <Text style={styles.title}>Dịch vụ</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name='search'
              size={20}
              color='#999'
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder='Tìm kiếm dịch vụ...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor='#999'
            />
            {searchQuery.length > 0 && (
              <Ionicons
                name='close-circle'
                size={20}
                color='#999'
                onPress={() => setSearchQuery('')}
              />
            )}
          </View>

          {loading ? (
            <Loading fullScreen text='Đang tải...' />
          ) : (
            <ScrollView
              style={styles.content}
              keyboardShouldPersistTaps='handled'
              keyboardDismissMode='on-drag'
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View style={styles.list}>
                {services.length === 0 ? (
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? 'Không tìm thấy dịch vụ nào'
                      : 'Chưa có dịch vụ nào'}
                  </Text>
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
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  flex: {
    flex: 1,
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
