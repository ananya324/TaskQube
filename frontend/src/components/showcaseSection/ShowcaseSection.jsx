/**
 * ShowcaseSection.jsx
 * Workflow narrative — shows the journey, not a feature list.
 * Three steps, each with a real screenshot on one side
 * and copy + supporting detail on the other.
 * Alternates side per step so the eye keeps moving.
 */

import { useState, useEffect, useRef } from "react";

/* ── Screenshots ── */
const SS = {
  adminKanban: "/screenshots/Screenshot 2026-05-31 173858.png",
  assignModal:  "/screenshots/Screenshot 2026-05-31 173332.png",
  chat:         "/screenshots/Screenshot 2026-05-31 174449.png",
  notesA:       "/screenshots/Screenshot 2026-05-31 174221.png",
  meetActive:   "/screenshots/Screenshot 2026-05-31 174544.png",
  meetJoin:     "/screenshots/Screenshot 2026-05-31 190115.png",
  activity:     "/screenshots/Screenshot 2026-05-31 173925.png",
};

/* ── Reveal on scroll ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Browser chrome wrapper ── */
function BrowserFrame({ src, alt, height = "auto" }) {
  return (
    <div style={{
      borderRadius: 14,
      border: "1px solid #d1fae5",
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(13,148,136,0.1), 0 1px 4px rgba(0,0,0,0.06)",
    }}>
      {/* Traffic lights */}
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "8px 12px",
        background: "#ccfbf1",
        borderBottom: "1px solid #d1fae5",
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
        ))}
        <div style={{
          flex: 1, marginLeft: 8,
          background: "rgba(255,255,255,0.5)",
          borderRadius: 4, height: 16,
          display: "flex", alignItems: "center",
          padding: "0 8px",
        }}>
          <span style={{ fontSize: 10, color: "#2d8a81", fontFamily: "'DM Mono', monospace" }}>
            taskqube.app
          </span>
        </div>
      </div>
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%", display: "block",
          height, objectFit: "cover", objectPosition: "top",
        }}
      />
    </div>
  );
}

/* ── Pill badge ── */
function Pill({ children, color = "#0d9488", bg = "#ccfbf1" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "'DM Mono', monospace",
      fontSize: 10, fontWeight: 500, letterSpacing: "0.06em",
      textTransform: "uppercase",
      color, background: bg,
      padding: "3px 10px", borderRadius: 100,
    }}>
      {children}
    </span>
  );
}

