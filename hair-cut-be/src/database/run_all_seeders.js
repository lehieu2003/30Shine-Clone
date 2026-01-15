#!/usr/bin/env node

/**
 * Script to run all seeding operations in the correct order
 * This script will populate the database with fake data
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bright}[BƯỚC ${step}]${colors.reset} ${colors.cyan}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Execute a seeding script
async function runSeedingScript(scriptName, description) {
  const scriptPath = path.join(__dirname, scriptName);
  
  if (!fileExists(scriptPath)) {
    logError(`File không tồn tại: ${scriptName}`);
    return false;
  }

  try {
    logInfo(`Đang chạy: ${description}`);
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`, {
      cwd: path.resolve(__dirname, '../../')
    });
    
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      logWarning(`Stderr: ${stderr}`);
    }
    
    logSuccess(`Hoàn thành: ${description}`);
    return true;
  } catch (error) {
    logError(`Lỗi khi chạy ${scriptName}: ${error.message}`);
    if (error.stdout) {
      console.log('Stdout:', error.stdout);
    }
    if (error.stderr) {
      console.log('Stderr:', error.stderr);
    }
    return false;
  }
}

// Main function to run all seeders
async function runAllSeeders() {
  log(`${colors.bright}=== QUY TRÌNH FAKE DATA VÀO DATABASE ===${colors.reset}`);
  log(`${colors.yellow}Thời gian bắt đầu: ${new Date().toLocaleString('vi-VN')}${colors.reset}\n`);

  const startTime = Date.now();
  let totalSteps = 0;
  let successSteps = 0;

  try {
    // Step 1: Check database connection
    logStep(1, "Kiểm tra kết nối database");
    totalSteps++;
    
    try {
      await execAsync('npx prisma db push --skip-generate', {
        cwd: path.resolve(__dirname, '../../')
      });
      logSuccess("Kết nối database thành công");
      successSteps++;
    } catch (error) {
      logError("Không thể kết nối database");
      logError("Vui lòng kiểm tra DATABASE_URL trong file .env");
      return;
    }

    // Step 2: Generate Prisma Client
    logStep(2, "Generate Prisma Client");
    totalSteps++;
    
    try {
      await execAsync('npx prisma generate', {
        cwd: path.resolve(__dirname, '../../')
      });
      logSuccess("Generate Prisma Client thành công");
      successSteps++;
    } catch (error) {
      logError("Lỗi khi generate Prisma Client");
      logError(error.message);
      return;
    }

    // Step 3: Run comprehensive fake data script
    logStep(3, "Tạo dữ liệu giả tổng hợp (Users, Branches, Services, Bookings, etc.)");
    totalSteps++;
    
    const fakeDataSuccess = await runSeedingScript(
      'fake_new_data.js',
      'Tạo users, branches, service categories, schedules, bookings và các dữ liệu liên quan'
    );
    
    if (fakeDataSuccess) {
      successSteps++;
    } else {
      logWarning("Tiếp tục với các bước khác...");
    }

    // Step 4: Seed services from data.json
    logStep(4, "Thêm dữ liệu services từ file data.json");
    totalSteps++;
    
    const servicesSuccess = await runSeedingScript(
      'seeding_service.js',
      'Thêm services và service steps từ data.json'
    );
    
    if (servicesSuccess) {
      successSteps++;
    } else {
      logWarning("Lỗi khi thêm services data");
    }

    // Step 5: Insert products data
    logStep(5, "Thêm dữ liệu products từ dataset");
    totalSteps++;
    
    const productsSuccess = await runSeedingScript(
      'insert_products.js',
      'Thêm products và product images từ dataset'
    );
    
    if (productsSuccess) {
      successSteps++;
    } else {
      logWarning("Lỗi khi thêm products data");
    }

    // Step 6: Final verification
    logStep(6, "Kiểm tra dữ liệu đã được tạo");
    totalSteps++;
    
    try {
      const verificationScript = `
        import { PrismaClient } from './src/database/generated/client.js';
        const db = new PrismaClient();
        
        const counts = {
          users: await db.user.count(),
          branches: await db.branch.count(),
          services: await db.service.count(),
          serviceCategories: await db.serviceCategory.count(),
          bookings: await db.booking.count(),
          products: await db.product.count()
        };
        
        console.log('=== THỐNG KÊ DỮ LIỆU ===');
        console.log('Users:', counts.users);
        console.log('Branches:', counts.branches);
        console.log('Service Categories:', counts.serviceCategories);
        console.log('Services:', counts.services);
        console.log('Bookings:', counts.bookings);
        console.log('Products:', counts.products);
        
        await db.$disconnect();
      `;
      
      const verificationPath = path.join(__dirname, 'temp_verification.js');
      fs.writeFileSync(verificationPath, verificationScript);
      
      const { stdout } = await execAsync(`node "${verificationPath}"`, {
        cwd: path.resolve(__dirname, '../../')
      });
      
      console.log(stdout);
      fs.unlinkSync(verificationPath); // Clean up temp file
      
      logSuccess("Kiểm tra dữ liệu hoàn tất");
      successSteps++;
    } catch (error) {
      logError("Lỗi khi kiểm tra dữ liệu: " + error.message);
    }

  } catch (error) {
    logError(`Lỗi không mong muốn: ${error.message}`);
  } finally {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log(`\n${colors.bright}=== KẾT QUÀ ===${colors.reset}`);
    log(`Thời gian hoàn thành: ${duration}s`);
    log(`Các bước thành công: ${successSteps}/${totalSteps}`);
    
    if (successSteps === totalSteps) {
      logSuccess("🎉 TẤT CẢ CÁC BƯỚC ĐÃ HOÀN THÀNH THÀNH CÔNG!");
    } else {
      logWarning(`⚠️  Hoàn thành ${successSteps}/${totalSteps} bước. Vui lòng kiểm tra lại các lỗi ở trên.`);
    }
    
    log(`${colors.yellow}Thời gian kết thúc: ${new Date().toLocaleString('vi-VN')}${colors.reset}`);
  }
}

// Execute the main function
runAllSeeders().catch(error => {
  logError(`Lỗi nghiêm trọng: ${error.message}`);
  process.exit(1);
});
