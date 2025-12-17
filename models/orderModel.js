import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      fruitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fruit"
      },
      quantity: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Pending" // Pending, Paid, Shipped, Delivered
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
