import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // stored in GHS (cedis)
    category: { type: String, required: true }, // e.g. "Men", "Women", "Kids", "Accessories"
    images: [{ type: String, required: true }], // image URLs
    sizes: [{ type: String }], // e.g. ["S", "M", "L", "XL"]
    colors: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
