import  Fruit from "../models/fruitModel.js"; // ✅ MongoDB model import

// 🟢 GET - sab fruits laao
export const getFruits = async (req, res) => {
  try {
    const fruits = await Fruit.find({});
    res.json(fruits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fruits" });
  }
};

// 🟢 POST - naya fruit add karo
export const addFruit = async (req, res) => {
  try {
    const { name, price, description, image, category  } = req.body;
    const fruit = new Fruit({ name, price, description, image, category });
    await fruit.save(); // ✅ ye line DB me data save karegi
    res.status(201).json(fruit);
  } catch (error) {
    console.error("Error adding fruit:", error);
    res.status(500).json({ error: "Failed to add fruit" });
  }
};

// 🟢 PUT - existing fruit update karo
export const updateFruit = async (req, res) => {
  try {
    const fruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!fruit) return res.status(404).json({ error: "Fruit not found" });
    res.json(fruit);
  } catch (error) {
    res.status(500).json({ error: "Failed to update fruit" });
  }
};

// 🟢 DELETE - fruit delete karo
export const deleteFruit = async (req, res) => {
  try {
    const fruit = await Fruit.findByIdAndDelete(req.params.id);
    if (!fruit) return res.status(404).json({ error: "Fruit not found" });
    res.json({ message: "Fruit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete fruit" });
  }
};
