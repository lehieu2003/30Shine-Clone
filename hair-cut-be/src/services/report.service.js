import db from "../database/index.js";

function buildBookingWhere({ from, to, year, employeeId }) {
	const where = {
		status: { in: ["completed", "success"] },
	};

	if (year) {
		where.appointmentDate = {
			gte: new Date(`${year}-01-01`),
			lte: new Date(`${year}-12-31`),
		};
	} else if (from && to) {
		where.appointmentDate = {
			gte: new Date(from),
			lte: new Date(to),
		};
	}

	if (employeeId) {
		where.employeeId = Number(employeeId);
	}

	return where;
}

async function getMonthlyRevenueTable(filters = {}) {
	const where = buildBookingWhere(filters);

	const bookings = await db.booking.findMany({
		where,
		select: {
			appointmentDate: true,
			totalPrice: true,
		},
	});

	const map = new Map();

	bookings.forEach(({ appointmentDate, totalPrice }) => {
		const date = new Date(appointmentDate);
		const month = `${date.getFullYear()}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}`;

		if (!map.has(month)) {
			map.set(month, { count: 0, total: 0 });
		}

		const entry = map.get(month);
		entry.count++;
		entry.total += Number(totalPrice ?? 0);
	});

	// Sort by month
	return Array.from(map.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([month, { count, total }]) => ({
			month,
			total,
			count,
		}));
}

// 💈 Bảng doanh thu theo dịch vụ
async function getRevenueByServiceTable(filters = {}) {
	const where = buildBookingWhere(filters);

	// Better approach: join from booking side to ensure only filtered bookings
	const filteredBookings = await db.booking.findMany({
		where,
		include: {
			services: {
				include: {
					service: {
						select: { id: true, serviceName: true },
					},
				},
			},
		},
	});

	const map = new Map();

	for (const booking of filteredBookings) {
		const serviceCount = booking.services.length;
		if (serviceCount === 0) continue;

		// Calculate portion per service
		const portion = Number(booking.totalPrice) / serviceCount;

		for (const bookingService of booking.services) {
			// Skip if service ID filter is applied and doesn't match
			if (
				filters.serviceId &&
				bookingService.service.id !== Number(filters.serviceId)
			) {
				continue;
			}

			const serviceName =
				bookingService.service?.serviceName || "Unknown";

			if (!map.has(serviceName)) {
				map.set(serviceName, { count: 0, total: 0 });
			}

			const entry = map.get(serviceName);
			entry.count++;
			entry.total += portion;
		}
	}

	return Array.from(map.entries())
		.sort((a, b) => b[1].total - a[1].total)
		.map(([name, { total, count }]) => ({
			service: name,
			count,
			total,
		}));
}

