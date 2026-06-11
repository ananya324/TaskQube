import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
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
   FLOATING COMPONENT CARDS
───────────────────────────────────────── */

function TaskCardMini({ title, rows, badge, badgeColor, priority, priorityColor, priorityBg, avatarColor, avatarLetter }) {
  return (
    <div className="ph-card ph-task">
      <div className="ph-tc-head">
        <span className="ph-tc-lbl">{title}</span>
        <span className="ph-tc-badge" style={{ background: badgeColor === "amber" ? "#fffbeb" : "#f0fdf4", color: badgeColor === "amber" ? "#b45309" : "#059669" }}>{badge}</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="ph-tc-row">
          <div className={`ph-tc-chk${r.done ? " done" : ""}`}>{r.done ? "✓" : ""}</div>
          <div className={`ph-tc-txt${r.done ? " done" : ""}`}>{r.text}</div>
        </div>
      ))}
      <div className="ph-tc-foot">
        <span className="ph-tc-pri" style={{ background: priorityBg, color: priorityColor }}>{priority}</span>
        <div className="ph-tc-av" style={{ background: avatarColor }}>{avatarLetter}</div>
      </div>
    </div>
  );
}

function ChatCardMini() {
  return (
    <div className="ph-card ph-chat">
      <div className="ph-cc-hdr">Team Chat</div>
      <div className="ph-cb">
        <div className="ph-cb-av" style={{ background: "#0891b2" }}>J</div>
        <div><div className="ph-bub ot">Just pushed the fix 🚀</div><div className="ph-cb-t">2:14 PM</div></div>
      </div>
      <div className="ph-cb own">
        <div className="ph-cb-av" style={{ background: "#059669" }}>A</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div className="ph-bub me">Nice, merging now</div>
          <div className="ph-cb-t">2:15 PM</div>
        </div>
      </div>
      <div className="ph-cb">
        <div className="ph-cb-av" style={{ background: "#be185d" }}>M</div>
        <div><div className="ph-bub ot">Looks good ✓</div><div className="ph-cb-t">2:16 PM</div></div>
      </div>
    </div>
  );
}

function NoteCardMini() {
  return (
    <div className="ph-card ph-note">
      <div className="ph-nc-head">
        <div className="ph-nc-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
          </svg>
        </div>
        <span className="ph-nc-title">Sprint Planning</span>
      </div>
      {["Define Q3 goals and OKRs", "Review team capacity", "Ship rate-limit fix first"].map((b, i) => (
        <div key={i} className="ph-nc-row">
          <div className="ph-nc-dot" />
          <div className="ph-nc-txt">{b}</div>
        </div>
      ))}
      <div className="ph-nc-foot">
        <span className="ph-nc-meta">Mia R.</span>
        <span className="ph-nc-meta">Jun 3</span>
      </div>
    </div>
  );
}

function OnlineCardMini() {
  const avatars = [
    { letter: "J", bg: "#0d9488" },
    { letter: "M", bg: "#be185d" },
    { letter: "A", bg: "#059669" },
    { letter: "S", bg: "#d97706" },
  ];
  return (
    <div className="ph-card ph-online">
      <div className="ph-ou-top">
        <span className="ph-ou-lbl">Online now</span>
        <span className="ph-ou-count"><span className="ph-ou-pulse" />4 active</span>
      </div>
      <div className="ph-ou-avatars">
        {avatars.map((a, i) => (
          <div key={i} className="ph-ou-av" style={{ background: a.bg }}>{a.letter}</div>
        ))}
        <div className="ph-ou-more">+2</div>
      </div>
    </div>
  );
}

