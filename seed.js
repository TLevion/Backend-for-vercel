const mongoose = require("mongoose");

mongoose
  .connect(
    "Your Mango's Link"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Connection failed:", err.message));

const menuSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: { type: Boolean, default: true },
  image: String,
});

const MenuItem = mongoose.model("MenuItem", menuSchema);

const items = [
  {
    name: "Cappuccino",
    category: "Hot Coffee",
    price: 450,
    inStock: true,
    image: "https://cdn.britannica.com/17/234017-050-F665E64D/cappuccino-Rome-Italy.jpg",
  },
  {
    name: "Iced Latte",
    category: "Cold Coffee",
    price: 520,
    inStock: true,
    image: "https://www.whiskaffair.com/wp-content/uploads/2020/12/Iced-Vanilla-Latte-2-1.jpg",
  },
  {
    name: "Espresso",
    category: "Hot Coffee",
    price: 400,
    inStock: false,
    image: "https://www.drurycoffee.com/wp-content/uploads/2019/02/Espresso1.jpg",
  },
  {
    name: "Cold Brew",
    category: "Cold Coffee",
    price: 560,
    inStock: true,
    image: "https://www.adamsandrussell.co.uk/wp-content/uploads/2018/09/how-to-cold-brew-coffee-at-home-1-scaled.jpg",
  },
];

async function seedDB() {
  await MenuItem.deleteMany();
  await MenuItem.insertMany(items);
  console.log("✅ Database seeded!");
  mongoose.connection.close();
}

seedDB();
