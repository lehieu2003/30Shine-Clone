import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Stack>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen
                name='auth/login'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='auth/register'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='service/[id]'
                options={{ title: 'Chi tiết dịch vụ' }}
              />
              <Stack.Screen
                name='booking/create'
                options={{ title: 'Đặt lịch' }}
              />
              <Stack.Screen
                name='booking/[id]'
                options={{ title: 'Chi tiết đặt lịch' }}
              />
            </Stack>
            <StatusBar style='auto' />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
