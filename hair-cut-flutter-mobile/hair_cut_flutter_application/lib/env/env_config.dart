import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  static String get apiUrl => dotenv.env['API_URL'] ?? 'http://localhost:3111';

  static bool get isProduction => dotenv.env['ENVIRONMENT'] == 'production';

  static String get environment => dotenv.env['ENVIRONMENT'] ?? 'development';
}
