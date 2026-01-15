import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from './ui/Card';
import { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
}) => {
  return (
    <Card style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: service.bannerImageUrl }}
        style={styles.image}
        resizeMode='cover'
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {service.serviceName}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {service.price.toLocaleString('vi-VN')}đ
          </Text>
          <Text style={styles.time}>{service.estimatedTime} phút</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B4513',
  },
  time: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
