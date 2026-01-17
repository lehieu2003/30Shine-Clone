import 'package:flutter/material.dart';

class LoadingWidget extends StatelessWidget {
  final String? text;
  final bool fullScreen;

  const LoadingWidget({Key? key, this.text, this.fullScreen = false})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    final content = Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const CircularProgressIndicator(),
        if (text != null) ...[
          const SizedBox(height: 16),
          Text(text!, style: Theme.of(context).textTheme.bodyMedium),
        ],
      ],
    );

    if (fullScreen) {
      return Scaffold(body: Center(child: content));
    }

    return Center(child: content);
  }
}
