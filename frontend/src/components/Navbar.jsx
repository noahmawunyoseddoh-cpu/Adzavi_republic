import { Link } from "react-router-dom";
import { FiShoppingBag, FiUser } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { count } = useCart();
  const { user } = useAuth();

  return (
    <>
      <div className="announce-bar">
        Made in Aflao nationwide delivery, pay by card or Mobile Money
      </div>
      <header className="nav">
        <div className="container nav-inner">
          <nav className="nav-links">
            <Link to="/shop">Shop</Link>
            <Link to="/shop?category=Women">Women</Link>
            <Link to="/shop?category=Men">Men</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <Link to="/" className="nav-mark">
            Adzavi Republic
          </Link>

          <div className="nav-actions">
            <Link to={user ? "/account" : "/login"} aria-label="Account">
              <FiUser size={19} />
            </Link>
            <Link to="/cart" className="nav-cart" aria-label="Cart">
              <FiShoppingBag size={19} />
              {count > 0 && <span className="nav-cart-count">{count}</span>}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
