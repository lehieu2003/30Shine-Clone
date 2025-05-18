import { processRequestBody } from "zod-express-middleware";
import db from "../database/index.js";
import z from "zod";

const serviceSchema = z.object({
	serviceName: z.string().min(1),
	estimatedTime: z.number().positive(),
	price: z.number().positive(),
	bannerImageUrl: z.string().optional(),
	description: z.string().optional(),
	categoryId: z.number().positive(), // Make sure it's required and positive
	isActive: z.boolean().optional(),
	steps: z.array(z.object({
		stepOrder: z.number().int().positive(),
		stepTitle: z.string(),
		stepDescription: z.string().optional(),
		stepImageUrl: z.string().optional(),
	})).optional(),
});
const updateServiceSchema = serviceSchema.partial();
const querySchema = z.object({
	keyword: z.string().optional(),
	page: z.coerce.number().min(1).optional(),
	size: z.coerce.number().min(1).max(20000).optional(),
	sortBy: z
		.enum(["serviceName", "price", "createdAt", "estimatedTime"])
		.default("createdAt"),
	sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

const createService = [
	processRequestBody(serviceSchema),
	async (req, res) => {
		const {
			serviceName,
			estimatedTime,
			price,
			steps,
			bannerImageUrl,
			description,
			categoryId,
			isActive,
		} = req.body;
		try {
			const data = {
				serviceName,
				estimatedTime,
				price,
				createdAt: new Date(),
				bannerImageUrl,
				description,
				categoryId,
				isActive: isActive ?? true,
			};
			
			// Handle steps separately from other data
			if (steps && steps.length > 0) {
				data.steps = { 
					create: steps.map(step => ({
						stepOrder: step.stepOrder,
						stepTitle: step.stepTitle,
						stepDescription: step.stepDescription,
						stepImageUrl: step.stepImageUrl,
					}))
				};
			}
			
			const created = await db.service.create({
				data: data,
				include: {
					steps: true,
					category: true,
				},
			});
			return res.status(201).json(created);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const getServices = [
	async (req, res) => {
		const {
			keyword,
			page = 1,
			size = 20,
			sortBy,
			sortDirection,
		} = querySchema.parse(req.query);
		const where = keyword ? { serviceName: { contains: keyword } } : {};

		const [services, total] = await Promise.all([
			db.service.findMany({
				where,
				orderBy: { [sortBy]: sortDirection },
				skip: (page - 1) * size,
				take: size,
				include: { 
					steps: true,
					category: true, // Include category information
				},
			}),
			db.service.count({ where }),
		]);

		return res.json({ data: services, page, size, total });
	},
];

const getServiceById = async (req, res) => {
	const id = Number(req.params.id);
	const service = await db.service.findUnique({
		where: { id },
		include: { 
			steps: true,
			category: true, // Include category information
		},
	});
	if (!service) return res.status(404).json({ message: "Not found" });
	return res.json(service);
};

const updateService = [
	processRequestBody(updateServiceSchema),
	async (req, res) => {
		const id = Number(req.params.id);
		try {
			const updated = await db.service.update({
				where: { id },
				data: {
					...req.body,
				},
			});
			return res.json(updated);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const deleteService = async (req, res) => {
	const id = Number(req.params.id);
	try {
		await db.service.delete({ where: { id } });
		return res.status(204).end();
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export default {
	createService,
	getServices,
	getServiceById: [getServiceById],
	updateService,
	deleteService: [deleteService],
};
