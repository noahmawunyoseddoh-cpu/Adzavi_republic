import express from "express";
import crypto from "crypto";
import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// @route  POST /api/payments/initialize
// Body: { items: [{productId, size, color, quantity}], shippingAddress }
router.post("/initialize", protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Recalculate total server-side (never trust the frontend's total)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Paystack expects amount in the smallest currency unit (pesewas for GHS)
    const amountInPesewas = Math.round(totalAmount * 100);
    const reference = `order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentReference: reference,
      paymentStatus: "pending",
    });

    const paystackRes = await paystack.post("/transaction/initialize", {
      email: req.user.email,
      amount: amountInPesewas,
      currency: "GHS",
      reference,
      channels: ["card", "mobile_money", "bank"], // ensures Mobile Money is offered
      callback_url: `${process.env.CLIENT_URL}/order-confirmation?reference=${reference}`,
      metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
    });

    res.json({
      authorizationUrl: paystackRes.data.data.authorization_url,
      reference,
      orderId: order._id,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

// @route  GET /api/payments/verify/:reference
// Called by the frontend after redirect back from Paystack, to confirm status immediately
router.get("/verify/:reference", protect, async (req, res) => {
  try {
    const { reference } = req.params;
    const verifyRes = await paystack.get(`/transaction/verify/${reference}`);
    const { status, gateway_response } = verifyRes.data.data;

    const order = await Order.findOne({ paymentReference: reference });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "success" && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      await order.save();

      // Reduce stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    } else if (status !== "success") {
      order.paymentStatus = "failed";
      await order.save();
    }

    res.json({ status, gateway_response, order });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Verification failed" });
  }
});

// @route  POST /api/payments/webhook
// Paystack calls this server-to-server — the source of truth for payment status.
// Register this URL in your Paystack dashboard: https://yourdomain.com/api/payments/webhook
// Note: raw body parsing for this route is applied in server.js (mounted
// before express.json()), since Paystack's signature check needs the raw bytes.
router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(req.body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const order = await Order.findOne({ paymentReference: reference });

      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        await order.save();

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.sendStatus(500);
  }
});

export default router;
