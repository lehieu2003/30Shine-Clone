import { PrismaClient } from "./generated/client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { dirname } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
dotenv.config({ path: path.join(rootDir, '.env') });

// Initialize PrismaClient
const db = new PrismaClient();
const dataFilePath = path.join(__dirname, "data.json");

// Main function to handle seeding with proper error handling
async function seedServices() {
  try {
    console.log("Reading data file...");
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

    console.log(`Processing ${data.length} services...`);
    
    for (const sv of data) {
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
    
    console.log("Service seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Execute the seeding function
seedServices();
