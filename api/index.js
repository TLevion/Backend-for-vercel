import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection - FIXED for serverless
const MONGO_URI = process.env.MONGO_URI;

// Better connection handling for Vercel
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Schema
const menuSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: { type: Boolean, default: true },
  image: String,
});

const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuSchema);

// Routes
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
    await connectDB(); // Ensure connection before query
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Error fetching menu: " + error.message });
  }
});

app.get("/menu/random", async (req, res) => {
  try {
    await connectDB(); // Ensure connection before query
    const items = await MenuItem.find({ inStock: true });
    if (items.length === 0) {
      return res.status(404).json({ error: "No items found" });
    }
    const random = items[Math.floor(Math.random() * items.length)];
    res.json(random);
  } catch (error) {
    console.error("Error fetching random item:", error);
    res.status(500).json({ error: "Error fetching random item: " + error.message });
  }
});

// Optional: Handle favicon requests to avoid 404s
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No content
});

// Export for Vercel
export default app;