import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../features/auth/auth_provider.dart';
import '../features/cart/cart_provider.dart';

class MainScreen extends ConsumerStatefulWidget {
  final Widget child;

  const MainScreen({Key? key, required this.child}) : super(key: key);

  @override
  ConsumerState<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends ConsumerState<MainScreen> {
  int _selectedIndex = 0;

  final List<({String path, String label, IconData icon})> _tabs = [
    (path: '/', label: 'Trang chủ', icon: Icons.home),
    (path: '/services', label: 'Dịch vụ', icon: Icons.cut),
    (path: '/bookings', label: 'Lịch hẹn', icon: Icons.calendar_today),
    (path: '/shopping', label: 'Sản phẩm', icon: Icons.shopping_bag),
    (path: '/profile', label: 'Cá nhân', icon: Icons.person),
  ];

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final cartState = ref.watch(cartProvider);

    return Scaffold(
      drawer: _buildDrawer(context),
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() => _selectedIndex = index);
          context.go(_tabs[index].path);
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF8B4513),
        unselectedItemColor: Colors.grey,
        items: _tabs
            .map(
              (tab) => BottomNavigationBarItem(
                icon: Icon(tab.icon),
                label: tab.label,
              ),
            )
            .toList(),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    final authState = ref.watch(authProvider);
    final cartState = ref.watch(cartProvider);
    final user = authState.user;

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Drawer Header
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(color: Color(0xFF8B4513)),
            currentAccountPicture: CircleAvatar(
              backgroundColor: Colors.white,
              child: Text(
                user?.fullName?.substring(0, 1).toUpperCase() ?? 'U',
                style: const TextStyle(
                  fontSize: 40,
                  color: Color(0xFF8B4513),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            accountName: Text(
              user?.fullName ?? 'Người dùng',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            accountEmail: Text(
              user?.email ?? '',
              style: const TextStyle(fontSize: 14),
            ),
          ),

          // Navigation Items
          _buildDrawerItem(
            context: context,
            icon: Icons.home,
            title: 'Trang chủ',
            path: '/',
            index: 0,
          ),
          _buildDrawerItem(
            context: context,
            icon: Icons.cut,
            title: 'Dịch vụ',
            path: '/services',
            index: 1,
          ),
          _buildDrawerItem(
            context: context,
            icon: Icons.calendar_today,
            title: 'Lịch hẹn',
            path: '/bookings',
            index: 2,
          ),
          _buildDrawerItem(
            context: context,
            icon: Icons.shopping_bag,
            title: 'Sản phẩm',
            path: '/shopping',
            index: 3,
          ),

          // Cart with badge
          ListTile(
            leading: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.shopping_cart),
                if (cartState.totalItems > 0)
                  Positioned(
                    right: -8,
                    top: -4,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        cartState.totalItems > 99
                            ? '99+'
                            : cartState.totalItems.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            title: const Text('Giỏ hàng'),
            onTap: () {
              Navigator.pop(context);
              context.push('/shopping/cart');
            },
          ),

          _buildDrawerItem(
            context: context,
            icon: Icons.person,
            title: 'Cá nhân',
            path: '/profile',
            index: 4,
          ),

          const Divider(),

          // Settings & Logout
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Cài đặt'),
            onTap: () {
              Navigator.pop(context);
              // Navigate to settings
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Chức năng đang phát triển')),
              );
            },
          ),
          ListTile(
            leading: const Icon(Icons.help_outline),
            title: const Text('Trợ giúp'),
            onTap: () {
              Navigator.pop(context);
              // Navigate to help
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Chức năng đang phát triển')),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Đăng xuất', style: TextStyle(color: Colors.red)),
            onTap: () {
              Navigator.pop(context);
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Đăng xuất'),
                  content: const Text('Bạn có chắc muốn đăng xuất?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Hủy'),
                    ),
                    TextButton(
                      onPressed: () {
                        ref.read(authProvider.notifier).logout();
                        Navigator.pop(context);
                        context.go('/auth/login');
                      },
                      child: const Text(
                        'Đăng xuất',
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String path,
    required int index,
  }) {
    final isSelected = _selectedIndex == index;

    return ListTile(
      leading: Icon(icon, color: isSelected ? const Color(0xFF8B4513) : null),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? const Color(0xFF8B4513) : null,
          fontWeight: isSelected ? FontWeight.bold : null,
        ),
      ),
      selected: isSelected,
      selectedTileColor: const Color(0xFF8B4513).withOpacity(0.1),
      onTap: () {
        Navigator.pop(context);
        setState(() => _selectedIndex = index);
        context.go(path);
      },
    );
  }
}
