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

const categoryOptions = [
  { id: 1, name: 'Cắt tóc' },
  { id: 2, name: 'Uốn tóc' },
  { id: 3, name: 'Nhuộm tóc' },
  { id: 4, name: 'Chăm sóc da' },
  { id: 5, name: 'Khác' },
]

function getRandomCategoryId() {
  const randomIndex = Math.floor(Math.random() * categoryOptions.length);
  return categoryOptions[randomIndex].id;
}

// Main function to handle seeding with proper error handling
async function seedServices() {
  try {
    console.log("Reading data file...");
    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

    // Create service categories first
    console.log("Creating service categories...");
    for (const category of categoryOptions) {
      const existingCategory = await db.serviceCategory.findUnique({
        where: { id: category.id }
      });
      
      if (!existingCategory) {
        await db.serviceCategory.create({
          data: {
            id: category.id,
            name: category.name,
            description: `Danh mục dịch vụ ${category.name}`,
            displayOrder: category.id
          }
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    console.log(`Processing ${data.length} services...`);
    
    for (const sv of data) {
      // Check if service already exists by name
      const existingService = await db.service.findFirst({
        where: { serviceName: sv.name }
      });
      
      if (existingService) {
        console.log(`Service already exists: ${sv.name}`);
        continue;
      }
      
      const service = await db.service.create({
        data: {
          estimatedTime: Number(sv.time),
          serviceName: sv.name,
          price: Number(sv.price),
          description: sv.des,
          bannerImageUrl: sv.banner,
          createdAt: new Date(),
          categoryId: getRandomCategoryId() // Add the required categoryId
        },
      });

      // Check if service steps already exist
      const existingSteps = await db.serviceStep.findMany({
        where: { serviceId: service.id }
      });
      
      if (existingSteps.length === 0) {
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
      }
      
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
