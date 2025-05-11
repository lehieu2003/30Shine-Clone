import { PrismaClient } from '../database/generated/index.js';
const prisma = new PrismaClient();

const cartController = {
  getCart: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have authentication middleware

      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId,
            items: {}
          },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      let cart = await prisma.cart.findFirst({
        where: { userId }
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId }
        });
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId
        }
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity
          }
        });
      }

      const updatedCart = await prisma.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCartItem: async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const userId = req.user.id;

      const cart = await prisma.cart.findFirst({
        where: { userId }
      });

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId
        }
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      if (quantity <= 0) {
        await prisma.cartItem.delete({
          where: { id: cartItem.id }
        });
      } else {
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity }
        });
      }

      const updatedCart = await prisma.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      const cart = await prisma.cart.findFirst({
        where: { userId }
      });

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId
        }
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      await prisma.cartItem.delete({
        where: { id: cartItem.id }
      });

      const updatedCart = await prisma.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default cartController;
