import mongoose from "mongoose";

import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {

  username: { 
    type: String, required: true
   },
   
  email: { 
    type: String, required: true, unique: true 
  },

  password: { 
    type: String, required: true 
  },

  role: { 
    type: String, 
    enum: ["admin", "user"], 
    default: "user" 
  },

  balance: { type: Number, default: 1000 } // 👈 user ke paas by default ₹1000
}

);

// Hash password before save
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};



export default mongoose.model("User", userSchema);



// Line-by-line samjha:

// userSchema.pre("save")
// → Jab user ko save karne wale ho (e.g., signup time), tab ye chalega.

// if (!this.isModified("password")) return next();
// → Agar password field change hi nahi hua (jaise user sirf name update kar raha hai),
// to dobara hash karne ki zarurat nahi.

// this.password = await bcrypt.hash(this.password, 10);
// → Ye line actually password encrypt karti hai using bcrypt.

// "this.password" → user ka plain password

// "10" → salt rounds, yani encryption strength

// Example: "123456" → $2b$10$SkmWQ7IYp5jPl3K5J72jUuHrW4ldgu... (hashed version)

// next()
// → Bolta hai ki ab next step (actual save) chalu karo.

// 🧩 Result:
// User ka password hash (encrypted) format me database me save hoga.

// Part 2: userSchema.methods.comparePassword = async function(password) {...}

// Ye ek custom method hai jo login ke time password verify karta hai 🔍

// Code:
// userSchema.methods.comparePassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// Explanation:

// password → user ne login form me jo likha (plain text)

// this.password → database me stored (hashed password)

// bcrypt.compare() dono compare karta hai aur
// ✅ true return karta hai agar match hua
// ❌ false agar password galat hua.