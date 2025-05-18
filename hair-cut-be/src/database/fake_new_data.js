import { faker } from "@faker-js/faker/locale/vi";
import { PrismaClient } from "./generated/client.js";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize PrismaClient with hardcoded database URL if environment variable is not found
const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "mysql://root@localhost:3306/haircut"
    }
  }
});

// Clean up existing data in the correct order to respect foreign key constraints
await db.bookingService.deleteMany({});
await db.payment.deleteMany({}); // Payments reference bookings
await db.booking.deleteMany({});
await db.branchEmployee.deleteMany({});
await db.notification.deleteMany({}); // Notifications reference users
await db.inventoryTransaction.deleteMany({}); // Inventory transactions reference users
await db.expense.deleteMany({}); // Expenses reference users
await db.schedule.deleteMany({}); // Schedules reference users
await db.cartItem.deleteMany({}); // Cart items must be deleted before carts
await db.cart.deleteMany({}); // Carts reference users
await db.branch.deleteMany({});
// Delete users last since they're referenced by other tables
await db.user.deleteMany({});

// Branch data from 30Shine
const branchData = [
  { name: "30Shine Tô Hiến Thành", address: "193 Tô Hiến Thành, Phường 13, Quận 10" },
  { name: "30Shine 3 Tháng 2", address: "300 Đường 3 Tháng 2, Phường 12, Quận 10" },
  { name: "30Shine Lê Đại Hành", address: "405A Lê Đại Hành, Phường 11, Quận 11" },
  { name: "30Shine Nguyễn Ảnh Thủ", address: "36 Nguyễn Ảnh Thủ, Trung Mỹ Tây, Quận 12" },
  { name: "30Shine Phan Văn Hớn", address: "76 Phan Văn Hớn, Tân Thới Nhất, Quận 12" },
  { name: "30Shine Xô Viết Nghệ Tĩnh", address: "323 Xô Viết Nghệ Tĩnh, Phường 24, Quận Bình Thạnh" },
  { name: "30Shine Lê Quang Định", address: "359 Lê Quang Định, Phường 5, Quận Bình Thạnh" },
  { name: "30Shine Tỉnh Lộ 10", address: "730 Tỉnh Lộ 10, Bình Trị Đông, Quận Bình Tân" },
  { name: "30Shine Trường Chinh", address: "150 Trường Chinh, Phường 12, Quận Tân Bình" },
  { name: "30Shine Âu Cơ", address: "758 Âu Cơ, Phường 14, Quận Tân Bình" },
  { name: "30Shine Lê Văn Sỹ", address: "312 Lê Văn Sỹ, Phường 1, Quận Tân Bình" },
  { name: "30Shine Quang Trung", address: "1180 Quang Trung, Phường 8, Quận Gò Vấp" },
];

// Create branches
const branches = [];
// Use first 3 branches or all if fewer than 3
const branchesToCreate = branchData.slice(0, branchData.length);

for (const branch of branchesToCreate) {
  const createdBranch = await db.branch.create({
    data: {
      name: branch.name,
      address: branch.address,
      phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
      email: faker.internet.email(),
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.urlLoremFlickr({ category: 'business' }),
      isActive: true,
      createdAt: faker.date.past({}),
    },
  });
  branches.push(createdBranch);
}

const mainBranch = branches[0]; // Use first branch as main branch

// Create admin user
const admin = await db.user.create({
  data: {
    email: "admin@admin.com",
    phone: "admin",
    fullName: "admin",
    role: "admin",
    availabilityStatus: "available",
    status: "active",
    password: "admin",
    createdAt: faker.date.past({}),
  },
});

// Connect admin to main branch
await db.branchEmployee.create({
  data: {
    branchId: mainBranch.id,
    employeeId: admin.id,
    isMainBranch: true,
    startDate: faker.date.past({}),
  }
});

const baberId = [];
const customerId = [];

