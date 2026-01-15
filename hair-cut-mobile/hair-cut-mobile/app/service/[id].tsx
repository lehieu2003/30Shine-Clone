import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { serviceApi } from '@/lib/apis/services';
import { Service } from '@/types/service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const data = await serviceApi.getServiceById(id as string);
      setService(data);
    } catch (error) {
      console.error('Error fetching service detail:', error);
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

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name='alert-circle-outline' size={80} color='#999' />
        <Text style={styles.errorText}>Không tìm thấy dịch vụ</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Image
          source={{ uri: service.bannerImageUrl }}
          style={styles.banner}
          resizeMode='cover'
        />

        <View style={styles.body}>
          <Text style={styles.name}>{service.serviceName}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name='cash-outline' size={24} color='#8B4513' />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Giá</Text>
                <Text style={styles.infoValue}>
                  {service.price.toLocaleString('vi-VN')}đ
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name='time-outline' size={24} color='#8B4513' />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Thời gian</Text>
                <Text style={styles.infoValue}>
                  {service.estimatedTime} phút
                </Text>
              </View>
            </View>
          </View>

          <Card style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
            <Text style={styles.description}>{service.description}</Text>
          </Card>

          {service.steps && service.steps.length > 0 && (
            <Card style={styles.stepsCard}>
              <Text style={styles.sectionTitle}>Quy trình thực hiện</Text>
              {service.steps
                .sort((a, b) => a.stepOrder - b.stepOrder)
                .map((step, index) => (
                  <View key={step.id || index} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>
                        {step.stepOrder}
                      </Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step.stepTitle}</Text>
                      {step.stepDescription && (
                        <Text style={styles.stepDescription}>
                          {step.stepDescription}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Tổng tiền</Text>
          <Text style={styles.price}>
            {service.price.toLocaleString('vi-VN')}đ
          </Text>
        </View>
        <Button
          title='Đặt lịch ngay'
          onPress={() => router.push('/booking/create')}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  content: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 250,
  },
  body: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  stepsCard: {
    marginBottom: 100,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B4513',
  },
  bookButton: {
    flex: 1,
  },
});
