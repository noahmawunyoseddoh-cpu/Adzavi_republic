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
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Cream"],
    stock: 25,
    featured: true,
  },
  {
    name: "Wax Print Wrap Skirt",
    description: "Adjustable wrap skirt in a bold Ankara print, fully lined.",
    price: 180,
    category: "Women",
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800"],
    sizes: ["S", "M", "L"],
    colors: ["Orange multi", "Blue multi"],
    stock: 15,
    featured: true,
  },
  {
    name: "Linen Blend Shirt",
    description: "Breathable linen-cotton shirt, cut relaxed for Accra's heat.",
    price: 150,
    category: "Men",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"],
    sizes: ["M", "L", "XL"],
    colors: ["White", "Sand"],
    stock: 20,
  },
  {
    name: "Beaded Waist Belt",
    description: "Handmade beaded waist accessory, one size fits most.",
    price: 65,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=800"],
    sizes: [],
    colors: ["Multicolor"],
    stock: 40,
  },
  {
    name: "Denim Jumpsuit",
    description: "Structured denim jumpsuit with a tie waist.",
    price: 220,
    category: "Women",
    images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800"],
    sizes: ["S", "M", "L"],
    colors: ["Indigo"],
    stock: 10,
    featured: true,
  },
  {
    name: "Kids Print Romper",
    description: "Soft cotton romper with a playful Ankara print panel.",
    price: 85,
    category: "Kids",
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800"],
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
