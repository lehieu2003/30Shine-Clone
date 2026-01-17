import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/service_model.dart';
import '../../services/network/service_service.dart';

final serviceServiceProvider = Provider<ServiceService>(
  (ref) => ServiceService(),
);

class ServicesState {
  final List<ServiceModel> services;
  final bool isLoading;
  final String? error;

  ServicesState({this.services = const [], this.isLoading = false, this.error});

  ServicesState copyWith({
    List<ServiceModel>? services,
    bool? isLoading,
    String? error,
  }) {
    return ServicesState(
      services: services ?? this.services,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ServicesNotifier extends Notifier<ServicesState> {
  @override
  ServicesState build() {
    return ServicesState();
  }

  Future<void> fetchServices({
    String keyword = '',
    int page = 1,
    int size = 10,
  }) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final serviceService = ref.read(serviceServiceProvider);
      final result = await serviceService.fetchServices(
        keyword: keyword,
        page: page,
        size: size,
      );
      state = state.copyWith(
        services: result['data'] as List<ServiceModel>,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

final servicesProvider = NotifierProvider<ServicesNotifier, ServicesState>(
  () => ServicesNotifier(),
);

final serviceDetailProvider = FutureProvider.family<ServiceModel, int>((
  ref,
  id,
) async {
  final service = ref.watch(serviceServiceProvider);
  return await service.getServiceById(id);
});
