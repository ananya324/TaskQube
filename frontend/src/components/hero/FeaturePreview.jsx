/**
 * FeaturePreviews.jsx
 * One mini-UI preview component per feature.
 * Pure presentational — no state, no side effects.
 */

/* ── Chat Preview ── */
export function ChatPreview() {
  return (
    <div className="fp-preview fp-chat">
      <div className="fp-chat-hdr">
        <span className="fp-chat-dot" style={{ background: "#22c55e" }} />
        Team Chat
      </div>
      <div className="fp-msgs">
        <div className="fp-msg">
          <div className="fp-av" style={{ background: "#0891b2" }}>J</div>
          <div>
            <div className="fp-bubble other">Just pushed the fix 🚀</div>
            <div className="fp-time">2:14 PM</div>
          </div>
        </div>
        <div className="fp-msg fp-msg--own">
          <div className="fp-av" style={{ background: "#059669" }}>A</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div className="fp-bubble mine">Nice, merging now 👍</div>
            <div className="fp-time">2:15 PM</div>
          </div>
        </div>
        <div className="fp-msg">
          <div className="fp-av" style={{ background: "#be185d" }}>M</div>
          <div>
            <div className="fp-bubble other">Looks good ✓</div>
            <div className="fp-time">2:16 PM</div>
          </div>
        </div>
        <div className="fp-msg">
          <div className="fp-av" style={{ background: "#7c3aed" }}>S</div>
          <div>
            <div className="fp-bubble other">Deploying to prod 🚢</div>
            <div className="fp-time">2:17 PM</div>
          </div>
        </div>
      </div>
      <div className="fp-chat-input">
        <span className="fp-chat-placeholder">Message your team…</span>
        <button className="fp-send-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Tasks Preview ── */
export function TasksPreview() {
  const tasks = [
    { text: "Finalize Q2 roadmap", done: true, tag: "Design", tagColor: "#7c3aed", tagBg: "#ede9fe", av: "J", avBg: "#0d9488" },
    { text: "Review onboarding flow", done: false, tag: "Product", tagColor: "#0891b2", tagBg: "#e0f2fe", av: "M", avBg: "#be185d" },
    { text: "Ship rate-limit fix", done: false, tag: "Eng", tagColor: "#059669", tagBg: "#d1fae5", av: "A", avBg: "#059669" },
    { text: "Update release notes v2.4", done: false, tag: "Docs", tagColor: "#d97706", tagBg: "#fef3c7", av: "S", avBg: "#7c3aed" },
  ];
  return (
    <div className="fp-preview fp-tasks">
      <div className="fp-tasks-hdr">
        <span className="fp-tasks-col active">In Progress <span className="fp-col-count">3</span></span>
        <span className="fp-tasks-col">To Do <span className="fp-col-count">5</span></span>
        <span className="fp-tasks-col">Done <span className="fp-col-count">8</span></span>
      </div>
      <div className="fp-task-list">
        {tasks.map((t, i) => (
          <div key={i} className={`fp-task-row${t.done ? " done" : ""}`}>
            <div className={`fp-task-chk${t.done ? " checked" : ""}`}>
              {t.done && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`fp-task-txt${t.done ? " done" : ""}`}>{t.text}</span>
            <span className="fp-task-tag" style={{ color: t.tagColor, background: t.tagBg }}>{t.tag}</span>
            <div className="fp-task-av" style={{ background: t.avBg }}>{t.av}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Notes Preview ── */
export function NotesPreview() {
  return (
    <div className="fp-preview fp-notes">
      <div className="fp-note-card">
        <div className="fp-note-top">
          <div className="fp-note-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div className="fp-note-title">Sprint Planning — Q3</div>
            <div className="fp-note-meta">Mia R. · Jun 3</div>
          </div>
        </div>
        <div className="fp-note-items">
          {["Define OKRs and success metrics", "Review team capacity + blockers", "Ship rate-limit fix first", "Align on design handoff timeline"].map((b, i) => (
            <div key={i} className="fp-note-item">
              <div className="fp-note-dot" />
              {b}
            </div>
          ))}
        </div>
      </div>
      <div className="fp-note-card fp-note-card--muted">
        <div className="fp-note-top">
          <div className="fp-note-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div className="fp-note-title">Retro — May 28</div>
            <div className="fp-note-meta">Jay K. · May 28</div>
          </div>
        </div>
        <div className="fp-note-items">
          {["Shipping velocity improved 2×", "Need better async comms"].map((b, i) => (
            <div key={i} className="fp-note-item">
              <div className="fp-note-dot" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Presence Preview ── */
export function PresencePreview() {
  const members = [
    {
      letter: "J",
      name: "Jay Kim",
      email: "jay.kim@company.com",
      bg: "#0d9488",
      online: true,
    },
    {
      letter: "M",
      name: "Mia Ross",
      email: "mia.ross@company.com",
      bg: "#be185d",
      online: true,
    },
    {
      letter: "A",
      name: "Alex Parker",
      email: "alex.parker@company.com",
      bg: "#059669",
      online: true,
    },
    {
      letter: "S",
      name: "Sam Taylor",
      email: "sam.taylor@company.com",
      bg: "#7c3aed",
      online: true,
    },
    {
      letter: "R",
      name: "Ryan Chen",
      email: "ryan.chen@company.com",
      bg: "#0891b2",
      online: false,
    },
    {
      letter: "P",
      name: "Priya Singh",
      email: "priya.singh@company.com",
      bg: "#d97706",
      online: false,
    },
  ];
  return (
    <div className="fp-preview fp-presence">
      <div className="fp-presence-hdr">
        <span className="fp-presence-badge">
          <span className="fp-presence-dot" />
          4 online now
        </span>
      </div>
      <div className="fp-member-list">
        {members.map((m, i) => (
          <div key={i} className="fp-member-row">
            <div className="fp-member-av-wrap">
              <div className="fp-member-av" style={{ background: m.bg }}>{m.letter}</div>
              <span className={`fp-member-status${m.online ? " online" : ""}`} />
            </div>
            <div className="fp-member-info">
              <div className="fp-member-name">{m.name}</div>
              <div className="fp-member-role">{m.email}</div>
            </div>
            <span className={`fp-member-badge${m.online ? " online" : " offline"}`}>
              {m.online ? "Online" : "Offline"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Meet Preview ── */
export function MeetPreview() {
  const participants = [
    { letter: "J", bg: "#0d9488" },
    { letter: "M", bg: "#be185d" },
    { letter: "A", bg: "#059669" },
    { letter: "S", bg: "#7c3aed" },
  ];
  return (
    <div className="fp-preview fp-meet">
      <div className="fp-meet-card">
        <div className="fp-meet-top">
          <div className="fp-meet-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </div>
          <div>
            <div className="fp-meet-title">Team Standup</div>
            <div className="fp-meet-sub">Started by Admin </div>
          </div>
          <span className="fp-meet-live">● LIVE</span>
        </div>

        <button className="fp-meet-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
          Join Meeting
        </button>
      </div>
      <div className="fp-meet-hint">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Meeting link appears in the workspace header for everyone.
      </div>
    </div>
  );
}

/* ── Requests Preview ── */
export function RequestsPreview() {
  const requests = [
    { letter: "R", name: "Ryan Chen", email: "ryan@acme.co", bg: "#7c3aed" },
    { letter: "P", name: "Priya Singh", email: "priya@loop.io", bg: "#be185d" },
    { letter: "T", name: "Tom Ellis", email: "tom@dev.io", bg: "#0891b2" },
  ];
  return (
    <div className="fp-preview fp-requests">
      <div className="fp-req-hdr">
        <span className="fp-req-title">Join Requests</span>
        <span className="fp-req-count">{requests.length} pending</span>
      </div>
      <div className="fp-req-list">
        {requests.map((r, i) => (
          <div key={i} className="fp-req-row">
            <div className="fp-req-av" style={{ background: r.bg }}>{r.letter}</div>
            <div className="fp-req-info">
              <div className="fp-req-name">{r.name}</div>
              <div className="fp-req-email">{r.email}</div>
            </div>
            <div className="fp-req-btns">
              <button className="fp-req-accept">✓</button>
              <button className="fp-req-reject">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}