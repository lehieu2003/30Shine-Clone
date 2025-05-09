import { processRequestBody } from "zod-express-middleware";
import db from "../database/index.js";
import z from "zod";
const querySchema = z.object({
	keyword: z.string().optional(),
	page: z.coerce.number().min(1).optional(),
	size: z.coerce.number().min(1).max(20000).optional(),
	sortBy: z.enum(["fullName", "id"]).default("id"),
	sortDirection: z.enum(["asc", "desc"]).default("desc"),
	role: z
		.array(z.enum(["admin", "receptionist", "barber", "customer"]))
		.optional(),
	status: z.enum(["active", "inactive"]).optional(),
	availabilityStatus: z.enum(["available", "unavailable"]).optional(),
});
const createUserSchema = z.object({
	fullName: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
	phone: z.string().min(8).max(15),
	role: z.enum(["admin", "receptionist", "barber", "customer"]),
	gender: z.boolean().optional(),
	address: z.string().optional(),
	birthDate: z.coerce.date().optional(),
	CCCD: z.string().optional(),
	status: z.enum(["active", "inactive"]).optional(),
	availabilityStatus: z.enum(["available", "unavailable"]).optional(),
});

const getListUsers = [
	async (req, res) => {
		const query = {
			...req.query,
			role: Array.isArray(req.query.role)
				? req.query.role
				: [req.query.role],
		};
		console.log(query);
		const {
			keyword,
			page = 1,
			size = 20,
			sortBy,
			sortDirection,
			role,
			status,
			availabilityStatus,
		} = querySchema.parse(query);

		const where = {
			...(keyword && {
				OR: [
					{ fullName: { contains: keyword } },
					{ email: { contains: keyword } },
					{ phone: { contains: keyword } },
				],
			}),

			...(status && { status }),
			...(role && { role: { in: role } }),
			...(availabilityStatus && { availabilityStatus }),
		};

		try {
			const [users, total] = await Promise.all([
				db.user.findMany({
					where,
					orderBy: { [sortBy]: sortDirection },
					skip: (page - 1) * size,
					take: size,
				}),
				db.user.count({ where }),
			]);

			res.json({ data: users, page, size, total });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
];
const createUser = [
	processRequestBody(createUserSchema),
	async (req, res) => {
		try {
			const user = await db.user.create({
				data: {
					...req.body,
					createdAt: new Date(),
				},
			});
			res.status(201).json(user);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
];

const updateUserSchema = createUserSchema.partial();

const updateUser = [
	processRequestBody(updateUserSchema),
	async (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id))
			return res.status(400).json({ error: "Invalid user ID" });

		try {
			const updated = await db.user.update({
				where: { id },
				data: req.body,
			});
			res.json(updated);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
];

const deleteUser = [
	async (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id))
			return res.status(400).json({ error: "Invalid user ID" });

		try {
			await db.user.delete({ where: { id } });
			res.json({ message: `User ${id} deleted successfully.` });
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
];
const toggleAvailabilityStatus = [
	async (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id))
			return res.status(400).json({ error: "Invalid user ID" });

		try {
			const user = await db.user.findUnique({ where: { id } });
			if (!user) return res.status(404).json({ error: "User not found" });

			const updatedUser = await db.user.update({
				where: { id },
				data: {
					availabilityStatus:
						user.availabilityStatus === "available"
							? "unavailable"
							: "available",
				},
			});
			res.json(updatedUser);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
];
const toggleStatus = [
	async (req, res) => {
		const id = parseInt(req.params.id);
		if (isNaN(id))
			return res.status(400).json({ error: "Invalid user ID" });

		try {
			const user = await db.user.findUnique({ where: { id } });
			if (!user) return res.status(404).json({ error: "User not found" });

			const updatedUser = await db.user.update({
				where: { id },
				data: {
					status: user.status === "active" ? "inactive" : "active",
				},
			});
			res.json(updatedUser);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
];
export default {
	getListUsers,
	createUser,
	updateUser,
	deleteUser,
	toggleAvailabilityStatus,
	toggleStatus,
};
