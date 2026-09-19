import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";
import "./Shop.css";

const CATEGORIES = ["All", "Women", "Men", "Kids", "Accessories"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get("category") || "All";

  useEffect(() => {
    setLoading(true);
    const params = category !== "All" ? { category } : {};
    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="container shop-page">
      <div className="shop-header">
        <h1>Shop all</h1>
        <div className="shop-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={c === category ? "filter-btn active" : "filter-btn"}
              onClick={() => setSearchParams(c === "All" ? {} : { category: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products found in this category yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
