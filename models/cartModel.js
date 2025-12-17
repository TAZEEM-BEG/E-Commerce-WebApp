import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // tumhare auth ka user model
    required: true
  },
  items: [
    {
      fruitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fruit",
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
