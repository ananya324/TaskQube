import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Zap, Users, MessageSquare, FileText,
  CheckCircle, Video, ArrowRight, Sparkles
} from "lucide-react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const FEATURES = [
  { icon: CheckCircle,  title: "Smart Task Management",  desc: "Admins assign tasks with priorities and deadlines. Everyone knows exactly what to do and when." },
  { icon: MessageSquare,title: "Real-time Team Chat",     desc: "Communicate instantly inside every workspace. No more switching between apps mid-flow." },
  { icon: FileText,     title: "Collaborative Notes",    desc: "Shared bullet-point notes for your whole team. Keep goals, decisions, and context in one place." },
  { icon: Video,        title: "One-click Google Meet",  desc: "Start a meeting instantly. Team members get notified and join with a single click." },
  { icon: Users,        title: "Presence Awareness",     desc: "See who's online in real-time. Know who's active in your workspace right now." },
  { icon: Sparkles,     title: "AI-powered Insights",    desc: "Break complex tasks into actionable subtasks with AI. Work smarter, not harder." },
];

const STEPS = [
  { step: "01", title: "Create a Workspace", desc: "Sign up and spin up a workspace for your team or project in under a minute." },
  { step: "02", title: "Invite Your Team",   desc: "Share your unique room code. Teammates join instantly — no email invites required." },
  { step: "03", title: "Assign & Collaborate", desc: "Assign tasks, chat in real-time, take notes, and start meetings — all in one place." },
];

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {}, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* Animated teal grid background */
function GridBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
    }}>
      {/* Grid lines */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.055 }}>
        <defs>
          <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#0d9488" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
        width: 700, height: 500,
        background: "radial-gradient(ellipse, rgba(20,184,166,0.18) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", top: "80%", left: "10%",
        width: 400, height: 400,
        background: "radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdfa", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f172a", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Bricolage+Grotesque:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 48px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.35s, box-shadow 0.35s;
        }
        .nav.solid {
          background: rgba(240,253,250,0.92);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(13,148,136,0.12);
        }
        .nav-logo {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800; font-size: 20px; letter-spacing: -0.5px;
          color: #0d9488;
        }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .btn-ghost {
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #475569; padding: 8px 16px; border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { color: #0d9488; background: rgba(13,148,136,0.07); }
        .btn-primary {
          background: #0d9488; color: #fff;
          border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700;
          padding: 9px 20px; border-radius: 9px;
          box-shadow: 0 2px 12px rgba(13,148,136,0.25);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-primary:hover { background: #0f766e; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(13,148,136,0.35); }

        /* HERO */
        .hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 128px 24px 80px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(13,148,136,0.1); border: 1px solid rgba(13,148,136,0.2);
          color: #0f766e; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 28px;
          animation: drop 0.7s ease both;
        }
        .hero-h1 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(44px, 6.5vw, 76px); font-weight: 800; line-height: 1.06;
          letter-spacing: -2.5px; color: #0f172a; margin-bottom: 22px;
          animation: drop 0.7s 0.08s ease both;
        }
        .hero-h1 em {
          font-style: normal;
          background: linear-gradient(130deg, #0d9488 20%, #06b6d4 80%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-sub {
          font-size: clamp(16px, 2vw, 19px); color: #64748b; max-width: 540px;
          line-height: 1.75; margin-bottom: 40px;
          animation: drop 0.7s 0.16s ease both;
        }
        .hero-ctas {
          display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap;
          animation: drop 0.7s 0.24s ease both;
        }
        .cta-main {
          display: inline-flex; align-items: center; gap: 8px;
          background: #0d9488; color: #fff; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700;
          padding: 14px 28px; border-radius: 12px;
          box-shadow: 0 6px 28px rgba(13,148,136,0.32);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .cta-main:hover { background: #0f766e; transform: translateY(-2px); box-shadow: 0 10px 36px rgba(13,148,136,0.4); }
        .cta-sec {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #334155; border: 1.5px solid #cbd5e1; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 600;
          padding: 14px 26px; border-radius: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cta-sec:hover { border-color: #0d9488; box-shadow: 0 4px 16px rgba(13,148,136,0.1); }
        .hero-note { color: #94a3b8; font-size: 13px; margin-top: 22px; animation: drop 0.7s 0.32s ease both; }

        /* DIVIDER */
        .section-divider {
          height: 1px; background: linear-gradient(90deg, transparent, rgba(13,148,136,0.15), transparent);
          margin: 0 48px;
        }

        /* SECTIONS */
        .section { padding: 96px 24px; }
        .section-inner { max-width: 1080px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .eyebrow {
          display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #0d9488; margin-bottom: 10px;
        }
        .section-h2 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(26px, 3.5vw, 40px); font-weight: 800; letter-spacing: -1px;
          color: #0f172a; margin-bottom: 12px;
        }
        .section-lead { font-size: 16px; color: #64748b; max-width: 440px; margin: 0 auto; line-height: 1.7; }

        /* FEATURES GRID */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .features-grid { grid-template-columns: 1fr; } }

        .feat-card {
          background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 16px; padding: 28px 24px;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          cursor: default;
        }
        .feat-card:hover {
          border-color: #5eead4;
          box-shadow: 0 8px 32px rgba(13,148,136,0.1);
          transform: translateY(-4px);
        }
        .feat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(13,148,136,0.08);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .feat-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px;
        }
        .feat-desc { font-size: 13.5px; color: #64748b; line-height: 1.7; }

        /* STEPS */
        .steps-section { background: #fff; }
        .steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        @media (max-width: 700px) { .steps-grid { grid-template-columns: 1fr; } }

        .step-card {
          border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 32px 24px;
          position: relative; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .step-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #0d9488, #06b6d4);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s ease;
        }
        .step-card:hover::after { transform: scaleX(1); }
        .step-card:hover { border-color: #99f6e4; box-shadow: 0 8px 28px rgba(13,148,136,0.09); transform: translateY(-3px); }
        .step-num {
          font-family: 'Bricolage Grotesque', sans-serif; font-size: 48px; font-weight: 800;
          color: #ccfbf1; line-height: 1; margin-bottom: 16px; user-select: none;
        }
        .step-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
        .step-desc { font-size: 13.5px; color: #64748b; line-height: 1.7; }

        /* CTA SECTION */
        .cta-section {
          background: linear-gradient(135deg, #0f172a 0%, #134e4a 100%);
          padding: 100px 24px; text-align: center; position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(20,184,166,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-h2 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(28px, 4vw, 50px); font-weight: 800; letter-spacing: -1.5px;
          color: #f0fdfa; margin-bottom: 14px; position: relative;
        }
        .cta-sub { color: rgba(240,253,250,0.5); font-size: 16px; margin-bottom: 36px; position: relative; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 9px;
          background: #14b8a6; color: #fff; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700;
          padding: 15px 32px; border-radius: 12px; position: relative;
          box-shadow: 0 6px 30px rgba(20,184,166,0.4);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .cta-btn:hover { background: #0d9488; transform: translateY(-2px); box-shadow: 0 10px 42px rgba(20,184,166,0.5); }

        /* FOOTER */
        .footer {
          background: #0f172a; border-top: 1px solid rgba(255,255,255,0.06);
          padding: 22px 48px; display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .footer-logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 17px; color: #14b8a6; }
        .footer-copy { color: rgba(255,255,255,0.25); font-size: 13px; }

        /* pulse dot */
        .dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #0d9488; margin-right: 7px; position: relative; }
        .dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: rgba(13,148,136,0.3); animation: ping 1.8s ease-out infinite; }
        @keyframes ping { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }

        @keyframes drop { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " solid" : ""}`}>
        <span className="nav-logo">TaskQube</span>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>Get started free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <GridBg />
        <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="hero-badge">
            <span className="dot" />
            Real-time collaboration for modern teams
          </div>
          <h1 className="hero-h1">
            Your team's workspace,<br />
            <em>supercharged.</em>
          </h1>
          <p className="hero-sub">
            TaskQube brings tasks, chat, notes, and meetings into one powerful workspace.
            Built for teams who want to move fast without the chaos.
          </p>
          <div className="hero-ctas">
            <button className="cta-main" onClick={() => navigate("/register")}>
              Start for free <ArrowRight size={16} />
            </button>
            <button className="cta-sec" onClick={() => navigate("/login")}>
              Sign in to your team
            </button>
          </div>
          <p className="hero-note">No credit card required · Free to use · Setup in 60 seconds</p>
        </div>
      </section>

      {/* FEATURES */}
      <div className="section-divider" />
      <section className="section">
        <div className="section-inner">
          <Reveal>
            <div className="section-header">
              <span className="eyebrow">Features</span>
              <h2 className="section-h2">Everything your team needs</h2>
              <p className="section-lead">Stop juggling between tools. TaskQube has everything built in.</p>
            </div>
          </Reveal>

          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="feat-card">
                  <div className="feat-icon">
                    <Icon size={20} color="#0d9488" strokeWidth={1.75} />
                  </div>
                  <div className="feat-title">{title}</div>
                  <div className="feat-desc">{desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="section-divider" />
      <section className="section steps-section">
        <div className="section-inner">
          <Reveal>
            <div className="section-header">
              <span className="eyebrow">How it works</span>
              <h2 className="section-h2">Up and running in minutes</h2>
              <p className="section-lead">No onboarding calls. No setup headaches. Just create and collaborate.</p>
            </div>
          </Reveal>

          <div className="steps-grid">
            {STEPS.map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 100}>
                <div className="step-card">
                  <div className="step-num">{step}</div>
                  <div className="step-title">{title}</div>
                  <div className="step-desc">{desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <Reveal>
          <h2 className="cta-h2">Ready to build something great?</h2>
          <p className="cta-sub">Create your first workspace in seconds. Your team will thank you.</p>
          <button className="cta-btn" onClick={() => navigate("/register")}>
            Get started for free <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-logo">TaskQube</span>
        <span className="footer-copy">© 2026 · Built for teams who move fast</span>
      </footer>
    </div>
  );
};

export default Home;
