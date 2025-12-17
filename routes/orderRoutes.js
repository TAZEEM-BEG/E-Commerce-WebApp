// backend/routes/orderRoutes.js
import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import verifyUser from "../Middleware/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser(["user"]), createOrder);
router.get("/myorders", verifyUser(["user"]), getMyOrders);

export default router;