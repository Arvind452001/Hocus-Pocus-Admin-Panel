"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/Api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("password", formData.password);

      let res = await loginApi(form);
      console.log("login res", res.data);

      // ✅ actual backend se token lo
      const token = res?.data?.token || res?.data?.access_token;
      const user = res?.data?.user || {};

      // fallback (testing ke liye)
      if (!token) {
        localStorage.setItem("token", "dummy-token-123");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            role: "admin",
          }),
        );
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR FULL:", err.response?.data); // 👈 MOST IMPORTANT

      // 👇 backend ka actual message show karo
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f5f5, #eaeaea)",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "18px",
          padding: "8px",
        }}
      >
        <div
          className="card-body"
          style={{
            padding: "32px 28px",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/assets/images/logo.png"
              alt="logo"
              style={{ width: "150px" }}
            />
          </div>

          <h4
            className="text-center mb-4"
            style={{ fontWeight: 600, color: "#333" }}
          >
            Admin Login
          </h4>

          {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  padding: "10px 12px",
                }}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  padding: "10px 12px",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#651d32",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
