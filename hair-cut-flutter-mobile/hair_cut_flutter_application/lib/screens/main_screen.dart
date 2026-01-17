import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainScreen extends StatefulWidget {
  final Widget child;

  const MainScreen({Key? key, required this.child}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
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
    return Scaffold(
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
}
