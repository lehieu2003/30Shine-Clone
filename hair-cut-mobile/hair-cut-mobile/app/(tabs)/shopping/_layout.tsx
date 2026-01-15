import { Stack } from 'expo-router';

export default function ShoppingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="cart/index" />
      <Stack.Screen name="cart/payment/index" />
    </Stack>
  );
}
