/**
 * HeroSection.jsx
 * Two-column layout: left = copy, right = FeatureGlass card.
 * No parallax, no floating cards, no custom cursor.
 * Clean, focused, premium.
 */

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FeatureGlass from "./FeatureGlass";
import "./hero.css";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="ph-hero">
      {/* Dot grid texture */}
      <div className="ph-grid" />

      <div className="ph-inner">
        {/* ── LEFT — copy ── */}
        <div className="ph-left">
          <div className="ph-eyebrow">
            <span className="ph-ep" />
            Open beta — free to use
          </div>

          <h1 className="ph-h1">
            Every<strong>thing</strong><br />
            your team<br />
            <em>needs.</em>
          </h1>

          <p className="ph-sub">
            Tasks, chat, notes &amp; meetings.<br />
            One workspace. Zero tab&#8209;switching.
          </p>

          <div className="ph-ctas">
            <button className="ph-cta-main" onClick={() => navigate("/register")}>
              Start free <ArrowRight size={13} />
            </button>
            <button className="ph-cta-sec" onClick={() => navigate("/login")}>
              Sign in to your team
            </button>
          </div>

          <div className="ph-stat-strip">
            <div className="ph-stat">
              <span className="ph-stat-num">6</span>
              <span className="ph-stat-lbl">Features</span>
            </div>
            <div className="ph-stat-div" />
            <div className="ph-stat">
              <span className="ph-stat-num">1</span>
              <span className="ph-stat-lbl">Workspace</span>
            </div>
            <div className="ph-stat-div" />
            <div className="ph-stat">
              <span className="ph-stat-num">0</span>
              <span className="ph-stat-lbl">Extra tools</span>
            </div>
          </div>

          <p className="ph-note">No credit card required · setup in 60 seconds</p>
        </div>

        {/* ── RIGHT — glass feature card ── */}
        <div className="ph-right">
          <FeatureGlass />
        </div>
      </div>
    </section>
  );
}