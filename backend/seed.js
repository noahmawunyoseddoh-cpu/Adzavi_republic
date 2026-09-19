// Run with: node seed.js
// Populates the database with sample products and one admin user so you can
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

// Same Windows DNS workaround as config/db.js — see that file for why this
// is needed.
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const sampleProducts = [
  {
    name: "Kente-trim Oversized Tee",
    description: "Heavyweight cotton tee with a hand-woven kente trim at the collar.",
    price: 120,
    category: "Men",
    images: ["/images/pic1.jpeg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Cream"],
    stock: 25,
    featured: true,
  },
  {
    name: "SHIRT",
    description: "Adjustable wrap skirt in a bold Ankara print, fully lined.",
    price: 180,
    category: "Women",
    images: ["/images/pic3.jpeg"],
    sizes: ["S", "M", "L"],
    colors: ["Orange multi", "Blue multi"],
    stock: 15,
    featured: true,
  },
  {
    name: "SHIRT 2",
    description: "Breathable linen-cotton shirt, cut relaxed for Aflao's heat.",
    price: 150,
    category: "Men",
    images: ["/images/pic4.jpeg"],
    sizes: ["M", "L", "XL"],
    colors: ["White", "Sand"],
    stock: 20,
  },
  {
    name: "SHIRT 3",
    description: ".",
    price: 65,
    category: "Accessories",
    images: ["/images/pic6.jpeg"],
    sizes: [],
    colors: ["Multicolor"],
    stock: 40,
  },
  {
    name: "SHIRT 4",
    description: "Structured denim jumpsuit with a tie waist.",
    price: 220,
    category: "Women",
    images: ["/images/pic4.jpeg"],
    sizes: ["S", "M", "L"],
    colors: ["Indigo"],
    stock: 10,
    featured: true,
  },
  {
    name: "SHIRT 5",
    description: "Soft cotton romper with a playful Ankara print panel.",
    price: 85,
    category: "Kids",
    images: ["/images/pic6.jpeg"],
    sizes: ["2-3y", "4-5y", "6-7y"],
    colors: ["Green multi"],
    stock: 18,
    featured: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);

    const adminExists = await User.findOne({ email: "admin@adzavirepublic.com" });
    if (!adminExists) {
      await User.create({
        name: "Shop Admin",
        email: "admin@adzavirepublic.com",
        password: "admin123", // change this immediately after first login
        isAdmin: true,
      });
      console.log("Created admin user: admin@adzavirepublic.com / admin123 (change this password!)");
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
