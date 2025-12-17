// backend/routes/cartRoutes.js
import express from "express";
import { addToCart, getCart, removeFromCart, saveCart } from "../controllers/cartController.js";
import verifyUser from "../Middleware/verifyUser.js";
const router = express.Router();

router.post("/add", verifyUser(["user"]), addToCart);
router.get("/", verifyUser(["user"]), getCart);
router.delete("/remove/:fruitId", verifyUser(["user"]), removeFromCart);
router.post("/save", verifyUser(["user"]), saveCart);


export default router;