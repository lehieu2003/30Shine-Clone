#!/usr/bin/env node

/**
 * Quick database check script
 * Kiểm tra nhanh dữ liệu trong database
 */

import { PrismaClient } from './generated/client.js';

const db = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Đang kiểm tra database...\n');
    
    const counts = {
      users: await db.user.count(),
      branches: await db.branch.count(),
      serviceCategories: await db.serviceCategory.count(),
      services: await db.service.count(),
      bookings: await db.booking.count(),
      products: await db.product.count(),
      payments: await db.payment.count()
    };
    
    console.log('📊 THỐNG KÊ DỮ LIỆU:');
    console.log('==================');
    console.log(`👥 Users: ${counts.users}`);
    console.log(`🏢 Branches: ${counts.branches}`);
    console.log(`📂 Service Categories: ${counts.serviceCategories}`);
    console.log(`✂️  Services: ${counts.services}`);
    console.log(`📅 Bookings: ${counts.bookings}`);
    console.log(`🛍️  Products: ${counts.products}`);
    console.log(`💳 Payments: ${counts.payments}`);
    
    // Check user roles
    const userRoles = await db.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });
    
    console.log('\n👤 PHÂN BỔ NGƯỜI DÙNG THEO VAI TRÒ:');
    console.log('==================================');
    userRoles.forEach(role => {
      console.log(`${role.role}: ${role._count.id}`);
    });
    
    // Check booking status
    const bookingStatus = await db.booking.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    
    console.log('\n📊 TRẠNG THÁI BOOKING:');
    console.log('=====================');
    bookingStatus.forEach(status => {
      console.log(`${status.status}: ${status._count.id}`);
    });
    
    // Recent data
    const recentBooking = await db.booking.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { fullName: true } },
        employee: { select: { fullName: true } }
      }
    });
    
    if (recentBooking) {
      console.log('\n📅 BOOKING GẦN NHẤT:');
      console.log('===================');
      console.log(`Khách hàng: ${recentBooking.customer.fullName}`);
      console.log(`Nhân viên: ${recentBooking.employee?.fullName || 'Chưa phân công'}`);
      console.log(`Ngày tạo: ${recentBooking.createdAt.toLocaleString('vi-VN')}`);
      console.log(`Trạng thái: ${recentBooking.status}`);
    }
    
    console.log('\n✅ Kiểm tra database hoàn tất!');
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error.message);
  } finally {
    await db.$disconnect();
  }
}

checkDatabase();
