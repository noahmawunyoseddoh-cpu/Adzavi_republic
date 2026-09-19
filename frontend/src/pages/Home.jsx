import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import "./Home.css";

const badgeFor = (product, index) => {
  if (product.featured) return "Limited edition";
  return index % 2 === 0 ? "New arrival" : "In stock";
};

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.slice(0, 4)));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-images">
          <img
            src="/images/pic1.jpeg"
            alt="Model wearing an exclusive Adzavi Republic piece"
          />
          <img
            src="/images/pic2.jpeg"
            alt="Model wearing a cream Adzavi Republic hoodie"
          />
        </div>
        <div className="hero-overlay">
          <h1 className="hero-title">
            Cut Loud.
            <br />
            Worn Proud.
          </h1>
          <p className="hero-sub">Streetwear built in Aflao, for people who don't blend in.</p>
          <Link to="/shop" className="btn hero-btn">
            Shop now
          </Link>
        </div>
      </section>

      <section className="container statement">
        <h2>Made for the Movement</h2>
        <p>
          Every piece is cut and finished in Aflao, built to survive a full day of real
          movement  markets, matatus, dance floors. This is clothing for people building
          something, not standing still for a photo.
        </p>
      </section>

      <section className="container product-strip">
        <div className="product-grid">
          {products.map((p, i) => (
            <Link to={`/product/${p._id}`} key={p._id} className="strip-card">
              <div className="strip-image">
                <img src={p.images[0]} alt={p.name} loading="lazy" />
              </div>
              <span className="strip-badge">{badgeFor(p, i)}</span>
              <span className="strip-name">{p.name}</span>
              <span className="strip-price">GH₵{p.price.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container tag-strip">
        {["Limited edition", "New arrival", "Handmade trim", "Nationwide delivery", "Pay by Mobile Money"].map(
          (tag) => (
            <span key={tag}>{tag}</span>
          )
        )}
      </section>

      <section className="mission">
        <div className="container mission-row">
          <div className="mission-copy">
            <h2>Our craft</h2>
            <p>
              Every trim, print, and stitch is sourced or made within Aflao. We work with
              local tailors and fabric printers rather than overseas factories, which
              means smaller batches and pieces that don't show up on everyone else.
            </p>
            <Link to="/contact" className="btn btn-outline">
              Meet the makers
            </Link>
          </div>
          <div className="mission-image">
            <img
              src="/images/pic3.jpeg"
              alt="Fabric printing detail"
            />
          </div>
        </div>

        <div className="container mission-row mission-row-reverse">
          <div className="mission-image">
            <img
              src="/images/pic4.jpeg"
              alt="Two friends wearing Adzavi Republic pieces"
            />
          </div>
          <div className="mission-copy">
            <h2>Who it's for</h2>
            <p>
              Adzavi Republic is for the ones who show up early to the market for first
              pick, who remix a thrifted find into something no one's seen, who'd rather
              stand out on a Tuesday than blend in on a Saturday.
            </p>
            <Link to="/shop" className="btn btn-outline">
              Browse the shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