/* ── Small feature callout ── */
function Callout({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "#f0fdfa", border: "1px solid #d1fae5",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: 16,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#0f3d38", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#3d7a72", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STEPS DATA
   Three workflow moments, not a feature list.
══════════════════════════════════════════ */
const STEPS = [
  {
    step: "01",
    kicker: "Get organised",
    headline: "Your tasks,\nyour way.",
    sub: "Create a workspace, invite your team, and start shipping. Admins assign tasks with priority and due dates. Members see exactly what they need to work on.",
    pills: [{ label: "Kanban board" }, { label: "Role-based controls" }, { label: "Due date alerts" }],
    callouts: [
      { icon: "⬛", title: "Admin controls", desc: "Only admins can assign, reassign, and change task status — members stay focused." },
      { icon: "🏷️", title: "Priority labels", desc: "High, Medium, Low — colour-coded so your team always knows what matters most." },
      { icon: "⏰", title: "Due-date warnings", desc: "Tasks nearing their deadline surface a warning so nothing slips through." },
    ],
    // Primary screenshot + secondary
    primary: { src: SS.adminKanban, alt: "Kanban board", height: 260 },
    secondary: { src: SS.assignModal, alt: "Assign task modal", height: 180 },
    flip: false, // screenshot on right
  },
  {
    step: "02",
    kicker: "Stay in sync",
    headline: "Talk, share,\ndecide — here.",
    sub: "Built-in chat and shared notes keep your team aligned without leaving the workspace. Decisions live next to the tasks they belong to.",
    pills: [{ label: "Real-time chat" }, { label: "Shared notes" }, { label: "No app switching" }],
    callouts: [
      { icon: "💬", title: "Team chat", desc: "Messages appear instantly for everyone. An unread dot means you never miss anything." },
      { icon: "📝", title: "Shared notes", desc: "Meeting summaries, decisions, reminders — visible to the whole team the moment they're saved." },
      { icon: "🔔", title: "Unread indicators", desc: "Red dots on Chat and Activity tabs alert you without interrupting your current flow." },
    ],
    primary: { src: SS.chat, alt: "Team chat", height: 260 },
    secondary: { src: SS.notesA, alt: "Shared notes", height: 180 },
    flip: true, // screenshot on left
  },
  {
    step: "03",
    kicker: "Ship together",
    headline: "Meet, track,\nand ship.",
    sub: "One-click Google Meet gets your team on a call instantly. The activity feed gives you a full audit trail of everything that happened — who did what and when.",
    pills: [{ label: "Google Meet" }, { label: "Live presence" }, { label: "Activity feed" }],
    callouts: [
      { icon: "📹", title: "One-click meetings", desc: "Hit Start Meet — a Google Meet room opens instantly and the link appears in the workspace header." },
      { icon: "🟢", title: "Live presence", desc: "Avatar bubbles show who's joined the call in real-time, right in the header." },
      { icon: "📋", title: "Activity feed", desc: "Every assignment, reassignment, and status change is logged — no more 'who did this?'" },
    ],
    primary: { src: SS.meetActive, alt: "Meeting active", height: 220 },
    secondary: { src: SS.activity, alt: "Activity feed", height: 200 },
    flip: false,
  },
];

/* ══════════════════════════════════════════
   STEP BLOCK — desktop
══════════════════════════════════════════ */
function StepBlock({ data, index }) {
  const [ref, visible] = useReveal();
  const { flip } = data;

  const copyCol = (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
    }}>
      {/* Step + kicker */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          color: "#0d9488", letterSpacing: "0.06em",
        }}>
          {data.step}
        </span>
        <div style={{ width: 24, height: 1, background: "#99f6e4" }} />
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9,
          color: "#3d7a72", letterSpacing: "0.14em", textTransform: "uppercase",
        }}>
          {data.kicker}
        </span>
      </div>

      {/* Headline */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(36px, 3.8vw, 52px)",
        fontWeight: 300,
        letterSpacing: "-1px",
        color: "#0a2e2a",
        lineHeight: 1.0,
        marginBottom: 18,
        whiteSpace: "pre-line",
      }}>
        {data.headline}
      </h2>

      {/* Sub */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15, fontWeight: 400,
        color: "#3d7a72", lineHeight: 1.8,
        marginBottom: 24, maxWidth: 400,
      }}>
        {data.sub}
      </p>

      {/* Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
        {data.pills.map(p => (
          <Pill key={p.label}>{p.label}</Pill>
        ))}
      </div>

      {/* Callouts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {data.callouts.map(c => (
          <Callout key={c.title} {...c} />
        ))}
      </div>
    </div>
  );

  const screenshotCol = (
    <div style={{
      display: "flex", flexDirection: "column", gap: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.65s ease ${index * 80 + 100}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 80 + 100}ms`,
    }}>
      <BrowserFrame src={data.primary.src} alt={data.primary.alt} height={data.primary.height} />
      <BrowserFrame src={data.secondary.src} alt={data.secondary.alt} height={data.secondary.height} />
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 72,
        alignItems: "center",
        padding: "80px 0",
        borderBottom: index < STEPS.length - 1 ? "1px solid #d1fae5" : "none",
      }}
    >
      {flip ? (
        <>{screenshotCol}{copyCol}</>
      ) : (
        <>{copyCol}{screenshotCol}</>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MOBILE STEP BLOCK
══════════════════════════════════════════ */
function MobileStepBlock({ data, index, active, onActivate }) {
  const isOpen = active === index;

  return (
    <div style={{
      borderBottom: "1px solid #d1fae5",
      paddingBottom: isOpen ? 28 : 0,
    }}>
      {/* Accordion header */}
      <button
        onClick={() => onActivate(isOpen ? null : index)}
        style={{
          width: "100%", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
          padding: "20px 0", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: isOpen ? "#0d9488" : "#99f6e4",
          }}>
            {data.step}
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22, fontWeight: 300, letterSpacing: "-0.5px",
            color: "#0a2e2a", whiteSpace: "pre-line",
          }}>
            {data.headline}
          </span>
        </div>
        <span style={{
          fontSize: 18, color: "#0d9488",
          transform: isOpen ? "rotate(45deg)" : "rotate(0)",
          transition: "transform 0.22s ease",
          flexShrink: 0,
        }}>+</span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ animation: "fadeUpMob 0.28s ease both" }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14, color: "#3d7a72", lineHeight: 1.75, marginBottom: 16,
          }}>
            {data.sub}
          </p>

          {/* Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {data.pills.map(p => <Pill key={p.label}>{p.label}</Pill>)}
          </div>

          {/* Primary screenshot */}
          <div style={{ marginBottom: 12 }}>
            <BrowserFrame src={data.primary.src} alt={data.primary.alt} />
          </div>

          {/* Secondary screenshot */}
          <div style={{ marginBottom: 20 }}>
            <BrowserFrame src={data.secondary.src} alt={data.secondary.alt} />
          </div>

          {/* Callouts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.callouts.map(c => <Callout key={c.title} {...c} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return m;
}

export default function ShowcaseSection() {
  const isMobile = useIsMobile();
  const [mobileActive, setMobileActive] = useState(0);

  if (isMobile) {
    return (
      <section style={{
        background: "#f0fdfa",
        padding: "60px 20px 48px",
        borderBottom: "1px solid #d1fae5",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Inter:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
          @keyframes fadeUpMob { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        `}</style>

        {/* Section header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#2d8a81", marginBottom: 12,
          }}>
            How it works
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(30px, 8vw, 40px)", fontWeight: 300,
            letterSpacing: "-1px", color: "#0a2e2a",
            lineHeight: 1.05, marginBottom: 12,
          }}>
            Three steps to<br /><em style={{ color: "#0d9488" }}>shipping together.</em>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#3d7a72", lineHeight: 1.7 }}>
            Everything your team needs, in one place.
          </p>
        </div>

        {/* Accordion steps */}
        {STEPS.map((s, i) => (
          <MobileStepBlock
            key={s.step}
            data={s}
            index={i}
            active={mobileActive}
            onActivate={setMobileActive}
          />
        ))}
      </section>
    );
  }

  return (
    <section style={{
      background: "#f0fdfa",
      padding: "0 80px 80px",
      borderBottom: "1px solid #d1fae5",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Inter:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Section header */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "80px 0 0",
        borderBottom: "1px solid #d1fae5",
        paddingBottom: 64,
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 9,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#2d8a81", marginBottom: 16,
        }}>
          How it works
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 300,
            letterSpacing: "-1.5px", color: "#0a2e2a",
            lineHeight: 1.0, margin: 0,
          }}>
            Three steps to<br /><em style={{ color: "#0d9488" }}>shipping together.</em>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, color: "#3d7a72", lineHeight: 1.8,
            maxWidth: 380, margin: 0,
          }}>
            From the first task to the final deploy — TaskQube keeps your whole team organised, aligned, and moving.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {STEPS.map((s, i) => (
          <StepBlock key={s.step} data={s} index={i} />
        ))}
      </div>
    </section>
  );
}