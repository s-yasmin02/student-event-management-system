import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      // Redirect based on role
      navigate(data.user.role === "admin" ? "/admin" : "/events");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "30px"
  },
  card: {
    width: "440px",
    maxWidth: "95%",
    padding: "36px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
    color: "white"
  },
  header: { textAlign: "center", marginBottom: "28px" },
  title: { fontSize: "2rem", margin: 0 },
  subtitle: { color: "#94a3b8", marginTop: "6px" },
  errorBox: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#f87171",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "0.9rem"
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontSize: "0.9rem", fontWeight: "600", color: "#e2e8f0" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "white",
    outline: "none",
    fontSize: "1rem"
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 0.2s"
  },
  footer: { textAlign: "center", marginTop: "20px", color: "#94a3b8", fontSize: "0.9rem" },
  link: { color: "#a78bfa", textDecoration: "none", fontWeight: "600" }
};
