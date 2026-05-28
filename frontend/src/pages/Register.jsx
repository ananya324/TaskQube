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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-heading text-2xl font-bold text-primary">TaskQube</span>
          <p className="text-muted text-sm mt-1">Collaborative workspace for modern teams</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-muted text-sm mb-7">Start collaborating with your team today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Alex Johnson"
                className="w-full bg-background border border-border text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className="w-full bg-background border border-border text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition"
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border text-gray-900 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-heading font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Get started →"}
            </button>
          </form>
        </div>

        <p className="text-muted text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;