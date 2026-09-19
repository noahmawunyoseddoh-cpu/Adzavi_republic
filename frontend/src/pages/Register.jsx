import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./AuthForm.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/account");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <label>
          Full name
          <input name="name" required value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input name="email" type="email" required value={form.email} onChange={handleChange} />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn btn-brick" type="submit">
          Create account
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
