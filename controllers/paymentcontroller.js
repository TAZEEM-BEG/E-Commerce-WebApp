// backend/controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/UserLogin.js";
import nodemailer from "nodemailer";

const checkEnv = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Missing Razorpay keys in .env");
  }
};

export const createOrder = async (req, res) => {
  try {
    console.log("CREATE ORDER - AUTH:", req.headers.authorization);
    console.log("CREATE ORDER - BODY:", req.body);

    checkEnv();

    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now()
    };

    const order = await instance.orders.create(options);
    return res.json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({ error: "Order creation failed", details: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("User ID:", userId);
    if (!userId) return res.status(400).json({ message: "userId missing" });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.fruitId");
    console.log("Cart from DB:", cart);  // ← yaha add karo
    if (!cart || !cart.items.length) return res.status(400).json({ message: "Cart empty" });

    const orderItems = cart.items.map(i => ({ fruitId: i.fruitId._id, quantity: i.quantity }));
    const totalAmount = cart.items.reduce((sum, i) => sum + (i.fruitId.price || 0) * i.quantity, 0);

    // Save order initially as Pending
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: "Pending"
    });
    await order.save();
    console.log("Order saved as Pending:", order);

    // Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Body sent to HMAC:", body);
    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      order.status = "Paid";
      await order.save();

      // Clear cart
      cart.items = [];
      await cart.save();

      // Send confirmation email if credentials exist
      const user = await User.findById(userId);
      if (user && user.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Order Confirmation",
          text: `Hi ${user.username || user.name || ''}, your payment of ₹${totalAmount} is successful! Order ID: ${order._id}`
        });
      }

      return res.status(200).json({ success: true, message: "Payment successful, order updated", order });
    } else {
      order.status = "Failed";
      await order.save();
      return res.status(400).json({ success: false, message: "Payment verification failed", order });
    }

  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({ error: "Verification failed", details: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await instance.orders.fetch(order_id);
    res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ error: "Fetch order failed", details: error.message });
  }
};
