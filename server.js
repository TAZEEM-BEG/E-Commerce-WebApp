import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

import connectDB from "./config/db.js";

// Routes
import fruitRoutes from "./routes/fruitRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
  origin: "*",
  credentials: true
}));

// ---------------- DB ----------------
connectDB();

// ---------------- Static ----------------
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ---------------- EJS Setup ----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "main");

// ---------------- Frontend Routes ----------------
app.get("/", (req, res) => res.render("fruits"));

app.get("/fruits", (req, res) =>
  res.render("fruits", { script: `<script src="/js/fruits.js"></script>` })
);

app.get("/login", (req, res) =>
  res.render("login", { script: `<script src="/js/login.js"></script>` })
);

app.get("/register", (req, res) =>
  res.render("register", { script: `<script src="/js/login.js"></script>` })
);

app.get("/cart", (req, res) =>
  res.render("cart", { script: `<script src="/js/cart.js"></script>` })
);

app.get("/reset-password", (req, res) =>
  res.render("reset-password", { script: `<script src="/js/login.js"></script>` })
);

// ---------------- API Routes ----------------
app.use("/api/fruits", fruitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// ---------------- Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