// Create customers
for (let i = 0; i < 20; i++) {
  const user = await db.user.create({
    data: {
      email: faker.internet.email(),
      password: "Password",
      fullName: faker.person.fullName(),
      phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
      address: faker.location.streetAddress(),
      role: "customer",
      availabilityStatus: "available",
      birthDate: faker.date.past({}),
      CCCD: faker.helpers.fromRegExp(
        /^(0[0-9]{2}|1[0-9]{2}|2[0-9]{2})[0-9][0-9]{2}[0-9]{6}/
      ),
      gender: faker.helpers.arrayElement([true, false]),
      createdAt: faker.date.past({}),
      status: "active",
      loyaltyPoints: faker.number.int({ min: 0, max: 500 }),
    },
  });
  customerId.push(user.id);
}

// Create barbers and assign them to branches
for (let i = 0; i < 10; i++) {
  const user = await db.user.create({
    data: {
      email: faker.internet.email(),
      password: "Password",
      fullName: faker.person.fullName(),
      phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
      address: faker.location.streetAddress(),
      role: "barber",
      availabilityStatus: "available",
      birthDate: faker.date.past({}),
      CCCD: faker.helpers.fromRegExp(
        /^(0[0-9]{2}|1[0-9]{2}|2[0-9]{2})[0-9][0-9]{2}[0-9]{6}/
      ),
      gender: faker.helpers.arrayElement([true, false]),
      createdAt: faker.date.past({}),
      status: "active",
    },
  });
  baberId.push(user.id);
  
  // Assign barber to a branch (some to multiple branches)
  const primaryBranch = faker.helpers.arrayElement(branches);
  await db.branchEmployee.create({
    data: {
      branchId: primaryBranch.id,
      employeeId: user.id,
      isMainBranch: true,
      startDate: faker.date.past({}),
    }
  });
  
  // 30% chance to be assigned to a second branch
  if (faker.datatype.boolean(0.3)) {
    const secondaryBranches = branches.filter(b => b.id !== primaryBranch.id);
    if (secondaryBranches.length > 0) {
      const secondaryBranch = faker.helpers.arrayElement(secondaryBranches);
      await db.branchEmployee.create({
        data: {
          branchId: secondaryBranch.id,
          employeeId: user.id,
          isMainBranch: false,
          startDate: faker.date.past({}),
        }
      });
    }
  }
}

// Create receptionists and assign them to branches
for (let i = 0; i < 3; i++) {
  const user = await db.user.create({
    data: {
      email: faker.internet.email(),
      password: "Password",
      fullName: faker.person.fullName(),
      phone: faker.helpers.fromRegExp(/0[3|5|7|8|9][0-9]{8}/),
      address: faker.location.streetAddress(),
      role: "receptionist",
      availabilityStatus: "available",
      birthDate: faker.date.past({}),
      CCCD: faker.helpers.fromRegExp(
        /^(0[0-9]{2}|1[0-9]{2}|2[0-9]{2})[0-9][0-9]{2}[0-9]{6}/
      ),
      gender: faker.helpers.arrayElement([true, false]),
      createdAt: faker.date.past({}),
      status: "active",
    },
  });
  
  // Assign receptionist to a branch
  await db.branchEmployee.create({
    data: {
      branchId: faker.helpers.arrayElement(branches).id,
      employeeId: user.id,
      isMainBranch: true,
      startDate: faker.date.past({}),
    }
  });
}

// Helper function to generate random booking datetime
function randomBookingDateTime(date) {
  const hour = faker.number.int({ min: 7, max: 22 });
  const minute = faker.helpers.arrayElement([0, 20, 40]);
  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute
  );
  return dateTime;
}

// Get all services
const services = await db.service.findMany({});

