import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="pcard">
      <div className="pcard-image">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="pcard-info">
        <span className="pcard-name">{product.name}</span>
        <span className="pcard-price">GH₵{product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
