import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/user_model.dart';
import '../../services/network/auth_service.dart';

final authServiceProvider = Provider<AuthService>((ref) => AuthService());

class AuthState {
  final User? user;
  final bool isAuth;
  final bool isLoading;

  AuthState({this.user, this.isAuth = false, this.isLoading = true});

  AuthState copyWith({User? user, bool? isAuth, bool? isLoading}) {
    return AuthState(
      user: user ?? this.user,
      isAuth: isAuth ?? this.isAuth,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _init();
    return AuthState();
  }

  Future<void> _init() async {
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.getCurrentUser();
      state = state.copyWith(user: user, isAuth: true, isLoading: false);
    } catch (e) {
      state = state.copyWith(user: null, isAuth: false, isLoading: false);
    }
  }

  Future<void> login(String username, String password) async {
    final authService = ref.read(authServiceProvider);
    final result = await authService.login(
      username: username,
      password: password,
    );

    state = state.copyWith(
      user: result['user'] as User,
      isAuth: true,
      isLoading: false,
    );
  }

  Future<void> register({
    required String fullName,
    required String email,
    required String password,
    required String phone,
  }) async {
    final authService = ref.read(authServiceProvider);
    final user = await authService.register(
      fullName: fullName,
      email: email,
      password: password,
      phone: phone,
    );

    state = state.copyWith(user: user, isAuth: true, isLoading: false);
  }

  Future<void> refreshUser() async {
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.getCurrentUser();
      state = state.copyWith(user: user, isAuth: true);
    } catch (e) {
      state = state.copyWith(user: null, isAuth: false);
    }
  }

  Future<void> logout() async {
    final authService = ref.read(authServiceProvider);
    await authService.logout();
    state = state.copyWith(user: null, isAuth: false);
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});
