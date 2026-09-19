import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import "./Checkout.css";

export default function Checkout() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ street: "", city: "", region: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shippingAddress: { ...form, country: "Ghana" },
      };
      const { data } = await api.post("/payments/initialize", payload);
      // Redirect to Paystack's hosted checkout — handles card and Mobile Money
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong starting payment.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/shop");
    return null;
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handlePay}>
          <h2>Shipping details</h2>
          <label>
            Street address
            <input name="street" required value={form.street} onChange={handleChange} />
          </label>
          <label>
            City
            <input name="city" required value={form.city} onChange={handleChange} />
          </label>
          <label>
            Region
            <input name="region" required value={form.region} onChange={handleChange} />
          </label>
          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              required
              placeholder="024xxxxxxx"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          {error && <p className="checkout-error">{error}</p>}

          <button className="btn btn-brick" type="submit" disabled={loading}>
            {loading ? "Redirecting to payment…" : `Pay GH₵${total.toFixed(2)}`}
          </button>
          <p className="checkout-note">
            You'll be redirected to Paystack to pay by card or Mobile Money (MTN, Vodafone,
            AirtelTigo).
          </p>
        </form>

        <div className="checkout-summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="summary-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>GH₵{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>GH₵{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
