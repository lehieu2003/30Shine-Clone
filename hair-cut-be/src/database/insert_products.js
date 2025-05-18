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
const prisma = new PrismaClient();

// Path to the JSON file
const productsFilePath = path.join(__dirname, '../../products-dataset/product_details.json');

// Function to convert snake_case to camelCase
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

// Function to convert price to Decimal
const formatPrice = (price) => {
  // If price is an object with from and to, use the from value
  if (typeof price === 'object' && price !== null && price.from) {
    return price.from.toString();
  }
  return price.toString();
};

// Function to process and insert a single product
async function insertProduct(product) {
  try {
    console.log(`Processing product: ${product.name}`);

    // Prepare product data
    const productData = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.short_description || '',
      brand: product.brand || null,
      brandSlug: product.brand_slug || null,
      category: product.category || null,
      categorySlug: product.category_slug || null,
      subcategory: product.subcategory || null,
      subcategorySlug: product.subcategory_slug || null,
      price: formatPrice(product.price),
      listedPrice: formatPrice(product.listed_price || product.price),
      cost: null, // Not provided in the JSON
      discountPercent: product.discount_percent || 0,
      isDiscount: product.is_discount || false,
      quantity: 100, // Default value
      minimumStock: 10, // Default value
      isOutOfStock: product.is_out_of_stock || false,
      imageUrl: product.image_url || null,
      sku: null, // Will be set from variant if available
      tags: product.tags || null,
      ingredients: product.ingredients || '',
      manual: product.manual || '',
      ratingScore: product.rating_score || 0,
      totalSold: product.total_sold || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Create the product
      const createdProduct = await tx.product.upsert({
        where: { id: product.id },
        create: productData,
        update: productData
      });

      console.log(`Created/Updated product: ${createdProduct.name}`);

      // Insert product images if available
      if (product.images && product.images.length > 0) {
        console.log(`Adding ${product.images.length} images for product ${product.name}`);

        // Delete existing images first
        await tx.productImage.deleteMany({
          where: {
            productId: product.id
          }
        });

        // Insert new images
        for (const image of product.images) {
          await tx.productImage.create({
            data: {
              productId: product.id,
              name: image.name || '',
              url: image.url || '',
              alt: image.alt || ''
            }
          });
        }
      }

      // Insert product variants if available
      if (product.variants && product.variants.length > 0) {
        console.log(`Adding ${product.variants.length} variants for product ${product.name}`);

        // Delete existing variants first
        await tx.productVariant.deleteMany({
          where: {
            productId: product.id
          }
        });

        // Insert new variants
        for (const variant of product.variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              name: variant.name || 'Default',
              price: variant.price.toString(),
              listedPrice: (variant.listedPrice || variant.price).toString(),
              sku: variant.sku || null,
              imageUrl: variant.image?.url || null,
              isDiscount: variant.isDiscount || false,
              discountPercent: variant.discountPercent || 0,
              isOutOfStock: variant.isOutOfStock || false
            }
          });

          // If this is the default variant and the product has no SKU, set product SKU
          if ((variant.name === 'Default' || product.variants.length === 1) && !productData.sku) {
            await tx.product.update({
              where: { id: product.id },
              data: { sku: variant.sku }
            });
          }
        }
      }
    });

    return { success: true, productName: product.name };
  } catch (error) {
    console.error(`Error processing product ${product.name}:`, error);
    return { success: false, productName: product.name, error: error.message };
  }
}

// Main function to read and process all products
async function insertAllProducts() {
  try {
    // Read and parse the JSON file
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);

    console.log(`Found ${products.length} products to process.`);

    const results = {
      total: products.length,
      successful: 0,
      failed: 0,
      failedProducts: []
    };

    // Process each product
    for (const product of products) {
      const result = await insertProduct(product);
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.failedProducts.push({
          name: result.productName,
          error: result.error
        });
      }
    }

    // Log results
    console.log('\nInsert Products Summary:');
    console.log(`Total products: ${results.total}`);
    console.log(`Successfully inserted: ${results.successful}`);
    console.log(`Failed: ${results.failed}`);
    
    if (results.failed > 0) {
      console.log('\nFailed products:');
      results.failedProducts.forEach(product => {
        console.log(`- ${product.name}: ${product.error}`);
      });
    }

  } catch (error) {
    console.error('Error reading or processing products file:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
insertAllProducts()
  .then(() => console.log('Products insertion completed'))
  .catch(error => console.error('Error running script:', error));
