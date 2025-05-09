import db from "../database/index.js";
import z from "zod";
import { processRequestBody } from "zod-express-middleware";

const stepSchema = z.object({
	serviceId: z.coerce.number(),
	stepName: z.string().min(1),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
});

const updateStepSchema = stepSchema.partial().extend({
	stepId: z.coerce.number(),
});

const stepOrderUpdateSchema = z.object({
	payload: z
		.array(
			z.object({
				stepId: z.coerce.number().int().positive(),
				order: z.coerce.number().int().positive(),
			})
		)
		.refine(
			(data) =>
				data.length === new Set(data.map((item) => item.stepId)).size,
			{
				message: "Duplicate stepId found",
			}
		),
});

const createStep = [
	processRequestBody(stepSchema),
	async (req, res) => {
		const { stepName, description, imageUrl, serviceId } = req.body;

		try {
			const maxOrder = await db.serviceStep.findFirst({
				where: { serviceId },
				orderBy: { stepOrder: "desc" },
				select: { stepOrder: true },
			});
			const stepOrder = maxOrder ? maxOrder.stepOrder + 1 : 1;
			const created = await db.serviceStep.create({
				data: {
					stepOrder,
					stepTitle: stepName,
					service: {
						connect: { id: serviceId },
					},
					stepDescription: description,
					stepImageUrl: imageUrl,
				},
			});
			return res.status(201).json(created);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const updateStep = [
	processRequestBody(updateStepSchema),
	async (req, res) => {
		const { stepId, stepName, description, imageUrl } = req.body;

		try {
			const updated = await db.serviceStep.update({
				where: { id: stepId },
				data: {
					stepTitle: stepName,
					stepDescription: description,
					stepImageUrl: imageUrl,
				},
			});
			return res.status(200).json(updated);
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const deleteStep = [
	async (req, res) => {
		const stepId = req.params.id;
		try {
			await db.serviceStep.delete({ where: { id: Number(stepId) } });
			return res.status(204).end();
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

const updateStepOrder = [
	// processRequestBody(stepOrderUpdateSchema),
	async (req, res) => {
		const stepOrders = req.body.payload.map((step) => ({
			stepId: Number(step.stepId),
			order: step.order,
		}));
		console.log("Step orders:", stepOrders);

		try {
			await Promise.all(
				stepOrders.map((step) =>
					db.serviceStep.update({
						where: { id: step.stepId },
						data: { stepOrder: step.order },
					})
				)
			);
			return res.status(200).json({ message: "Step order updated" });
		} catch (err) {
			return res.status(500).json({ error: err.message });
		}
	},
];

export default {
	createStep,
	updateStep,
	deleteStep,
	updateStepOrder,
};
