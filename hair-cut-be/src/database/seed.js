import { PrismaClient } from "./generated/client.js";
import fs from "fs";
const db = new PrismaClient();
const dataFilePath = process.cwd() + "/src/database/data.json";

const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

// Create a default category if none exists
let defaultCategory = await db.serviceCategory.findFirst();
if (!defaultCategory) {
	defaultCategory = await db.serviceCategory.create({
		data: {
			name: "Default Category",
			description: "Default service category",
			displayOrder: 1
		}
	});
	console.log("Created default category:", defaultCategory.name);
}

for await (const sv of data) {
	const service = await db.service.create({
		data: {
			estimatedTime: Number(sv.time),
			serviceName: sv.name,
			price: Number(sv.price),
			description: sv.des,
			bannerImageUrl: sv.banner,
			createdAt: new Date(),
			categoryId: defaultCategory.id // Add the required categoryId
		},
	});

	const serviceStep = sv.stepNames.map((step, index) => {
		return {
			stepTitle: step,
			serviceId: service.id,
			stepOrder: index + 1,
			stepDescription: "",
			stepImageUrl: sv.stepImgs[index],
		};
	});

	await db.serviceStep.createMany({
		data: serviceStep,
	});
	console.log("Created service:", service.serviceName);
}
