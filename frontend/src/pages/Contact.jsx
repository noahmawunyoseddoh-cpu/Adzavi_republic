import { FiInstagram, FiFacebook, FiMapPin } from "react-icons/fi";
import { FaWhatsapp, FaTiktok } from "react-icons/fa6";
import "./Contact.css";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "233240000000";
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com";
const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || "https://facebook.com";
const TIKTOK_URL = import.meta.env.VITE_TIKTOK_URL || "https://tiktok.com";

export default function Contact() {
  return (
    <div className="container contact-page">
      <h1>Get in touch</h1>
      <p className="contact-sub">
        Questions about sizing, an order, or a custom request? Reach the shop directly —
        we usually reply within the hour on WhatsApp.
      </p>

      <div className="contact-cards">
        <a
          className="contact-card"
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question.")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={26} />
          <span className="contact-card-title">WhatsApp</span>
          <span className="contact-card-desc">Fastest way to reach us</span>
        </a>

        <a className="contact-card" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <FiInstagram size={26} />
          <span className="contact-card-title">Instagram</span>
          <span className="contact-card-desc">New drops posted first here</span>
        </a>

        <a className="contact-card" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
          <FiFacebook size={26} />
          <span className="contact-card-title">Facebook</span>
          <span className="contact-card-desc">Follow for updates & offers</span>
        </a>

        <a className="contact-card" href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
          <FaTiktok size={24} />
          <span className="contact-card-title">TikTok</span>
          <span className="contact-card-desc">Behind the scenes & styling</span>
        </a>
      </div>

      <div className="contact-location">
        <FiMapPin size={18} />
        <span>Accra, Ghana — delivery available nationwide</span>
      </div>
    </div>
  );
}