async function getDashboardStats() {
	// Get today's date
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	
	// Set time to start of day
	today.setHours(0, 0, 0, 0);
	yesterday.setHours(0, 0, 0, 0);
	
	// Set time to end of day
	const todayEnd = new Date(today);
	todayEnd.setHours(23, 59, 59, 999);
	
	const yesterdayEnd = new Date(yesterday);
	yesterdayEnd.setHours(23, 59, 59, 999);
	
	// One week ago
	const lastWeek = new Date(today);
	lastWeek.setDate(lastWeek.getDate() - 7);
	
	// Get today's bookings
	const todayBookings = await db.booking.findMany({
		where: {
			appointmentDate: {
				gte: today,
				lte: todayEnd
			}
		},
		select: {
			id: true,
			totalPrice: true,
			customerId: true,
			checkInTime: true,
			checkOutTime: true,
		}
	});
	
	// Get yesterday's bookings
	const yesterdayBookings = await db.booking.findMany({
		where: {
			appointmentDate: {
				gte: yesterday,
				lte: yesterdayEnd
			}
		},
		select: {
			id: true,
			totalPrice: true,
		}
	});
	
	// Get new customers in the last week
	const newCustomersCount = await db.user.count({
		where: {
			role: "customer",
			createdAt: {
				gte: lastWeek
			}
		}
	});
	
	// Get new customers from the week before
	const twoWeeksAgo = new Date(lastWeek);
	twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
	
	const prevWeekCustomersCount = await db.user.count({
		where: {
			role: "customer",
			createdAt: {
				gte: twoWeeksAgo,
				lt: lastWeek
			}
		}
	});
	
	// Calculate stats
	const todayBookingsCount = todayBookings.length;
	const yesterdayBookingsCount = yesterdayBookings.length;
	
	// Calculate today's revenue
	const todayRevenue = todayBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
	const yesterdayRevenue = yesterdayBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
	
	// Calculate average service time
	const completedBookings = todayBookings.filter(booking => 
		booking.checkInTime && booking.checkOutTime
	);
	
	let averageServiceTime = 0;
	if (completedBookings.length > 0) {
		const totalMinutes = completedBookings.reduce((sum, booking) => {
			const durationMs = new Date(booking.checkOutTime) - new Date(booking.checkInTime);
			return sum + (durationMs / (1000 * 60)); // Convert to minutes
		}, 0);
		averageServiceTime = Math.round(totalMinutes / completedBookings.length);
	}
	
	// Get last week's average
	const lastWeekBookings = await db.booking.findMany({
		where: {
			appointmentDate: {
				gte: lastWeek,
				lt: today
			},
			checkInTime: { not: null },
			checkOutTime: { not: null }
		},
		select: {
			checkInTime: true,
			checkOutTime: true,
		}
	});
	
	let lastWeekAverageTime = 0;
	if (lastWeekBookings.length > 0) {
		const totalMinutes = lastWeekBookings.reduce((sum, booking) => {
			const durationMs = new Date(booking.checkOutTime) - new Date(booking.checkInTime);
			return sum + (durationMs / (1000 * 60)); // Convert to minutes
		}, 0);
		lastWeekAverageTime = Math.round(totalMinutes / lastWeekBookings.length);
	}
	
	// Calculate growth rates
	const todayBookingsGrowth = yesterdayBookingsCount === 0 
		? 100 
		: Math.round(((todayBookingsCount - yesterdayBookingsCount) / yesterdayBookingsCount) * 100);
	
	const todayRevenueGrowth = yesterdayRevenue === 0 
		? 100 
		: Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
	
	const newCustomersGrowth = prevWeekCustomersCount === 0 
		? 100 
		: Math.round(((newCustomersCount - prevWeekCustomersCount) / prevWeekCustomersCount) * 100);
	
	const averageServiceTimeGrowth = lastWeekAverageTime === 0 
		? 0 
		: Math.round(averageServiceTime - lastWeekAverageTime);
	
	return {
		todayBookingsCount,
		todayBookingsGrowth,
		todayRevenue,
		todayRevenueGrowth,
		newCustomersCount,
		newCustomersGrowth,
		averageServiceTime,
		averageServiceTimeGrowth
	};
}

async function getRecentActivities(limit = 5) {
	// We'll create a combined view of recent activities by querying multiple tables
	
	// Get recent bookings
	const bookings = await db.booking.findMany({
		take: Number(limit),
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			createdAt: true,
			status: true,
			customer: { select: { fullName: true } }
		}
	});

	// Map bookings to activities format
	const bookingActivities = bookings.map(booking => ({
		id: `booking-${booking.id}`,
		message: `${booking.customer.fullName} đã đặt lịch mới`,
		timestamp: booking.createdAt.toISOString(),
		type: 'booking'
	}));

	// Get recent inventory transactions
	const inventoryTransactions = await db.inventoryTransaction.findMany({
		take: Number(limit),
		orderBy: { transactionDate: 'desc' },
		select: {
			id: true,
			transactionDate: true,
			quantity: true,
			product: { select: { name: true } },
			employee: { select: { fullName: true } }
		}
	});

	// Map inventory transactions to activities format
	const inventoryActivities = inventoryTransactions.map(transaction => ({
		id: `inventory-${transaction.id}`,
		message: `${transaction.employee.fullName} ${transaction.quantity > 0 ? 'nhập' : 'xuất'} ${Math.abs(transaction.quantity)} ${transaction.product.name}`,
		timestamp: transaction.transactionDate.toISOString(),
		type: 'inventory'
	}));

	// Combine all activities and sort by timestamp descending
	const allActivities = [...bookingActivities, ...inventoryActivities]
		.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
		.slice(0, Number(limit));

	return allActivities;
}

export default {
	getMonthlyRevenueTable,
	getRevenueByServiceTable,
	getDashboardStats,
	getRecentActivities
};
