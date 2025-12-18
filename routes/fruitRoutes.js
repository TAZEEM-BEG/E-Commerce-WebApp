import  express from "express";
import verifyUser from "../middleware/verifyUser.js";
import {
  getFruits,
  addFruit,
  updateFruit,
  deleteFruit,
} from "../controllers/fruitController.js";



const router = express.Router();


// 🔓 Public (कोई भी / login user fruits देख सकता है
router.get("/",  getFruits);


router.post("/", verifyUser(["admin"]),addFruit);
router.put("/:id", verifyUser(["admin"]),updateFruit);
router.delete("/:id", verifyUser(["admin"]), deleteFruit);

export default router;
