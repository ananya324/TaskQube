import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f0fdfa",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
        .auth-input {
          width: 100%; background: #fff; border: 1px solid #d1fae5;
          color: #0f3d38; border-radius: 8px; padding: 10px 14px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
        }
        .auth-input::placeholder { color: #9ca3af; }
        .auth-btn {
          width: 100%; background: #0d9488; color: #f0fdfa;
          border: none; border-radius: 8px; padding: 11px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, transform 0.12s;
        }
        .auth-btn:hover { background: #0f766e; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .auth-link { color: #0d9488; font-weight: 500; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontFamily: "'DM Mono', monospace", fontWeight: 500,
            fontSize: 18, color: "#0f3d38", marginBottom: 6
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0d9488" }} />
            TaskQube
          </div>
          <p style={{ fontSize: 13, color: "#2d8a81", margin: 0 }}>
            Your team's workspace
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", border: "1px solid #d1fae5",
          borderRadius: 16, padding: 32,
          boxShadow: "0 2px 16px rgba(13,148,136,0.07)"
        }}>
          <h1 style={{
            fontSize: 22, fontWeight: 500, color: "#0f3d38",
            letterSpacing: "-0.5px", margin: "0 0 4px"
          }}>Create account</h1>
          <p style={{ fontSize: 13, color: "#2d8a81", margin: "0 0 28px" }}>
            Start collaborating with your team today.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#1e6962", display: "block", marginBottom: 6 }}>
                Full name
              </label>
              <input
                type="text" name="name"
                value={formData.name} onChange={handleChange}
                required placeholder="Alex Johnson"
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#1e6962", display: "block", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" name="email"
                value={formData.email} onChange={handleChange}
                required placeholder="you@example.com"
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#1e6962", display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" name="password"
                value={formData.password} onChange={handleChange}
                required placeholder="••••••••"
                className="auth-input"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop: 4 }}>
              {loading ? "Creating account..." : "Get started →"}
            </button>
          </form>
        </div>

        <p style={{ fontSize: 13, color: "#2d8a81", textAlign: "center", marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;