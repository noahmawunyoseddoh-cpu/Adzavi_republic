import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      setSize(res.data.sizes?.[0] || "");
      setColor(res.data.colors?.[0] || "");
    });
  }, [id]);

  if (!product) return <div className="container">Loading…</div>;

  const handleAdd = () => {
    addItem(product, size, color, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="container product-page">
      <div className="product-image">
        <img src alt={product.name} />
      </div>

      <div className="product-details">
        <h1>{product.name}</h1>
        <p className="product-price">GH₵{product.price.toFixed(2)}</p>
        <p className="product-desc">{product.description}</p>

        {product.sizes?.length > 0 && (
          <div className="option-group">
            <span className="option-label">Size</span>
            <div className="option-row">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={s === size ? "option-btn active" : "option-btn"}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="option-group">
            <span className="option-label">Color</span>
            <div className="option-row">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={c === color ? "option-btn active" : "option-btn"}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="product-stock">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="product-actions">
          <button className="btn btn-brick" onClick={handleAdd} disabled={product.stock === 0}>
            {added ? "Added to cart ✓" : "Add to cart"}
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/cart")}>
            Go to cart
          </button>
        </div>
      </div>
    </div>
  );
}
