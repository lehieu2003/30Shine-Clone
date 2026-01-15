# 🚨 HƯỚNG DẪN KHẮC PHỤC LỖI MYSQL VÀ CHẠY FAKE DATA

## ❌ Lỗi hiện tại

```
Error: P1001: Can't reach database server at `localhost:3306`
```

## 🔧 GIẢI PHÁP - Các bước thực hiện

### Bước 1: Khởi động MySQL Service (Yêu cầu quyền Admin)

#### Cách 1: Sử dụng Command Prompt với quyền Admin

1. **Nhấn `Windows + X`** → Chọn **"Windows Terminal (Admin)"** hoặc **"Command Prompt (Admin)"**
2. Chạy lệnh sau:

```cmd
net start MySQL80
```

#### Cách 2: Sử dụng Services Management

1. **Nhấn `Windows + R`** → Gõ `services.msc` → Enter
2. Tìm service **"MySQL80"** trong danh sách
3. **Click phải** → Chọn **"Start"**
4. Đảm bảo **Startup type = "Automatic"** để tự khởi động sau này

#### Cách 3: Sử dụng XAMPP/WAMP (nếu có)

- Mở XAMPP Control Panel
- Click **"Start"** bên cạnh MySQL

### Bước 2: Kiểm tra MySQL đã hoạt động

```powershell
# Kiểm tra service status
Get-Service -Name "MySQL80"

# Hoặc test connection
mysql -u root -p -h localhost -P 3306 -e "SELECT 1;"
```

### Bước 3: Tạo Database (nếu chưa có)

```sql
# Kết nối MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE IF NOT EXISTS haircut;

# Kiểm tra database đã tạo
SHOW DATABASES;

# Thoát
EXIT;
```

### Bước 4: Chạy Prisma Commands

```bash
# Di chuyển đến thư mục backend
cd hair-cut-be

# Generate Prisma Client
npx prisma generate

# Đồng bộ schema với database
npx prisma db push

# (Tùy chọn) Reset database nếu cần
npx prisma db push --force-reset
```

### Bước 5: Chạy Fake Data

```bash
# Chạy tất cả scripts
npm run seed

# Hoặc chạy từng script riêng
npm run seed:users     # Tạo users và booking data
npm run seed:services  # Thêm services từ data.json
npm run seed:products  # Thêm products từ dataset

# Kiểm tra kết quả
npm run seed:check
```

## 🛠️ TÙY CHỌN KHÁC - Sử dụng Docker MySQL

Nếu không muốn cài MySQL local, có thể dùng Docker:

### Cài đặt Docker MySQL

```bash
# Pull MySQL image
docker pull mysql:8.0

# Chạy MySQL container
docker run --name haircut-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=haircut -p 3306:3306 -d mysql:8.0

# Kiểm tra container đang chạy
docker ps
```

### Cập nhật .env cho Docker

```properties
DATABASE_URL="mysql://root:password@localhost:3306/haircut"
```

## 📋 SCRIPT TỰ ĐỘNG HÓA

Tôi đã tạo script `fake_data.bat` để tự động hóa quy trình:

```bash
# Chạy script batch (Windows)
./fake_data.bat
```

Script này sẽ:

1. Kiểm tra MySQL service
2. Hướng dẫn khởi động nếu cần
3. Chạy Prisma commands
4. Thực hiện fake data
5. Kiểm tra kết quả

## 🚨 XỬ LÝ CÁC LỖI THƯỜNG GẶP

### Lỗi 1: Access Denied for User

```
ERROR 1045 (28000): Access denied for user 'root'@'localhost'
```

**Giải pháp:**

- Đặt lại password MySQL root
- Hoặc tạo user mới với quyền phù hợp

### Lỗi 2: Port 3306 bị chiếm

```
ERROR 2003: Can't connect to MySQL server on 'localhost' (10061)
```

**Giải pháp:**

- Kiểm tra port khác: `netstat -an | findstr :3306`
- Đổi port trong DATABASE_URL

### Lỗi 3: Database không tồn tại

```
ERROR 1049: Unknown database 'haircut'
```

**Giải pháp:**

```sql
CREATE DATABASE haircut;
```

## 📞 LIÊN HỆ HỖ TRỢ

Nếu vẫn gặp lỗi:

1. Chụp màn hình lỗi chi tiết
2. Kiểm tra logs MySQL: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
3. Thử kết nối bằng MySQL Workbench hoặc phpMyAdmin

## 🎯 QUY TRÌNH NHANH CHO LẦN SAU

Sau khi đã setup xong:

```bash
# Khởi động MySQL (nếu cần)
net start MySQL80

# Chạy fake data
cd hair-cut-be
npm run seed

# Kiểm tra kết quả
npm run seed:check
```
