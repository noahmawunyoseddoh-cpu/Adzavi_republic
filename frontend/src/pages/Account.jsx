import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Account.css";

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/orders/mine")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container account-page">
      <div className="account-header">
        <div>
          <h1>Hi, {user.name.split(" ")[0]}</h1>
          <p className="account-email">{user.email}</p>
        </div>
        <button className="btn btn-outline" onClick={logout}>
          Log out
        </button>
      </div>

      <h2 className="account-subheading">Order history</h2>

      {loading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-row">
              <div>
                <span className="order-ref">{order.paymentReference}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className={`order-status status-${order.paymentStatus}`}>
                {order.paymentStatus}
              </span>
              <span className="order-total">GH₵{order.totalAmount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
