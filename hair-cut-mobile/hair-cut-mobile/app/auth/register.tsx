import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import authService from '@/services/auth.service';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
      valid = false;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      valid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Check if phone is already registered
      const isRegistered = await authService.isPhoneRegistered(formData.phone);
      if (isRegistered) {
        Alert.alert('Lỗi', 'Số điện thoại đã được đăng ký');
        return;
      }

      await authService.registerUser({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      Alert.alert('Đăng ký thành công!', 'Bạn có thể đăng nhập ngay bây giờ', [
        {
          text: 'OK',
          onPress: () => router.replace('/auth/login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Đăng ký thất bại',
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>Đăng ký để bắt đầu</Text>
        </View>

        <View style={styles.form}>
          <Input
            label='Họ và tên'
            placeholder='Nhập họ và tên'
            value={formData.fullName}
            onChangeText={(text) => updateField('fullName', text)}
            error={errors.fullName}
            icon='person-outline'
          />

          <Input
            label='Số điện thoại'
            placeholder='Nhập số điện thoại'
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            error={errors.phone}
            icon='call-outline'
            keyboardType='phone-pad'
          />

          <Input
            label='Email'
            placeholder='Nhập email'
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            error={errors.email}
            icon='mail-outline'
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <Input
            label='Mật khẩu'
            placeholder='Nhập mật khẩu'
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            error={errors.password}
            icon='lock-closed-outline'
            isPassword
          />

          <Input
            label='Xác nhận mật khẩu'
            placeholder='Nhập lại mật khẩu'
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            error={errors.confirmPassword}
            icon='lock-closed-outline'
            isPassword
          />

          <Button
            title='Đăng ký'
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <Button
              title='Đăng nhập'
              onPress={() => router.back()}
              variant='outline'
              size='small'
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
});
