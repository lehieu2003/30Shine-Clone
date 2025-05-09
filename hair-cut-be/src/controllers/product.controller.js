import { PrismaClient } from "../database/generated/index.js";

const prisma = new PrismaClient();

const productController = {
  // Get all products with optional filtering
  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy = "createdAt",
        sortOrder = "desc",
        isActive,
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Build filter
      const filter = {
        where: {
          ...(search && {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
              { brand: { contains: search } },
            ],
          }),
          ...(category && { categorySlug: category }),
          ...(brand && { brandSlug: brand }),
          ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
          ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
          ...(isActive !== undefined && { isActive: isActive === 'true' }),
        },
        include: {
          images: true,
          variants: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany(filter),
        prisma.product.count({ where: filter.where }),
      ]);

      return res.status(200).json({
        success: true,
        data: products,
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error getting products:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get a product by ID or slug
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { id },
            { slug: id }, // If ID is actually a slug
          ],
        },
        include: {
          images: true,
          variants: true,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error getting product:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const {
        name,
        slug,
        description,
        shortDescription,
        brand,
        brandSlug,
        category,
        categorySlug,
        subcategory,
        subcategorySlug,
        price,
        listedPrice,
        cost,
        discountPercent,
        isDiscount,
        quantity,
        minimumStock,
        imageUrl,
        sku,
        tags,
        ingredients,
        manual,
        images,
        variants,
      } = req.body;

      // Create the product using a transaction to ensure all related records are created together
      const product = await prisma.$transaction(async (prisma) => {
        // Create the main product
        const newProduct = await prisma.product.create({
          data: {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            description,
            shortDescription,
            brand,
            brandSlug,
            category,
            categorySlug,
            subcategory,
            subcategorySlug,
            price: parseFloat(price),
            listedPrice: parseFloat(listedPrice || price),
            cost: cost ? parseFloat(cost) : null,
            discountPercent: discountPercent || 0,
            isDiscount: isDiscount || false,
            quantity: quantity || 0,
            minimumStock: minimumStock || 5,
            isOutOfStock: (quantity || 0) <= 0,
            imageUrl,
            sku,
            tags,
            ingredients,
            manual,
          },
        });

        // Create product images if provided
        if (images && images.length > 0) {
          await prisma.productImage.createMany({
            data: images.map((image) => ({
              productId: newProduct.id,
              name: image.name,
              url: image.url,
              alt: image.alt,
            })),
          });
        }

        // Create product variants if provided
        if (variants && variants.length > 0) {
          await prisma.productVariant.createMany({
            data: variants.map((variant) => ({
              productId: newProduct.id,
              name: variant.name,
              price: parseFloat(variant.price),
              listedPrice: parseFloat(variant.listedPrice || variant.price),
              sku: variant.sku,
              imageUrl: variant.imageUrl,
              isDiscount: variant.isDiscount || false,
              discountPercent: variant.discountPercent || 0,
              isOutOfStock: variant.isOutOfStock || false,
            })),
          });
        }

        // Record initial inventory transaction
        if (quantity && quantity > 0) {
          await prisma.inventoryTransaction.create({
            data: {
              productId: newProduct.id,
              quantity: parseInt(quantity),
              unitPrice: parseFloat(cost || price),
              totalPrice: parseFloat(cost || price) * parseInt(quantity),
              employeeId: req.user.id,
              notes: "Initial stock",
            },
          });
        }

        return newProduct;
      });

      // Get the complete product with relations
      const completeProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          variants: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: completeProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        description,
        shortDescription,
        brand,
        brandSlug,
        category,
        categorySlug,
        subcategory,
        subcategorySlug,
        price,
        listedPrice,
        cost,
        discountPercent,
        isDiscount,
        minimumStock,
        imageUrl,
        sku,
        tags,
        ingredients,
        manual,
        isActive,
        images,
        variants,
      } = req.body;

      // Check if product exists
      const productExists = await prisma.product.findUnique({
        where: { id },
      });

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Update the product using a transaction
      await prisma.$transaction(async (prisma) => {
        // Update the main product
        await prisma.product.update({
          where: { id },
          data: {
            name,
            slug,
            description,
            shortDescription,
            brand,
            brandSlug,
            category,
            categorySlug,
            subcategory,
            subcategorySlug,
            ...(price && { price: parseFloat(price) }),
            ...(listedPrice && { listedPrice: parseFloat(listedPrice) }),
            ...(cost && { cost: parseFloat(cost) }),
            ...(discountPercent !== undefined && { discountPercent }),
            ...(isDiscount !== undefined && { isDiscount }),
            ...(minimumStock !== undefined && { minimumStock }),
            imageUrl,
            sku,
            tags,
            ingredients,
            manual,
            ...(isActive !== undefined && { isActive }),
            updatedAt: new Date(),
          },
        });

        // Update images if provided
        if (images) {
          // Delete existing images
          await prisma.productImage.deleteMany({
            where: { productId: id },
          });

          // Create new images
          if (images.length > 0) {
            await prisma.productImage.createMany({
              data: images.map((image) => ({
                productId: id,
                name: image.name,
                url: image.url,
                alt: image.alt,
              })),
            });
          }
        }

        // Update variants if provided
        if (variants) {
          // Delete existing variants
          await prisma.productVariant.deleteMany({
            where: { productId: id },
          });

          // Create new variants
          if (variants.length > 0) {
            await prisma.productVariant.createMany({
              data: variants.map((variant) => ({
                productId: id,
                name: variant.name,
                price: parseFloat(variant.price),
                listedPrice: parseFloat(variant.listedPrice || variant.price),
                sku: variant.sku,
                imageUrl: variant.imageUrl,
                isDiscount: variant.isDiscount || false,
                discountPercent: variant.discountPercent || 0,
                isOutOfStock: variant.isOutOfStock || false,
              })),
            });
          }
        }
      });

      // Get the updated product with relations
      const updatedProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          images: true,
          variants: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if product exists
      const productExists = await prisma.product.findUnique({
        where: { id },
      });

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Delete the product (cascade will delete related images and variants)
      await prisma.product.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Update product inventory
  updateInventory: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, unitPrice, notes } = req.body;

      if (!quantity || !unitPrice) {
        return res.status(400).json({
          success: false,
          message: "Quantity and unit price are required",
        });
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const parsedQuantity = parseInt(quantity);
      const parsedUnitPrice = parseFloat(unitPrice);
      const totalPrice = parsedQuantity * parsedUnitPrice;

      // Update inventory using a transaction
      await prisma.$transaction(async (prisma) => {
        // Create inventory transaction
        await prisma.inventoryTransaction.create({
          data: {
            productId: id,
            quantity: parsedQuantity,
            unitPrice: parsedUnitPrice,
            totalPrice,
            notes,
            employeeId: req.user.id,
          },
        });

        // Update product quantity
        const newQuantity = product.quantity + parsedQuantity;
        await prisma.product.update({
          where: { id },
          data: {
            quantity: newQuantity,
            isOutOfStock: newQuantity <= 0,
          },
        });
      });

      // Get the updated product
      const updatedProduct = await prisma.product.findUnique({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Inventory updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get inventory transactions for a product
  getInventoryTransactions: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Get transactions for the product
      const [transactions, total] = await Promise.all([
        prisma.inventoryTransaction.findMany({
          where: { productId: id },
          include: {
            employee: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: { transactionDate: "desc" },
          skip,
          take: parseInt(limit),
        }),
        prisma.inventoryTransaction.count({
          where: { productId: id },
        }),
      ]);

      return res.status(200).json({
        success: true,
        data: transactions,
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error getting inventory transactions:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default productController;
