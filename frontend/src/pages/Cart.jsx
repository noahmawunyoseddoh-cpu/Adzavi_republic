import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Cart.css";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Your cart is empty</h1>
        <Link to="/shop" className="btn btn-brick">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your cart</h1>

      <div className="cart-list">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-meta">
                {item.size && `Size ${item.size}`} {item.color && `· ${item.color}`}
              </span>
              <div className="cart-item-qty">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
            <span className="cart-item-price">GH₵{(item.price * item.quantity).toFixed(2)}</span>
            <button
              className="cart-item-remove"
              onClick={() => removeItem(item.productId, item.size, item.color)}
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total-row">
          <span>Subtotal</span>
          <span>GH₵{total.toFixed(2)}</span>
        </div>
        <p className="cart-note">Shipping calculated at checkout.</p>
        <button className="btn btn-brick cart-checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}
