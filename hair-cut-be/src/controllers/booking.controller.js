import {
	processRequestBody,
	processRequestParams,
} from "zod-express-middleware";
import db from "../database/index.js";
import z from "zod";
import authService from "../services/auth.service.js";

const bookingSchema = z.object({
	phoneNumber: z.string().min(1),
	appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "appointmentDate must be a valid date",
	}),
	serviceIds: z.array(z.number().int().positive()).min(1),
	notes: z.string().optional(),
	employeeId: z.number().optional(),
	status: z.string().optional(),
});

const updateBookingSchema = bookingSchema.partial();

const createBooking = [
	processRequestBody(bookingSchema),
	async (req, res) => {
		try {
			const { phoneNumber, appointmentDate, serviceIds, notes } =
				req.body;
			const user = await authService.getUserByPhoneOrCreate(phoneNumber);
			if (!user)
				return res
					.status(500)
					.json({ message: "Something went wrong" });
			const allServices = await db.service.findMany({
				where: { id: { in: serviceIds } },
			});
			const totalPrice = allServices.reduce((acc, service) => {
				return acc + Number(service.price);
			}, 0);
			const booking = await db.booking.create({
				data: {
					customerId: user.id,
					appointmentDate: new Date(appointmentDate),
					employeeId: req.body.employeeId,
					notes,
					status: "pending",
					totalPrice,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			});
			await db.bookingService.createMany({
				data: serviceIds.map((serviceId) => ({
					bookingId: booking.id,
					serviceId,
				})),
			});

			return res.status(201).json(booking);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const querySchema = z.object({
	keyword: z.string().optional(),
	page: z.coerce.number().min(1).optional(),
	size: z.coerce.number().min(1).max(20000).optional(),
	sortBy: z
		.enum([
			"id",
			"appointmentDate",
			"status",
			"totalPrice",
			"createdAt",
			"updatedAt",
		])
		.default("createdAt"),
	sortDirection: z.enum(["asc", "desc"]).default("desc"),
	employeeId: z.coerce.number().int().optional(),

	status: z
		.enum([
			"pending",
			"confirmed",
			"cancelled",
			"in_progress",
			"completed",
			"success",
		])
		.optional(),
	dateFrom: z.string().date().optional(),
	dateTo: z.string().date().optional(),
});

const getBookings = [
	processRequestParams(querySchema),
	async (req, res) => {
		const {
			keyword,
			page,
			size,
			sortBy,
			sortDirection,
			employeeId,
			status,
			dateFrom,
			dateTo,
		} = req.query;

		// 1. Build WHERE clause
		const where = {};

		if (employeeId !== undefined) {
			where.employeeId = Number(employeeId);
		}
		if (status) {
			where.status = status;
		}
		if (dateFrom || dateTo) {
			where.appointmentDate = {
				...(dateFrom && { gte: dateFrom }),
				...(dateTo && { lte: dateTo }),
			};
		}
		if (keyword) {
			where.OR = [
				{
					customer: {
						phone: { contains: keyword },
					},
				},
				{
					customer: {
						fullName: { contains: keyword },
					},
				},
				{
					customer: {
						CCCD: { contains: keyword },
					},
				},
			];
		}

		try {
			// 2. Query total count (nếu cần)
			const total = await db.booking.count({ where });

			// 3. Lấy dữ liệu với include relations, pagination, sort
			const bookings = await db.booking.findMany({
				where,
				include: {
					customer: true,
					employee: true,
					services: {
						include: {
							service: true,
						},
					},
				},
				orderBy: { [sortBy]: sortDirection },
				skip: (page - 1) * size,
				take: Number(size),
			});

			return res.json({
				data: bookings,
				meta: { total, page, size },
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: err.message });
		}
	},
];

const getBookingById = async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

	try {
		const booking = await db.booking.findUnique({
			where: { id },
			include: {
				customer: true,
				employee: true,
				services: {
					include: {
						service: true,
					},
				},
			},
		});

		if (!booking) return res.status(404).json({ message: "Not found" });
		return res.json(booking);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

const updateBooking = [
	processRequestBody(updateBookingSchema),
	async (req, res) => {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
		console.log(req.body);
		try {
			const data = Object.fromEntries(
				Object.entries(req.body).filter(([_, v]) => v !== undefined)
			);
			const serviceIds = data.serviceIds;
			delete data.serviceIds;

			if (data.appointmentDate)
				data.appointmentDate = new Date(data.appointmentDate);
			const updated = await db.booking.update({
				where: { id },
				data: {
					...data,
				},
			});
			if (serviceIds) {
				await db.bookingService.deleteMany({
					where: { bookingId: id },
				});

				await db.bookingService.createMany({
					data: serviceIds.map((serviceId) => ({
						bookingId: id,
						serviceId,
					})),
				});
				const prices = await db.bookingService.findMany({
					where: { bookingId: id },
					include: {
						service: true,
					},
				});
				const totalPrice = prices.reduce((acc, service) => {
					return acc + Number(service.service.price);
				}, 0);
				await db.booking.update({
					where: { id },
					data: {
						totalPrice,
					},
				});
			}

			return res.json(updated);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const deleteBooking = async (req, res) => {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

	try {
		await db.booking.delete({ where: { id } });
		return res.status(204).end();
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};
const changeBookingStatus = [
	processRequestBody(
		z.object({
			status: z.enum([
				"pending",
				"confirmed",
				"cancelled",
				"in_progress",
				"completed",
				"success",
			]),
		})
	),
	async (req, res) => {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

		try {
			const updated = await db.booking.update({
				where: { id },
				data: {
					status: req.body.status,
				},
			});

			return res.json(updated);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];
export default {
	createBooking,
	getBookings: getBookings,
	getBookingById: [getBookingById],
	updateBooking,
	deleteBooking: [deleteBooking],
	changeBookingStatus: [changeBookingStatus],
};
