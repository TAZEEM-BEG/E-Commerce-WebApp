// backend/routes/paymentRoutes.js
import express from "express";
import { createOrder, verifyPayment, getOrderById } from "../controllers/paymentController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

// Only logged-in users allowed
router.post("/create-order", verifyUser(), createOrder);
router.post("/verify", verifyUser(), verifyPayment);
router.get("/orders/:order_id", verifyUser(), getOrderById);

export default router;