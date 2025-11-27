import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connect Mongo ONLY once
if (!global.mongooseConnected) {
  mongoose
    .connect(
      "mongodb+srv://levion96_db_user:12345@coffeeshopcluster.bxgwpwh.mongodb.net/coffee_shop_db"
    )
    .then(() => {
      console.log("MongoDB connected");
      global.mongooseConnected = true;
    })
    .catch((err) => console.log("MongoDB connection error:", err));
}

// Schema
const menuSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: { type: Boolean, default: true },
  image: String,
});

// Model
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuSchema);

// Routes
app.get("/api/menu", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch {
    res.status(500).json({ error: "Error fetching menu" });
  }
});

app.get("/api/menu/random", async (req, res) => {
  try {
    const items = await MenuItem.find({ inStock: true });
    const random = items[Math.floor(Math.random() * items.length)];
    res.json(random);
  } catch {
    res.status(500).json({ error: "Error fetching random item" });
  }
});

// Vercel export
export default app;