// Create bookings for customers
for await (const customer of customerId) {
  // Past bookings (completed)
  let numberOfBookings = faker.number.int({ min: 1, max: 5 });
  for (let i = 0; i < numberOfBookings; i++) {
    const randomServices = faker.helpers.arrayElements(services, {
      max: 3,
      min: 1,
    });
    
    const total = randomServices.reduce((acc, service) => {
      return acc + Number(service.price);
    }, 0);
    
    const estimatedDuration = randomServices.reduce((acc, service) => {
      return acc + service.estimatedTime;
    }, 0);
    
    const appointmentDate = randomBookingDateTime(
      faker.date.past({
        years: 1,
      })
    );
    
    const checkInTime = new Date(appointmentDate);
    const checkOutTime = new Date(appointmentDate.getTime() + estimatedDuration * 60000);
    
    // Get a random branch
    const branch = faker.helpers.arrayElement(branches);
    
    // Get a barber assigned to this branch
    const branchBarberIds = (await db.branchEmployee.findMany({
      where: { 
        branchId: branch.id,
        employee: { role: "barber" }
      },
      select: { employeeId: true }
    })).map(be => be.employeeId);
    
    const barberId = branchBarberIds.length > 0 
      ? faker.helpers.arrayElement(branchBarberIds) 
      : faker.helpers.arrayElement(baberId);
    
    const booking = await db.booking.create({
      data: {
        appointmentDate: appointmentDate,
        createdAt: faker.date.past({
          years: 1,
        }),
        customer: {
          connect: {
            id: customer,
          },
        },
        employee: {
          connect: {
            id: barberId,
          },
        },
        branch: {
          connect: {
            id: branch.id,
          }
        },
        status: "completed",
        totalPrice: total,
        notes: faker.lorem.paragraph(),
        estimatedDuration: estimatedDuration,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        rating: faker.number.int({ min: 3, max: 5 }),
        review: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
      },
    });
    
    // Create booking services
    await db.bookingService.createMany({
      data: randomServices.map((service) => {
        return {
          bookingId: booking.id,
          serviceId: service.id,
          servicePrice: service.price,
        };
      }),
    });
  }

  // Future bookings (pending/confirmed)
  numberOfBookings = faker.number.int({ min: 0, max: 1 });
  for (let i = 0; i < numberOfBookings; i++) {
    const randomServices = faker.helpers.arrayElements(services, {
      max: 3,
      min: 1,
    });
    
    const total = randomServices.reduce((acc, service) => {
      return acc + Number(service.price);
    }, 0);
    
    const estimatedDuration = randomServices.reduce((acc, service) => {
      return acc + service.estimatedTime;
    }, 0);
    
    // Get a random branch
    const branch = faker.helpers.arrayElement(branches);
    
    // Get a barber assigned to this branch
    const branchBarberIds = (await db.branchEmployee.findMany({
      where: { 
        branchId: branch.id,
        employee: { role: "barber" }
      },
      select: { employeeId: true }
    })).map(be => be.employeeId);
    
    const barberId = branchBarberIds.length > 0 
      ? faker.helpers.arrayElement(branchBarberIds) 
      : faker.helpers.arrayElement(baberId);
    
    const booking = await db.booking.create({
      data: {
        appointmentDate: randomBookingDateTime(
          faker.date.between({
            from: new Date(),
            to: new Date(
              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ),
          })
        ),
        createdAt: faker.date.recent({
          days: 7,
        }),
        customer: {
          connect: {
            id: customer,
          },
        },
        branch: {
          connect: {
            id: branch.id,
          }
        },
        totalPrice: total,
        status: faker.helpers.arrayElement(["pending", "confirmed"]),
        employee: {
          connect: {
            id: barberId,
          },
        },  
        notes: faker.lorem.paragraph(),
        estimatedDuration: estimatedDuration,
      },
    });
    
    // Create booking services
    await db.bookingService.createMany({
      data: randomServices.map((service) => {
        return {
          bookingId: booking.id,
          serviceId: service.id,
          servicePrice: service.price,
        };
      }),
    });
  }
}

console.log("Seeding completed successfully!");
