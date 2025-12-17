// backend/controllers/cartController.js
import mongoose from "mongoose";
import Cart from "../models/cartModel.js";

// addToCart
export const addToCart = async (req, res) => {
  try {
    const { fruitId } = req.body;
    const userId = new mongoose.Types.ObjectId(String(req.user.id));
    console.log("🟢 Cart add for userId:", userId);


    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ fruitId, quantity: 1 }] });
    } else {
      const item = cart.items.find(i => i.fruitId.toString() === fruitId);

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ fruitId, quantity: 1 });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const cart = await Cart.findOne({ userId }).populate("items.fruitId");
    res.json(cart);
  } catch (error) {
    console.error("getCart error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { fruitId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ error: "Cart not found" });
    cart.items = cart.items.filter(i => i.fruitId.toString() !== fruitId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ error: "Failed to remove item" });
  }
};


// -------------------- NEW: Save/Update entire cart --------------------
export const saveCart = async (req, res) => {
  try {
    console.log("Decoded user in saveCart:", req.user);
    console.log("Items from frontend:", req.body.items);

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const items = req.body.items || [];

    let cart = await Cart.findOne({ userId });
    if (cart) cart.items = items;
    else cart = new Cart({ userId, items });

    await cart.save();
    res.json({ success: true, message: "Cart saved", cart });
  } catch (error) {
    console.error("saveCart error:", error);
    res.status(500).json({ error: "Failed to save cart" });
  }
};
