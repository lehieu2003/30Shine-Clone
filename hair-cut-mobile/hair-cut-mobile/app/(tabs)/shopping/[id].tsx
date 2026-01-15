import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productApi } from '@/lib/apis/products';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/product';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productApi.fetchProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, quantity);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color='#007AFF' />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/shopping/cart')}>
          <Ionicons name='cart-outline' size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Product Image */}
        <Image
          source={{
            uri: product.imageUrl || 'https://via.placeholder.com/400',
          }}
          style={styles.productImage}
        />

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={
                    i < Math.floor(product.ratingScore)
                      ? 'star'
                      : 'star-outline'
                  }
                  size={16}
                  color='#FFA500'
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.ratingScore.toFixed(1)} | Đã bán {product.totalSold}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.isDiscount && (
              <>
                <Text style={styles.originalPrice}>
                  {formatPrice(product.listedPrice)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    -{product.discountPercent}%
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Brand & Category */}
          {product.brand && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thương hiệu:</Text>
              <Text style={styles.infoValue}>{product.brand}</Text>
            </View>
          )}
          {product.category && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Danh mục:</Text>
              <Text style={styles.infoValue}>{product.category}</Text>
            </View>
          )}

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Ionicons
              name={product.isOutOfStock ? 'close-circle' : 'checkmark-circle'}
              size={20}
              color={product.isOutOfStock ? '#FF3B30' : '#34C759'}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.isOutOfStock ? '#FF3B30' : '#34C759' },
              ]}
            >
              {product.isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
            </Text>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thành phần</Text>
              <Text style={styles.description}>{product.ingredients}</Text>
            </View>
          )}

          {/* Manual */}
          {product.manual && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hướng dẫn sử dụng</Text>
              <Text style={styles.description}>{product.manual}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {!product.isOutOfStock && (
        <View style={styles.bottomBar}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name='remove' size={20} color='#000' />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name='add' size={20} color='#000' />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Ionicons name='cart' size={24} color='#fff' />
            <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 12,
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
