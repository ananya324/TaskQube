/**
 * Home.jsx
 * Clean narrative flow:
 *   Nav → Hero → ShowcaseSection → CTA → Footer
 * Bento and standalone "How it works" removed — no more feature repetition.
 */

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import HeroSection from "../components/hero/HeroSection";
import ShowcaseSection from "../components/showcaseSection/ShowcaseSection";
import "../style/home.css";

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const fn = () => setMenuOpen(false);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [menuOpen]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0fdfa",
      fontFamily: "'DM Sans', sans-serif",
      color: "#0f3d38",
      overflowX: "hidden",
    }}>

      {/* NAV */}
      <nav className={`nav${scrolled ? " solid" : ""}`}>
        <span className="nav-logo">
          <span className="logo-dot" />TaskQube
        </span>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
          <button className="btn-nav-cta" onClick={() => navigate("/register")}>Get started</button>
        </div>
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="bar" /><span className="bar" /><span className="bar" />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="mobile-menu-inner">
          <button className="mobile-nav-item" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Sign in</button>
          <button className="mobile-nav-cta" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Get started →</button>
        </div>
      </div>

      {/* HERO */}
      <HeroSection />

      {/* SHOWCASE — workflow narrative with real screenshots */}
      <ShowcaseSection />

      {/* CTA BAND */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-h2">
            Ready to stop<br /><em>switching tabs?</em>
          </h2>
          <p className="cta-sub">
            Create your first workspace in under a minute.<br />No credit card, no demo call.
          </p>
          <button className="cta-btn" onClick={() => navigate("/register")}>
            Get started free <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-logo"><span className="footer-logo-dot" />TaskQube</span>
        <span className="footer-copy">© 2026 · built for teams who ship</span>
      </footer>

    </div>
  );
};

export default Home;