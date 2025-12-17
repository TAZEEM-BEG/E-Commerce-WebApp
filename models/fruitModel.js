import mongoose from "mongoose";

// Ye MongoDB ka schema (table structure) define karega
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },

stock: {
      type: Number,
      default: 10
    },

  category: {
  type: String,
  enum: ["fruit", "vegetable"],
  default: "fruit"
}
  },
  
    {
    timestamps: true // ✅ Correct location & value
  }
  


);

// Ye model export karega (MongoDB me 'fruits' collection banegi)
export default mongoose.model("Fruit", fruitSchema);
