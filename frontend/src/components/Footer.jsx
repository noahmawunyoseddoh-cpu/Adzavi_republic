import { FiInstagram, FiFacebook } from "react-icons/fi";
import { FaWhatsapp, FaTiktok } from "react-icons/fa6";
import "./Footer.css";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "23355928314";
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/adzavi_republic?stkn=ZDdnems5MnNqa2t2&utm_source=qr";
const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || "https://facebook.com";
const TIKTOK_URL = import.meta.env.VITE_TIKTOK_URL || "https://www.tiktok.com/@adzavi_republic?_r=1&_t=ZS-99oBeunRNfI";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          
          <h3 className="footer-mark">ADZAVI REPUBLIC</h3>
          <p className="footer-tag">Everyday clothing, made for you. Aflao, Ghana.</p>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Shop</span>
          <a href="/shop">All products</a>
          <a href="/shop?category=Women">Women</a>
          <a href="/shop?category=Men">Men</a>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Reach the shop</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi! I have a question about an item."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={18} /> WhatsApp us
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <FiInstagram size={18} /> Instagram
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
            <FiFacebook size={18} /> Facebook
          </a>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
            <FaTiktok size={16} /> TikTok
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} Adzavi Republic. All rights reserved.</span>
      </div>

      {/* Floating WhatsApp button — visible on every page */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hi! I'd like to ask about an item."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>
    </footer>
  );
}
