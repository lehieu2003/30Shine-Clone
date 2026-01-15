import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import apiClient from '@/lib/api';

export default function PaymentScreen() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'cod'>('momo');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePayment = async () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống');
      return;
    }

    setLoading(true);
    try {
      if (selectedMethod === 'momo') {
        // Create MoMo payment
        const orderId = `ORDER_${Date.now()}`;
        const response = await apiClient.post('api/payment/momo/create', {
          orderId: orderId,
          amount: getTotalPrice(),
          orderInfo: 'Thanh toán đơn hàng',
          cartId: cart.id,
        });

        if (response.data.payUrl) {
          // Open MoMo payment URL in browser
          const payUrl = response.data.payUrl;

          const canOpen = await Linking.canOpenURL(payUrl);
          if (canOpen) {
            await Linking.openURL(payUrl);

            Alert.alert(
              'Thông báo',
              'Vui lòng hoàn tất thanh toán trên trình duyệt và quay lại ứng dụng',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back();
                  },
                },
              ]
            );
          } else {
            Alert.alert('Lỗi', 'Không thể mở trang thanh toán MoMo');
          }
        }
      } else {
        // COD payment
        const response = await apiClient.post('/orders', {
          cartId: cart.id,
          paymentMethod: 'cod',
        });

        Alert.alert(
          'Đặt hàng thành công',
          'Đơn hàng của bạn đã được tạo. Vui lòng thanh toán khi nhận hàng.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await clearCart();
                router.replace('/(tabs)/shopping');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể xử lý thanh toán'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng</Text>
          {cart?.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === 'momo' && styles.paymentMethodActive,
            ]}
            onPress={() => setSelectedMethod('momo')}
          >
            <View style={styles.paymentMethodInfo}>
              <Ionicons
                name='wallet-outline'
                size={24}
                color={selectedMethod === 'momo' ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedMethod === 'momo' && styles.paymentMethodTextActive,
                ]}
              >
                Ví MoMo
              </Text>
            </View>
            {selectedMethod === 'momo' && (
              <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedMethod === 'cod' && styles.paymentMethodActive,
            ]}
            onPress={() => setSelectedMethod('cod')}
          >
            <View style={styles.paymentMethodInfo}>
              <Ionicons
                name='cash-outline'
                size={24}
                color={selectedMethod === 'cod' ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  selectedMethod === 'cod' && styles.paymentMethodTextActive,
                ]}
              >
                Thanh toán khi nhận hàng (COD)
              </Text>
            </View>
            {selectedMethod === 'cod' && (
              <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
            )}
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí vận chuyển</Text>
            <Text style={styles.priceValue}>Miễn phí</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text style={styles.payButtonText}>Xác nhận thanh toán</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentMethodActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    marginLeft: 12,
    color: '#666',
  },
  paymentMethodTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bottomBar: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
