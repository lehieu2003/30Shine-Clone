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
export default {
	getMonthlyRevenueTable,
	getRevenueByServiceTable,
};
