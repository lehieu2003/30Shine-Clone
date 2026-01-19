import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/auth_provider.dart';
import '../../screens/auth/login_screen.dart';
import '../../screens/auth/register_screen.dart';
import '../../screens/home/home_screen.dart';
import '../../screens/services/services_screen.dart';
import '../../screens/services/service_detail_screen.dart';
import '../../screens/bookings/bookings_screen.dart';
import '../../screens/bookings/booking_detail_screen.dart';
import '../../screens/bookings/create_booking_screen.dart';
import '../../screens/profile/profile_screen.dart';
import '../../screens/shopping/shopping_screen.dart';
import '../../screens/shopping/product_detail_screen.dart';
import '../../screens/shopping/cart_screen.dart';
import '../../screens/shopping/payment_screen.dart';
import '../../screens/main_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: authState.isAuth ? '/' : '/auth/login',
    redirect: (context, state) {
      final isAuth = authState.isAuth;
      final isLoading = authState.isLoading;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');

      if (isLoading) return null;

      if (!isAuth && !isAuthRoute) {
        return '/auth/login';
      }

      if (isAuth && isAuthRoute) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => MainScreen(child: child),
        routes: [
          GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
          GoRoute(
            path: '/services',
            builder: (context, state) => const ServicesScreen(),
          ),
          GoRoute(
            path: '/bookings',
            builder: (context, state) => const BookingsScreen(),
          ),
          GoRoute(
            path: '/shopping',
            builder: (context, state) => const ShoppingScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/service/:id',
        builder: (context, state) {
          final id = int.parse(state.pathParameters['id']!);
          return ServiceDetailScreen(serviceId: id);
        },
      ),
      GoRoute(
        path: '/booking/create',
        builder: (context, state) => const CreateBookingScreen(),
      ),
      GoRoute(
        path: '/booking/:id',
        builder: (context, state) {
          final id = int.parse(state.pathParameters['id']!);
          return BookingDetailScreen(bookingId: id);
        },
      ),
      GoRoute(
        path: '/shopping/cart',
        builder: (context, state) => const CartScreen(),
      ),
      GoRoute(
        path: '/shopping/cart/payment',
        builder: (context, state) => const PaymentScreen(),
      ),
      GoRoute(
        path: '/shopping/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ProductDetailScreen(productId: id);
        },
      ),
    ],
  );
});
