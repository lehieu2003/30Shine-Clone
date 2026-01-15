import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, isAuth, setUser, setIsAuth } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('accessToken');
          setUser(null);
          setIsAuth(false);
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  if (!isAuth) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name='person-circle-outline' size={100} color='#8B4513' />
        <Text style={styles.authTitle}>Chào mừng bạn!</Text>
        <Text style={styles.authSubtitle}>
          Đăng nhập để quản lý tài khoản và xem lịch sử đặt lịch
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name='person-circle' size={80} color='#fff' />
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name='call-outline' size={20} color='#666' />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Ionicons name='mail-outline' size={20} color='#666' />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>

          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name='person-outline' size={24} color='#333' />
                <Text style={styles.menuText}>Thông tin cá nhân</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#999' />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name='lock-closed-outline' size={24} color='#333' />
                <Text style={styles.menuText}>Đổi mật khẩu</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#999' />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name='notifications-outline' size={24} color='#333' />
                <Text style={styles.menuText}>Thông báo</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#999' />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>

          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name='help-circle-outline' size={24} color='#333' />
                <Text style={styles.menuText}>Trung tâm trợ giúp</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#999' />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name='document-text-outline' size={24} color='#333' />
                <Text style={styles.menuText}>Điều khoản sử dụng</Text>
              </View>
              <Ionicons name='chevron-forward' size={20} color='#999' />
            </TouchableOpacity>
          </Card>
        </View>

        <Button
          title='Đăng xuất'
          onPress={handleLogout}
          variant='outline'
          style={styles.logoutButton}
        />
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
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  infoCard: {
    margin: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  menuCard: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
});
