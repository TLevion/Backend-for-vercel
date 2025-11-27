import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection using Env Variable
const MONGO_URI = process.env.MONGO_URI;

if (!global.mongooseConnected) {
  mongoose
    .connect(MONGO_URI)
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
const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", menuSchema);

// Routes

// ADD THIS ROOT ROUTE HANDLER
app.get("/", async (req, res) => {
  res.json({ 
    message: "Backend API is running!",
    endpoints: [
      "GET /menu - Get all menu items",
      "GET /menu/random - Get random menu item"
    ],
    timestamp: new Date().toISOString()
  });
});

app.get("/menu", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch {
    res.status(500).json({ error: "Error fetching menu" });
  }
});

app.get("/menu/random", async (req, res) => {
  try {
    const items = await MenuItem.find({ inStock: true });
    const random = items[Math.floor(Math.random() * items.length)];
    res.json(random);
  } catch {
    res.status(500).json({ error: "Error fetching random item" });
  }
});

// Export for Vercel
export default app;