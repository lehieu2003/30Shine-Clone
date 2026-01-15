# HƯỚNG DẪN CHẠY FAKE DATA VÀO DATABASE

## 📋 Tổng Quan

Dự án này có nhiều file để tạo dữ liệu giả (fake data) cho database. Tài liệu này hướng dẫn cách chạy từng file và quy trình tổng thể.

## 🗂️ Cấu Trúc Files

```
src/database/
├── run_all_seeders.js      # Script tổng hợp chạy tất cả
├── fake_new_data.js        # Tạo users, branches, bookings, etc.
├── seeding_service.js      # Thêm services từ data.json
├── insert_products.js      # Thêm products từ dataset
├── fake.js                 # Script fake data cũ (backup)
├── data.json              # Dữ liệu services
└── generated/             # Prisma client generated
```

## ⚡ Chạy Nhanh (Recommended)

### Cách 1: Chạy Script Tổng Hợp

```bash
# Di chuyển đến thư mục backend
cd hair-cut-be

# Chạy script tổng hợp (bao gồm tất cả các bước)
node src/database/run_all_seeders.js
```

### Cách 2: Sử dụng npm script (nếu đã config)

```bash
cd hair-cut-be
npm run seed
```

## 🔧 Chạy Từng Bước Chi Tiết

### Bước 1: Chuẩn Bị

```bash
# Kiểm tra môi trường
cd hair-cut-be

# Cài đặt dependencies (nếu chưa có)
npm install

# Kiểm tra file .env có DATABASE_URL
# Ví dụ: DATABASE_URL="mysql://user:password@localhost:3306/haircut"
```

### Bước 2: Chuẩn Bị Database

```bash
# Generate Prisma Client
npx prisma generate

# Đồng bộ schema với database
npx prisma db push

# (Tùy chọn) Reset database nếu muốn bắt đầu từ đầu
npx prisma db push --force-reset
```

### Bước 3: Chạy Từng Script Riêng Lẻ

#### 3.1. Tạo Dữ Liệu Cơ Bản

```bash
# Tạo users, branches, service categories, bookings, etc.
node src/database/fake_new_data.js
```

**Tạo ra:**

- 1 admin user
- 20 customers
- 10 barbers
- 2 receptionists
- 3 branches
- Service categories
- Schedules
- Bookings
- Payments

#### 3.2. Thêm Services từ Data.json

```bash
# Thêm services và service steps
node src/database/seeding_service.js
```

**Yêu cầu:** File `data.json` phải tồn tại
**Tạo ra:**

- Services với thông tin chi tiết
- Service steps cho mỗi service

#### 3.3. Thêm Products Dataset

```bash
# Thêm products từ dataset
node src/database/insert_products.js
```

**Yêu cầu:** File `products-dataset/product_details.json` phải tồn tại
**Tạo ra:**

- Products với thông tin chi tiết
- Product images
- Product variants

## 🚨 Xử Lý Lỗi Thường Gặp

### Lỗi 1: Database Connection

```
Error: Can't reach database server
```

**Giải pháp:**

- Kiểm tra MySQL service đang chạy
- Xác minh DATABASE_URL trong .env
- Ping database: `mysql -h localhost -u user -p`

### Lỗi 2: Prisma Client

```
Error: Prisma Client is not generated
```

**Giải pháp:**

```bash
npx prisma generate
```

### Lỗi 3: Foreign Key Constraints

```
Error: Foreign key constraint fails
```

**Giải pháp:**

- Chạy script theo đúng thứ tự
- Reset database: `npx prisma db push --force-reset`

### Lỗi 4: File Not Found

```
Error: Cannot find file 'data.json'
```

**Giải pháp:**

- Kiểm tra file tồn tại trong thư mục database
- Tạo file mẫu nếu thiếu

## 📊 Kiểm Tra Kết Quả

### Cách 1: Sử dụng Prisma Studio

```bash
npx prisma studio
```

### Cách 2: Query trực tiếp

```bash
# Kết nối MySQL
mysql -h localhost -u user -p haircut

# Kiểm tra số lượng records
SELECT
  (SELECT COUNT(*) FROM User) as users,
  (SELECT COUNT(*) FROM Branch) as branches,
  (SELECT COUNT(*) FROM Service) as services,
  (SELECT COUNT(*) FROM Product) as products,
  (SELECT COUNT(*) FROM Booking) as bookings;
```

### Cách 3: Script kiểm tra

```bash
node -e "
import { PrismaClient } from './src/database/generated/client.js';
const db = new PrismaClient();
const counts = {
  users: await db.user.count(),
  branches: await db.branch.count(),
  services: await db.service.count(),
  products: await db.product.count(),
  bookings: await db.booking.count()
};
console.log('Data counts:', counts);
await db.\$disconnect();
"
```

## 🎯 Scripts Tùy Chỉnh

### Reset Specific Tables

```javascript
// reset_tables.js
import { PrismaClient } from './src/database/generated/client.js';
const db = new PrismaClient();

// Xóa chỉ bookings và payments
await db.payment.deleteMany({});
await db.bookingService.deleteMany({});
await db.booking.deleteMany({});

console.log('Reset booking data completed');
await db.$disconnect();
```

### Seed Only Users

```javascript
// seed_users_only.js
import { faker } from '@faker-js/faker/locale/vi';
import { PrismaClient } from './src/database/generated/client.js';

const db = new PrismaClient();

// Tạo chỉ users
for (let i = 0; i < 10; i++) {
  await db.user.create({
    data: {
      email: faker.internet.email(),
      password: 'Password123',
      fullName: faker.person.fullName(),
      phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
      role: 'customer',
      status: 'active',
      availabilityStatus: 'available',
    },
  });
}

console.log('Created 10 users');
await db.$disconnect();
```

## 📝 Ghi Chú Quan Trọng

1. **Thứ tự chạy script rất quan trọng** do foreign key constraints
2. **Backup database** trước khi chạy script nếu có dữ liệu quan trọng
3. **Kiểm tra DATABASE_URL** trong file .env
4. **Đảm bảo MySQL service đang chạy**
5. **Có thể mất vài phút** để hoàn thành tất cả scripts

## 🔄 Quy Trình Phát Triển

### Thêm Script Mới

1. Tạo file trong `src/database/`
2. Import PrismaClient
3. Thêm vào `run_all_seeders.js`
4. Test riêng lẻ trước khi integrate

### Modify Existing Data

1. Tạo migration scripts riêng
2. Backup trước khi modify
3. Test với dữ liệu nhỏ trước

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra logs từ script
2. Xem Prisma Studio để debug
3. Reset database và thử lại
4. Kiểm tra file requirements và dependencies
