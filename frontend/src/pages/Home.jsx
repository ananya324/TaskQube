import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import ShowcaseSection from "../components/showcaseSection/ShowcaseSection";
import "../style/home.css";


/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const STEPS = [
  { step: "01", title: "Create a workspace", desc: "Spin one up in under a minute. Name it, done." },
  { step: "02", title: "Invite your team", desc: "Share a room code. No email chains, no pending invites." },
  { step: "03", title: "Ship, together", desc: "Assign tasks, chat, take notes, jump on a call — all in one tab." },
];

const TASKS = [
  { done: true, text: "Finalize Q2 roadmap", tag: "Done", tagColor: "" },
  { done: false, text: "Review onboarding flow with design", tag: "Today", tagColor: "amber" },
  { done: false, text: "Ship API rate-limit fix", tag: "Tomorrow", tagColor: "" },
  { done: false, text: "Write release notes for v2.4", tag: "This week", tagColor: "" },
];

const AVATARS = [
  { initials: "JK", bg: "#dbeafe", fg: "#1d4ed8" },
  { initials: "MR", bg: "#fce7f3", fg: "#be185d" },
  { initials: "AT", bg: "#dcfce7", fg: "#15803d" },
  { initials: "SL", bg: "#fef9c3", fg: "#a16207" },
];

const HERO_SLIDES = [
  { src: "/screenshots/Screenshot 2026-05-31 173858.png", label: "taskqube.app / workspace — kanban", caption: "Kanban board" },
  { src: "/screenshots/Screenshot 2026-05-31 174449.png", label: "taskqube.app / workspace — chat", caption: "Team chat" },
  { src: "/screenshots/Screenshot 2026-05-31 174221.png", label: "taskqube.app / workspace — notes", caption: "Shared notes" },
  { src: "/screenshots/Screenshot 2026-05-31 174544.png", label: "taskqube.app / workspace — meet", caption: "Meetings" },
  { src: "/screenshots/Screenshot 2026-05-31 173925.png", label: "taskqube.app / workspace — activity", caption: "Activity feed" },
];

