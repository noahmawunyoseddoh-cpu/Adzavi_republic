import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { clearCart } = useCart();

  const [status, setStatus] = useState("checking"); // checking | success | failed
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }
    api
      .get(`/payments/verify/${reference}`)
      .then((res) => {
        if (res.data.status === "success") {
          setStatus("success");
          setOrder(res.data.order);
          clearCart();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return (
    <div className="container confirmation-page">
      {status === "checking" && <p>Confirming your payment…</p>}

      {status === "success" && order && (
        <>
          <h1>Payment confirmed 🎉</h1>
          <p>Thank you — your order has been placed.</p>
          <div className="confirmation-details">
            <p>
              <strong>Order reference:</strong> {order.paymentReference}
            </p>
            <p>
              <strong>Total:</strong> GH₵{order.totalAmount.toFixed(2)}
            </p>
          </div>
          <Link to="/shop" className="btn btn-brick">
            Continue shopping
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <h1>Payment not confirmed</h1>
          <p>We couldn't verify this payment. If money left your account, contact us on WhatsApp.</p>
          <Link to="/cart" className="btn btn-outline">
            Back to cart
          </Link>
        </>
      )}
    </div>
  );
}
