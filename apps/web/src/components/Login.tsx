import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin, getLoading, getError } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(getLoading);
  const error = useSelector(getError);
  const success = useSelector((state: RootState) => state.auth.success);

  useEffect(() => {
    if (success) navigate("/dashboard");
  }, [success, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(userLogin(form));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={!!loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100svh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "var(--bg)",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "40px 36px",
    boxShadow: "var(--shadow)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  iconWrap: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "var(--accent-bg)",
    border: "1px solid var(--accent-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 600,
    color: "var(--text-h)",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    margin: "0 0 16px",
    fontSize: "14px",
    color: "var(--text)",
  },
  error: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#ef4444",
    fontSize: "13px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "8px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-h)",
    textAlign: "left",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-h)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  btn: {
    marginTop: "4px",
    padding: "11px",
    borderRadius: "8px",
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  footer: {
    marginTop: "8px",
    fontSize: "13px",
    color: "var(--text)",
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default Login;