const SLIDE_INTERVAL = 3000;

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useReveal(threshold = 0.1) {
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

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   HERO MOCKUP
───────────────────────────────────────── */
function HeroMockup() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => { setCurrent(p => (p + 1) % HERO_SLIDES.length); setFading(false); }, 350);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <div className="hero-mockup">
      <div className="hero-mockup-bar">
        <div className="mockup-dot" style={{ background: "#ff5f57" }} />
        <div className="mockup-dot" style={{ background: "#febc2e" }} />
        <div className="mockup-dot" style={{ background: "#28c840" }} />
        <span style={{ fontSize: 11, color: "#2d8a81", marginLeft: 6, fontFamily: "'DM Mono', monospace", transition: "opacity 0.3s", opacity: fading ? 0 : 1 }}>
          {slide.label}
        </span>
      </div>
      <div style={{ position: "relative", lineHeight: 0 }}>
        <img
          key={current}
          src={slide.src}
          alt={slide.caption}
          style={{
            width: "100%", display: "block",
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(6px) scale(0.99)" : "translateY(0) scale(1)",
            transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 0 12px", background: "#f0fdfa", borderTop: "1px solid #d1fae5" }}>
        {HERO_SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 350); }}
            aria-label={s.caption}
            style={{
              border: "none", cursor: "pointer", padding: 0,
              width: current === i ? 18 : 6, height: 6, borderRadius: 100,
              background: current === i ? "#0d9488" : "#99f6e4",
              transition: "all 0.22s ease",
            }}
          />
        ))}
        <span style={{ fontSize: 10, color: "#2d8a81", marginLeft: 6, fontFamily: "'DM Mono', monospace", opacity: fading ? 0 : 1, transition: "opacity 0.3s", minWidth: 64 }}>
          {slide.caption}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
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
    <div style={{ minHeight: "100vh", background: "#f0fdfa", fontFamily: "'DM Sans', sans-serif", color: "#0f3d38", overflowX: "hidden" }}>

      

      {/* NAV */}
      <nav className={`nav${scrolled ? " solid" : ""}`}>
        <span className="nav-logo">
          <span className="logo-dot" />
          TaskQube
        </span>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
          <button className="btn-nav-cta" onClick={() => navigate("/register")}>Get started</button>
        </div>
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(p => !p)}
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
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Open beta — free to use
          </div>
          <h1>
            Everything your team needs.
            <br />
            <em>One workspace.</em>
          </h1>
          <p className="hero-sub">
            Tasks, chat, notes, and meetings together.
            No context-switching. No extra tools
          </p>
          <div className="hero-ctas">
            <button className="cta-main" onClick={() => navigate("/register")}>
              Start free <ArrowRight size={14} />
            </button>
            <button className="cta-sec" onClick={() => navigate("/login")}>
              Sign in to your team
            </button>
          </div>
          <p className="hero-note">No credit card required · setup in 60 seconds</p>
        </div>
        <div className="hero-right">
          <HeroMockup />
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section className="section">
        <div className="section-inner">
          <Reveal><div className="section-kicker">What's inside</div></Reveal>
          <div className="bento">

            <Reveal className="bento-cell" delay={0}>
              <div className="cell-label">Task management</div>
              <div className="cell-title">Kanban board with role-based controls.</div>
              <div className="cell-desc">
                Tasks live in To Do, In Progress, and Completed columns. Admins assign tasks, set priority (High / Medium / Low), and add due dates. Members see their own tasks and teammates' — no assignment controls cluttering the view.
              </div>
              <div className="feature-pills">
                <span className="fpill">Admin assign</span>
                <span className="fpill">Due date alerts</span>
                <span className="fpill">Priority labels</span>
              </div>
            </Reveal>

            <Reveal className="bento-cell" delay={60}>
              <div className="cell-label">Team chat</div>
              <div className="cell-title">Built-in chat, no app switching.</div>
              <div className="cell-desc">
                Every workspace has a chat tab. Messages appear in real-time — no page refresh. A red dot on the tab badge alerts you to unread messages without pulling you away from what you're doing.
              </div>
              <div className="feature-pills">
                <span className="fpill">Real-time</span>
                <span className="fpill">Unread indicator</span>
                <span className="fpill">Timestamped</span>
              </div>
            </Reveal>

            <Reveal className="bento-cell" delay={120}>
              <div className="cell-label">Shared notes</div>
              <div className="cell-title">Team notes everyone can see instantly.</div>
              <div className="cell-desc">
                Any member can create a note — meeting summaries, decisions, reminders. Notes appear as bullet-point cards with the author's name and date, visible to the whole team the moment they're saved.
              </div>
              <div className="feature-pills">
                <span className="fpill">Bullet format</span>
                <span className="fpill">Author + date</span>
                <span className="fpill">Shared instantly</span>
              </div>
            </Reveal>

            <Reveal className="bento-cell" delay={180}>
              <div className="cell-label">Meetings</div>
              <div className="cell-title">One click to a Google Meet call.</div>
              <div className="cell-desc">
                Admins start a room and the link appears in the workspace header. A Share button notifies the team. Live avatar bubbles show exactly who has joined — no "did you get the link?" messages.
              </div>
              <div className="feature-pills">
                <span className="fpill">Google Meet</span>
                <span className="fpill">Live presence</span>
                <span className="fpill">Header link</span>
              </div>
            </Reveal>

            <Reveal className="bento-cell wide dark" delay={240}>
              <div className="cell-label light">Activity feed</div>
              <div className="cell-title inv">Full audit trail of everything that happens.</div>
              <div className="cell-desc inv" style={{ maxWidth: 560 }}>
                Every task assignment, reassignment, and status change is logged in real-time — who did it and when. A bell icon with a red dot alerts you to new activity without interrupting your current flow.
              </div>
              <div className="feature-pills" style={{ marginTop: 20 }}>
                <span className="fpill dark-pill">Live updates</span>
                <span className="fpill dark-pill">Who did what</span>
                <span className="fpill dark-pill">Bell notifications</span>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      <div className="rule" />
      <ShowcaseSection />

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="section-inner">
          <Reveal><div className="section-kicker">How it works</div></Reveal>
          <div className="steps-grid">
            {STEPS.map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 80} className="step-cell">
                <div className="step-num">{step}</div>
                <div className="step-title">{title}</div>
                <div className="step-desc">{desc}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <Reveal className="cta-inner">
          <h2 className="cta-h2">
            Ready to stop<br />
            <em>switching tabs?</em>
          </h2>
          <p className="cta-sub">Create your first workspace in under a minute. No credit card, no demo call.</p>
          <button className="cta-btn" onClick={() => navigate("/register")}>
            Get started free <ArrowRight size={14} />
          </button>
        </Reveal>
      </section>

      <footer className="footer">
        <span className="footer-logo"><span className="footer-logo-dot" />TaskQube</span>
        <span className="footer-copy">© 2026 · built for teams who ship</span>
      </footer>

    </div>
  );
};

export default Home;