@echo off
chcp 65001 >nul
title Fake Data into Database - Hair Cut Application

echo.
echo ===============================================
echo    FAKE DATA VÀO DATABASE - HAIR CUT APP
echo ===============================================
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Lỗi: Không tìm thấy package.json
    echo Vui lòng chạy script này từ thư mục hair-cut-be
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️  Không tìm thấy node_modules, đang cài đặt dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Lỗi khi cài đặt dependencies
        pause
        exit /b 1
    )
)

:menu
echo.
echo CHỌN HÀNH ĐỘNG:
echo.
echo 1. Chạy tất cả scripts (Recommended)
echo 2. Chỉ tạo users và booking data
echo 3. Chỉ thêm services data
echo 4. Chỉ thêm products data
echo 5. Kiểm tra dữ liệu hiện tại
echo 6. Reset database
echo 7. Prisma Studio
echo 0. Thoát
echo.
set /p choice="Nhập lựa chọn của bạn (0-7): "

if "%choice%"=="1" goto run_all
if "%choice%"=="2" goto run_users
if "%choice%"=="3" goto run_services
if "%choice%"=="4" goto run_products
if "%choice%"=="5" goto check_data
if "%choice%"=="6" goto reset_db
if "%choice%"=="7" goto prisma_studio
if "%choice%"=="0" goto exit
goto invalid_choice

:run_all
echo.
echo 🚀 Đang chạy tất cả scripts...
node src/database/run_all_seeders.js
if errorlevel 1 (
    echo ❌ Có lỗi xảy ra
    goto end
)
echo ✅ Hoàn thành!
goto end

:run_users
echo.
echo 👥 Đang tạo users và booking data...
node src/database/fake_new_data.js
if errorlevel 1 (
    echo ❌ Có lỗi xảy ra
    goto end
)
echo ✅ Hoàn thành!
goto end

:run_services
echo.
echo ✂️  Đang thêm services data...
node src/database/seeding_service.js
if errorlevel 1 (
    echo ❌ Có lỗi xảy ra
    goto end
)
echo ✅ Hoàn thành!
goto end

:run_products
echo.
echo 🛍️  Đang thêm products data...
node src/database/insert_products.js
if errorlevel 1 (
    echo ❌ Có lỗi xảy ra
    goto end
)
echo ✅ Hoàn thành!
goto end

:check_data
echo.
echo 🔍 Đang kiểm tra dữ liệu...
node src/database/check_data.js
goto end

:reset_db
echo.
echo ⚠️  CẢNH BÁO: Thao tác này sẽ XÓA TẤT CẢ dữ liệu!
set /p confirm="Bạn có chắc chắn muốn reset database? (y/N): "
if /i "%confirm%"=="y" (
    echo 🔄 Đang reset database...
    npx prisma db push --force-reset
    echo ✅ Reset database hoàn thành!
) else (
    echo ❌ Đã hủy thao tác reset
)
goto end

:prisma_studio
echo.
echo 🎨 Đang mở Prisma Studio...
echo Prisma Studio sẽ mở trong browser của bạn
echo Nhấn Ctrl+C để dừng server
npx prisma studio
goto end

:invalid_choice
echo.
echo ❌ Lựa chọn không hợp lệ!
goto menu

:end
echo.
echo Nhấn phím bất kỳ để quay lại menu...
pause >nul
goto menu

:exit
echo.
echo 👋 Cảm ơn bạn đã sử dụng!
echo.
pause
