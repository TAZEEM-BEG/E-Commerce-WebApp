// backend/controllers/orderController.js
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {

    console.log("REQ.USER DATA:", req.user);  // 👈 YEH ADD KARO
    const userId = req.user._id || req.user.id;


    const cart = await Cart.findOne({ userId }).populate("items.fruitId");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const totalAmount = cart.items.reduce(
      (total, item) => total + (item.fruitId.price || 0) * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: cart.items,
      totalAmount,
      status: "Pending"
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.json(order);
  } catch (error) {
    console.error("orderController.createOrder error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ userId }).populate("items.fruitId");
    res.json(orders);
  } catch (error) {
    console.error("orderController.getMyOrders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};