function WorkspaceCardMini() {
  return (
    <div className="ph-card ph-ws">
      <div className="ph-wc-top">
        <div className="ph-wc-init" style={{ background: "#0d9488" }}>D</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </div>
      <div className="ph-wc-name">Design Team</div>
      <div className="ph-wc-desc">UI, branding and product design workspace.</div>
      <div className="ph-wc-foot">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
        <span className="ph-wc-mem">5 members</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PARALLAX HERO
───────────────────────────────────────── */
const FLOATER_CONFIG = [
  { id: "f0", pos: "top-center", depth: 0.04, anim: "phFloatA 5.2s ease-in-out infinite" },
  { id: "f1", pos: "top-left", depth: 0.055, anim: "phFloatB 6s ease-in-out infinite 0.7s" },
  { id: "f2", pos: "top-right", depth: 0.045, anim: "phFloatC 4.6s ease-in-out infinite 0.4s" },
  { id: "f3", pos: "bottom-left", depth: 0.05, anim: "phFloatD 5.4s ease-in-out infinite 1s" },
  { id: "f4", pos: "bottom-right", depth: 0.035, anim: "phFloatE 5.8s ease-in-out infinite 1.3s" },
];

function ParallaxHero() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const cursorRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const rawPos = useRef({ x: 0, y: 0 });
  const offsets = useRef(FLOATER_CONFIG.map(() => ({ x: 0, y: 0 })));
  const curLerp = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      rawPos.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      mouse.current = { x: rawPos.current.x - r.width / 2, y: rawPos.current.y - r.height / 2 };
    };
    const onLeave = () => { mouse.current = { x: 0, y: 0 }; };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => { hero.removeEventListener("mousemove", onMove); hero.removeEventListener("mouseleave", onLeave); };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      const W = hero.offsetWidth;
      const H = hero.offsetHeight;
      const maxDist = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2);

      curLerp.current.x = lerp(curLerp.current.x, rawPos.current.x, 0.14);
      curLerp.current.y = lerp(curLerp.current.y, rawPos.current.y, 0.14);
      if (cursorRef.current) {
        cursorRef.current.style.left = `${curLerp.current.x}px`;
        cursorRef.current.style.top = `${curLerp.current.y}px`;
      }

      FLOATER_CONFIG.forEach((cfg, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        offsets.current[i].x = lerp(offsets.current[i].x, -mouse.current.x * cfg.depth, 0.065);
        offsets.current[i].y = lerp(offsets.current[i].y, -mouse.current.y * cfg.depth, 0.065);
        const scale = 0.92 + norm * 0.08;

        el.style.transform =
          `translate(${offsets.current[i].x}px, ${offsets.current[i].y}px)
   scale(${scale})`;

        // blur based on distance from center
        const rect = el.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        const ecx = rect.left - heroRect.left + rect.width / 2;
        const ecy = rect.top - heroRect.top + rect.height / 2;
        const dist = Math.sqrt((ecx - W / 2) ** 2 + (ecy - H / 2) ** 2);
        const norm = dist / maxDist;
        const blur = norm * 0.8;
        const opacity = 0.55 + norm * 0.45;
        el.style.filter = `blur(${blur.toFixed(2)}px)`;
        el.style.opacity = opacity.toFixed(2);
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const posStyle = (cfg) => {
    const base = { position: "absolute", pointerEvents: "auto", willChange: "transform", zIndex: 8 };
    switch (cfg.pos) {
      case "top-center":
        return { ...base, top: 40, left: "50%", transform: "translateX(-50%)" };

      case "top-left":
        return { ...base, top: 90, left: 120 };

      case "top-right":
        return { ...base, top: 90, right: 120 };

      case "bottom-left":
        return { ...base, bottom: 70, left: 120 };

      case "bottom-right":
        return { ...base, bottom: 70, right: 120 };
      default: return base;
    }
  };

  const cards = [
    <OnlineCardMini />,          // f0 → top-center crown
    <ChatCardMini />,            // f1 → top-left
    <TaskCardMini                // f2 → top-right
      title="In Progress" badge="Today" badgeColor="amber"
      rows={[{ text: "Finalize Q2 roadmap", done: true }, { text: "Review onboarding flow", done: false }]}
      priority="Low" priorityColor="#059669" priorityBg="#ecfdf5"
      avatarColor="#0d9488" avatarLetter="J"
    />,
    <NoteCardMini />,            // f3 → bottom-left
    <TaskCardMini                // f4 → bottom-right
      title="To Do" badge="This week" badgeColor="green"
      rows={[{ text: "Write release notes v2.4", done: false }, { text: "Update onboarding docs", done: false }]}
      priority="High" priorityColor="#e11d48" priorityBg="#fff1f2"
      avatarColor="#7c3aed" avatarLetter="S"
    />,
  ];

  return (
    <section className="ph-hero" ref={heroRef}>
      <div className="ph-cursor" ref={cursorRef} />

      {FLOATER_CONFIG.map((cfg, i) => (
        <div key={cfg.id} ref={el => cardRefs.current[i] = el} style={{ ...posStyle(cfg), animation: cfg.anim }}>
          {cards[i]}
        </div>
      ))}

      <div className="ph-center">
        <div className="ph-eyebrow">
          <span className="ph-el" />
          <span className="ph-ep" />
          Open beta — free to use
          <span className="ph-el" />
        </div>
        <h1 className="ph-h1">
          Every<strong>thing</strong><br />
          your team<br />
          <em>needs.</em>
        </h1>
        <p className="ph-sub">Tasks, chat, notes &amp; meetings.<br />One workspace. Zero tab&#8209;switching.</p>
        <div className="ph-ctas">
          <button className="cta-main" onClick={() => navigate("/register")}>
            Start free <ArrowRight size={14} />
          </button>
          <button className="cta-sec" onClick={() => navigate("/login")}>
            Sign in to your team
          </button>
        </div>
        <div className="ph-stat-strip">
          <div className="ph-stat"><span className="ph-stat-num">4</span><span className="ph-stat-lbl">Features</span></div>
          <div className="ph-stat-div" />
          <div className="ph-stat"><span className="ph-stat-num">1</span><span className="ph-stat-lbl">Workspace</span></div>
          <div className="ph-stat-div" />
          <div className="ph-stat"><span className="ph-stat-num">0</span><span className="ph-stat-lbl">Extra tools</span></div>
        </div>
        <p className="hero-note" style={{ textAlign: "center" }}>No credit card required · setup in 60 seconds</p>
      </div>
    </section>
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
        <span className="nav-logo"><span className="logo-dot" />TaskQube</span>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
          <button className="btn-nav-cta" onClick={() => navigate("/register")}>Get started</button>
        </div>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span className="bar" /><span className="bar" /><span className="bar" />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="mobile-menu-inner">
          <button className="mobile-nav-item" onClick={() => { navigate("/login"); setMenuOpen(false); }}>Sign in</button>
          <button className="mobile-nav-cta" onClick={() => { navigate("/register"); setMenuOpen(false); }}>Get started →</button>
        </div>
      </div>

      {/* PARALLAX HERO */}
      <ParallaxHero />

      {/* FEATURES BENTO */}
      <section className="section">
        <div className="section-inner">
          <Reveal><div className="section-kicker">What's inside</div></Reveal>
          <div className="bento">
            <Reveal className="bento-cell" delay={0}>
              <div className="cell-label">Task management</div>
              <div className="cell-title">Kanban board with role-based controls.</div>
              <div className="cell-desc">Tasks live in To Do, In Progress, and Completed columns. Admins assign tasks, set priority (High / Medium / Low), and add due dates.</div>
              <div className="feature-pills"><span className="fpill">Admin assign</span><span className="fpill">Due date alerts</span><span className="fpill">Priority labels</span></div>
            </Reveal>
            <Reveal className="bento-cell" delay={60}>
              <div className="cell-label">Team chat</div>
              <div className="cell-title">Built-in chat, no app switching.</div>
              <div className="cell-desc">Every workspace has a chat tab. Messages appear in real-time — no page refresh. A red dot alerts you to unread messages.</div>
              <div className="feature-pills"><span className="fpill">Real-time</span><span className="fpill">Unread indicator</span><span className="fpill">Timestamped</span></div>
            </Reveal>
            <Reveal className="bento-cell" delay={120}>
              <div className="cell-label">Shared notes</div>
              <div className="cell-title">Team notes everyone can see instantly.</div>
              <div className="cell-desc">Any member can create a note — meeting summaries, decisions, reminders. Visible to the whole team the moment they're saved.</div>
              <div className="feature-pills"><span className="fpill">Bullet format</span><span className="fpill">Author + date</span><span className="fpill">Shared instantly</span></div>
            </Reveal>
            <Reveal className="bento-cell" delay={180}>
              <div className="cell-label">Meetings</div>
              <div className="cell-title">One click to a Google Meet call.</div>
              <div className="cell-desc">Admins start a room and the link appears in the workspace header. Live avatar bubbles show who has joined.</div>
              <div className="feature-pills"><span className="fpill">Google Meet</span><span className="fpill">Live presence</span><span className="fpill">Header link</span></div>
            </Reveal>
            <Reveal className="bento-cell wide dark" delay={240}>
              <div className="cell-label light">Activity feed</div>
              <div className="cell-title inv">Full audit trail of everything that happens.</div>
              <div className="cell-desc inv" style={{ maxWidth: 560 }}>Every task assignment, reassignment, and status change is logged in real-time — who did it and when.</div>
              <div className="feature-pills" style={{ marginTop: 20 }}><span className="fpill dark-pill">Live updates</span><span className="fpill dark-pill">Who did what</span><span className="fpill dark-pill">Bell notifications</span></div>
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
          <h2 className="cta-h2">Ready to stop<br /><em>switching tabs?</em></h2>
          <p className="cta-sub">Create your first workspace in under a minute. No credit card, no demo call.</p>
          <button className="cta-btn" onClick={() => navigate("/register")}>Get started free <ArrowRight size={14} /></button>
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