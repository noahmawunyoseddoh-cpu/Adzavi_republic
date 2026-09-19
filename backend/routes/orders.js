import express from "express";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/orders/mine
router.get("/mine", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route  GET /api/orders/:id
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized to view this order" });
  }
  res.json(order);
});

// @route  GET /api/orders (admin — all orders)
router.get("/", protect, admin, async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// @route  PUT /api/orders/:id/status (admin — update shipping status)
router.put("/:id/status", protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.orderStatus = req.body.orderStatus;
  await order.save();
  res.json(order);
});

export default router;
