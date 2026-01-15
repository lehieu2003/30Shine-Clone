# 🚀 QUY TRÌNH FAKE DATA VÀO DATABASE - HAIR CUT APP

## 📋 TÓM TẮT NHANH

### ⚡ Cách Nhanh Nhất (Windows)

1. **Khởi động MySQL với quyền Admin:**
   - Nhấn `Windows + X` → Chọn "Terminal (Admin)" hoặc "Command Prompt (Admin)"
   - Chạy: `net start MySQL80`

2. **Tạo Database:**

   ```cmd
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS haircut;"
   ```

3. **Chạy Fake Data:**
   ```cmd
   cd hair-cut-be
   npm run seed
   ```

### 🔍 Kiểm Tra Từng Bước

#### Bước 1: Kiểm tra MySQL Service

```powershell
# Kiểm tra service có tồn tại không
Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue

# Nếu có, kiểm tra trạng thái
Get-Service -Name "MySQL80" | Select-Object Name, Status, StartType
```

#### Bước 2: Khởi động MySQL (nếu cần)

```cmd
# Cần chạy với quyền Admin
net start MySQL80

# Hoặc
Start-Service -Name "MySQL80"
```

#### Bước 3: Test Connection

```cmd
# Test bằng MySQL command line
mysql -u root -p -e "SELECT 1;"

# Hoặc check port
netstat -an | findstr :3306
```

#### Bước 4: Tạo Database

```sql
-- Kết nối MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE IF NOT EXISTS haircut CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Kiểm tra
SHOW DATABASES;

-- Thoát
EXIT;
```

#### Bước 5: Chạy Prisma & Fake Data

```bash
# Di chuyển đến thư mục backend
cd hair-cut-be

# Generate Prisma Client
npx prisma generate

# Sync schema với database
npx prisma db push

# Chạy fake data (tất cả)
npm run seed

# Hoặc chạy từng loại riêng
npm run seed:users      # Users, branches, bookings
npm run seed:services   # Services từ data.json
npm run seed:products   # Products từ dataset

# Kiểm tra kết quả
npm run seed:check
```

## 🛠️ CÁC SCRIPTS ĐÃ TẠO

### 1. Script Tổng Hợp

```bash
npm run seed
```

**File:** `src/database/run_all_seeders.js`
**Tác dụng:** Chạy tất cả scripts theo thứ tự đúng

### 2. Scripts Riêng Lẻ

```bash
npm run seed:users      # fake_new_data.js
npm run seed:services   # seeding_service.js
npm run seed:products   # insert_products.js
npm run seed:check      # check_data.js
```

### 3. Database Commands

```bash
npm run db:generate     # prisma generate
npm run db:push         # prisma db push
npm run db:reset        # prisma db push --force-reset
npm run db:studio       # prisma studio
```

### 4. Batch Scripts (Windows)

```cmd
fake_data.bat           # Menu tương tác
check-mysql.bat         # Kiểm tra MySQL status
```

## 📊 DỮ LIỆU SẼ ĐƯỢC TẠO

### Users (fake_new_data.js)

- 1 Admin user (admin@admin.com / admin)
- 20 Customers (email/password ngẫu nhiên)
- 10 Barbers
- 2 Receptionists

### Branches

- 3 Chi nhánh với thông tin chi tiết
- Phân công nhân viên cho từng chi nhánh

### Service Categories

- 5 Danh mục dịch vụ (Cắt tóc, Uốn tóc, Nhuộm tóc, etc.)

### Services (seeding_service.js)

- Services từ file `data.json`
- Service steps chi tiết

### Products (insert_products.js)

- Products từ file `products-dataset/product_details.json`
- Product images và variants

### Bookings & Payments

- 50+ bookings ngẫu nhiên
- Payments với các trạng thái khác nhau

## 🔧 XỬ LÝ LỖI

### Lỗi 1: MySQL Service không khởi động

```
System error 5 has occurred. Access is denied.
```

**Giải pháp:** Chạy terminal với quyền Admin

### Lỗi 2: Database không tồn tại

```
ERROR 1049: Unknown database 'haircut'
```

**Giải pháp:**

```sql
CREATE DATABASE haircut;
```

### Lỗi 3: Prisma Client chưa generate

```
Error: Prisma Client is not generated
```

**Giải pháp:**

```bash
npx prisma generate
```

### Lỗi 4: Foreign Key Constraints

```
Error: Foreign key constraint fails
```

**Giải pháp:** Chạy scripts theo đúng thứ tự hoặc reset database

## 📈 KIỂM TRA KẾT QUẢ

### Sử dụng npm script

```bash
npm run seed:check
```

### Sử dụng Prisma Studio

```bash
npm run db:studio
```

### Sử dụng MySQL Command Line

```sql
SELECT
  (SELECT COUNT(*) FROM User) as users,
  (SELECT COUNT(*) FROM Branch) as branches,
  (SELECT COUNT(*) FROM Service) as services,
  (SELECT COUNT(*) FROM Product) as products,
  (SELECT COUNT(*) FROM Booking) as bookings;
```

## 🎯 QUY TRÌNH HOÀN CHỈNH

```bash
# 1. Khởi động MySQL (với quyền Admin)
net start MySQL80

# 2. Tạo database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS haircut;"

# 3. Di chuyển đến thư mục
cd hair-cut-be

# 4. Chạy fake data
npm run seed

# 5. Kiểm tra kết quả
npm run seed:check

# 6. (Tùy chọn) Mở Prisma Studio
npm run db:studio
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra MySQL service đang chạy
2. Verify DATABASE_URL trong .env
3. Chạy `npx prisma generate`
4. Check logs của từng script
5. Reset database nếu cần: `npm run db:reset`
