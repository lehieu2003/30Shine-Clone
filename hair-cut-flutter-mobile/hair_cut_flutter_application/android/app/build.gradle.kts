plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.hair_cut_flutter_application"

    // SDK + NDK theo yêu cầu plugin (flutter_secure_storage)
    compileSdk = 36
    ndkVersion = "27.0.12077973"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.hair_cut_flutter_application"

        // Plugin yêu cầu minSdk 24
        minSdk = 24

        // targetSdk matching compileSdk cho chuẩn
        targetSdk = 36

        // Version lấy từ flutter config nếu muốn
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}
