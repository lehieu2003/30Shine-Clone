int intFromJson(dynamic value) {
  if (value == null) return 0;

  if (value is int) return value;

  if (value is double) return value.toInt();

  if (value is String) {
    return int.tryParse(value) ?? 0;
  }

  return 0;
}

num numFromJson(dynamic value) {
  if (value == null) return 0;

  if (value is num) return value;

  if (value is String) {
    return num.tryParse(value) ?? 0;
  }

  return 0;
}

bool boolFromJson(dynamic value) {
  if (value == null) return false;

  if (value is bool) return value;

  if (value is int) return value == 1;

  if (value is String) {
    return value.toLowerCase() == 'true' || value == '1';
  }

  return false;
}
