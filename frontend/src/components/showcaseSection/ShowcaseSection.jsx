import { useState, useEffect } from "react";

/* ─── Screenshot imports ─── */
const SCREENSHOTS = {
    adminKanban: "/screenshots/Screenshot 2026-05-31 173858.png",
    assignModal:  "/screenshots/Screenshot 2026-05-31 173332.png",
    memberTasks:  "/screenshots/Screenshot 2026-05-31 173805.png",
    chat:         "/screenshots/Screenshot 2026-05-31 174449.png",
    notesA:       "/screenshots/Screenshot 2026-05-31 174221.png",
    meetActive:   "/screenshots/Screenshot 2026-05-31 174544.png",
    meetJoin:     "/screenshots/Screenshot 2026-05-31 190115.png",
    activity:     "/screenshots/Screenshot 2026-05-31 173925.png",
};

/* ─── Hook: track screen width ─── */
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, [breakpoint]);
    return isMobile;
}

/* ─── Browser chrome wrapper ─── */
function BrowserFrame({ label, children }) {
    return (
        <div style={{
            borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden",
            background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
            <div style={{
                display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
                background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
            }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                {label && (
                    <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8, fontFamily: "monospace" }}>
                        {label}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

/* ─── Role badge ─── */
function RoleBadge({ role }) {
    const styles = {
        Admin:  { background: "rgba(13,148,136,0.1)", color: "#0d9488" },
        Member: { background: "rgba(99,102,241,0.1)",  color: "#6366f1" },
    };
    return (
        <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", padding: "3px 10px",
            borderRadius: 100, ...styles[role],
        }}>{role}</span>
    );
}

/* ─── Caption card ─── */
function Caption({ icon, title, text }) {
    return (
        <div style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            background: "#f8fafc", borderRadius: 12, padding: "14px 16px",
        }}>
            <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: "rgba(13,148,136,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17,
            }}>{icon}</div>
            <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{text}</div>
            </div>
        </div>
    );
}

/* ─── TABS config ─── */
const TABS = [
    { id: "tasks",    label: "Tasks (Admin)",  icon: "⊞" },
    { id: "members",  label: "Tasks (Member)", icon: "👤" },
    { id: "chat",     label: "Chat",           icon: "💬" },
    { id: "notes",    label: "Notes",          icon: "📝" },
    { id: "meet",     label: "Meetings",       icon: "📹" },
    { id: "activity", label: "Activity",       icon: "⚡" },
];

/* ─── DESKTOP PANELS ─── */
function TasksAdminPanel() {
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <RoleBadge role="Admin" />
                    <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>
                        Full kanban board + assign controls
                    </span>
                </div>
                <BrowserFrame label="taskqube.app / team-1 / tasks">
                    <img src={SCREENSHOTS.adminKanban} alt="Admin kanban board" style={{ width: "100%", display: "block" }} />
                </BrowserFrame>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 13, color: "#475569", fontWeight: 600, marginBottom: 10 }}>Assign Task modal</div>
                    <BrowserFrame>
                        <img src={SCREENSHOTS.assignModal} alt="Assign task modal" style={{ width: "100%", display: "block" }} />
                    </BrowserFrame>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                    <Caption icon="👤" title="Assign & reassign"    text="Only admins see the Assign Task button. Set the assignee, priority, and due date from a clean modal." />
                    <Caption icon="⏰" title="Due-within-24h alert" text="Tasks nearing deadlines get a warning banner so nothing slips through." />
                    <Caption icon="🚩" title="Priority labels"       text="High, Medium, Low — colour-coded so your team always knows what matters most." />
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Caption icon="⊞" title="Full kanban board" text="Admins see every task across To Do, In Progress, and Completed columns with deadlines." />
                <Caption icon="🔒" title="Admin-only controls" text="Assignment and reassignment controls are gated — members get a focused, distraction-free view." />
            </div>
        </div>
    );
}

function TasksMemberPanel() {
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <RoleBadge role="Member" />
                    <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>Your Tasks + Team Tasks</span>
                </div>
                <BrowserFrame>
                    <img src={SCREENSHOTS.memberTasks} alt="Member tasks view" style={{ width: "100%", display: "block" }} />
                </BrowserFrame>
            </div>
            <div style={{
                background: "linear-gradient(135deg, rgba(13,148,136,0.06), rgba(99,102,241,0.06))",
                border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px 20px", marginBottom: 16,
            }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                    Admin vs Member — what's different?
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Admin sees</div>
                        {["Full kanban board (all columns)", "Assign Task button", "Reassign & status-change controls", "All team members' tasks", "Activity feed"].map(t => (
                            <div key={t} style={{ fontSize: 12.5, color: "#334155", display: "flex", gap: 6, marginBottom: 4 }}>
                                <span style={{ color: "#0d9488" }}>✓</span> {t}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Member sees</div>
                        {["Your Tasks (assigned to you)", "Team Tasks (everyone else's)", "Due dates & priority tags", "Completed tasks (strikethrough)", "No assignment controls"].map(t => (
                            <div key={t} style={{ fontSize: 12.5, color: "#334155", display: "flex", gap: 6, marginBottom: 4 }}>
                                <span style={{ color: "#6366f1" }}>✓</span> {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Caption icon="🔒" title="Role-based controls"       text="Assign, Reassign, and status-change buttons are admin-only. Members get a clean, focused view." />
                <Caption icon="✅" title="Personal + team visibility" text="Members always see their own tasks and teammates' tasks — no info silos." />
            </div>
        </div>
    );
}

function ChatPanel() {
    return (
        <div>
            <BrowserFrame label="taskqube.app / team-1 / chat">
                <img src={SCREENSHOTS.chat} alt="Team Chat" style={{ width: "100%", display: "block" }} />
            </BrowserFrame>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                <Caption icon="💬" title="Real-time team chat"  text="Every workspace has built-in chat — conversation lives right beside your tasks and notes." />
                <Caption icon="🔴" title="Unread indicators"    text="A red dot on the Chat tab alerts you to new messages the moment they arrive." />
                <Caption icon="🕐" title="Timestamped messages" text="Every message shows the sender and exact time so the conversation timeline is always clear." />
                <Caption icon="📤" title="Instant send"         text="Hit Send or press Enter — messages appear for everyone in real-time." />
            </div>
        </div>
    );
}

function NotesPanel() {
    return (
        <div>
            <div style={{ fontSize: 13, color: "#475569", fontWeight: 600, marginBottom: 10 }}>Notes overview</div>
            <BrowserFrame>
                <img src={SCREENSHOTS.notesA} alt="Notes page" style={{ width: "100%", display: "block" }} />
            </BrowserFrame>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                <Caption icon="📝" title="Shared team notes"    text="Any team member can create notes — meeting summaries, reminders, decisions. Everyone sees them instantly." />
                <Caption icon="📌" title="Bullet-point format"  text="Notes display as scannable bullet lists. Author name and date are always shown on each card." />
                <Caption icon="➕" title="New Note in one click" text="Hit New Note, give it a title, add bullets — published to the whole team immediately." />
                <Caption icon="📋" title="Multiple notes"        text="Each note is its own card — Meeting Notes, Reminders, and more stack cleanly on the board." />
            </div>
        </div>
    );
}

function MeetPanel() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 13, color: "#475569", fontWeight: 600, marginBottom: 10 }}>Admin starts the meet</div>
                    <BrowserFrame>
                        <div style={{ height: 250 }}>
                            <img src={SCREENSHOTS.meetActive} alt="Admin starting a meeting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    </BrowserFrame>
                </div>
                <div>
                    <div style={{ fontSize: 13, color: "#475569", fontWeight: 600, marginBottom: 10 }}>Team joins — avatars shown live</div>
                    <BrowserFrame>
                        <div style={{ height: 250 }}>
                            <img src={SCREENSHOTS.meetJoin} alt="Team joining the meeting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    </BrowserFrame>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Caption icon="📹" title="One-click Google Meet" text="Hit Start Meet — a Google Meet room is created instantly. The link appears in the workspace header." />
                <Caption icon="📤" title="Share to notify team"  text="A Share button lets the admin broadcast the meeting link. Members join with one click." />
                <Caption icon="👥" title="Live presence bubbles" text="Avatar circles in the header show exactly who has joined — at a glance, in real-time." />
                <Caption icon="🟢" title="Meet active indicator" text="A green Meet active badge replaces the Start Meet button so everyone knows a call is live." />
            </div>
        </div>
    );
}

function ActivityPanel() {
    return (
        <div>
            <BrowserFrame label="taskqube.app / team-1 — Activity feed">
                <img src={SCREENSHOTS.activity} alt="Activity feed" style={{ width: "100%", display: "block" }} />
            </BrowserFrame>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                <Caption icon="⚡" title="Live activity feed"  text="Every task assignment, reassignment, and status change is logged in real-time with who did it and when." />
                <Caption icon="🕐" title="Time-ago timestamps" text="Entries show relative timestamps — seconds ago, minutes ago — so you always know how fresh each action was." />
                <Caption icon="📋" title="Full audit trail"    text='No more "who assigned this?" — the activity panel gives complete workspace history at a glance.' />
                <Caption icon="🔔" title="Bell notification"   text="A red dot on the bell icon alerts you to new activity without interrupting your current flow." />
            </div>
        </div>
    );
}

const PANEL_MAP = {
    tasks:    <TasksAdminPanel />,
    members:  <TasksMemberPanel />,
    chat:     <ChatPanel />,
    notes:    <NotesPanel />,
    meet:     <MeetPanel />,
    activity: <ActivityPanel />,
};

/* ─────────────────────────────────────────────────────────────
   MOBILE VERSION — lightweight scrollable feature strip
───────────────────────────────────────────────────────────── */
const MOBILE_FEATURES = [
    { icon: "⊞", title: "Smart Task Boards", desc: "Kanban board with priorities, deadlines, and role-based controls for admins and members.", screenshot: SCREENSHOTS.adminKanban },
    { icon: "💬", title: "Real-time Chat",    desc: "Built-in team chat with unread indicators and timestamps — no app switching needed.", screenshot: SCREENSHOTS.chat },
    { icon: "📝", title: "Shared Notes",      desc: "Create and share bullet-point notes with your whole team instantly.", screenshot: SCREENSHOTS.notesA },
    { icon: "📹", title: "One-click Meetings", desc: "Start a Google Meet instantly. Team sees avatars of who has joined live.", screenshot: SCREENSHOTS.meetActive },
    { icon: "⚡", title: "Activity Feed",     desc: "Full audit trail of every action — who did what and when.", screenshot: SCREENSHOTS.activity },
];

function MobileShowcase() {
    const [activeIdx, setActiveIdx] = useState(0);
    const active = MOBILE_FEATURES[activeIdx];

    return (
        <div style={{ padding: "64px 20px", background: "#f0fdfa", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Bricolage+Grotesque:wght@800&display=swap');
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .mob-feat-btn { transition: all 0.18s; border: none; cursor: pointer; }
            `}</style>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0d9488", display: "block", marginBottom: 8 }}>
                    Product walkthrough
                </span>
                <h2 style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "clamp(24px,6vw,32px)", fontWeight: 800,
                    letterSpacing: "-1px", color: "#0f172a",
                    lineHeight: 1.15, marginBottom: 10,
                }}>
                    A closer look at<br />
                    <span style={{
                        background: "linear-gradient(130deg,#0d9488,#06b6d4)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>every feature</span>
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 300, margin: "0 auto" }}>
                    Here's what TaskQube looks like in the real world.
                </p>
            </div>

            {/* Feature selector pills */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
                {MOBILE_FEATURES.map((f, i) => (
                    <button
                        key={f.title}
                        className="mob-feat-btn"
                        onClick={() => setActiveIdx(i)}
                        style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "7px 14px", borderRadius: 100, whiteSpace: "nowrap",
                            background: activeIdx === i ? "#0d9488" : "#fff",
                            color: activeIdx === i ? "#fff" : "#475569",
                            border: `1.5px solid ${activeIdx === i ? "#0d9488" : "#cbd5e1"}`,
                            fontSize: 12, fontWeight: 600,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        <span>{f.icon}</span> {f.title}
                    </button>
                ))}
            </div>

            {/* Active feature screenshot + description */}
            <div key={activeIdx} style={{ animation: "fadeUp 0.3s ease both" }}>
                {/* Browser frame */}
                <div style={{
                    borderRadius: 12, border: "1.5px solid #e2e8f0", overflow: "hidden",
                    background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginBottom: 16,
                }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 5, padding: "8px 12px",
                        background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
                    }}>
                        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                        ))}
                        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6, fontFamily: "monospace" }}>
                            taskqube.app
                        </span>
                    </div>
                    <img
                        src={active.screenshot}
                        alt={active.title}
                        style={{ width: "100%", display: "block", maxHeight: 220, objectFit: "cover", objectPosition: "top" }}
                    />
                </div>

                {/* Description card */}
                <div style={{
                    background: "#fff", border: "1.5px solid #e2e8f0",
                    borderRadius: 12, padding: "16px 18px",
                    display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: "rgba(13,148,136,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                    }}>{active.icon}</div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{active.title}</div>
                        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{active.desc}</div>
                    </div>
                </div>

                {/* Dot indicators */}
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
                    {MOBILE_FEATURES.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            style={{
                                width: activeIdx === i ? 20 : 7,
                                height: 7, borderRadius: 100,
                                background: activeIdx === i ? "#0d9488" : "#cbd5e1",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP VERSION — full tabbed showcase
───────────────────────────────────────────────────────────── */
function DesktopShowcase() {
    const [active, setActive] = useState("tasks");

    return (
        <div style={{ padding: "96px 24px", background: "#f0fdfa", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Bricolage+Grotesque:wght@800&display=swap');
                .ftab { cursor: pointer; transition: all 0.18s; }
                .ftab:hover { border-color: #0d9488 !important; color: #0d9488 !important; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <span style={{
                        display: "inline-block", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "#0d9488", marginBottom: 10,
                    }}>Product walkthrough</span>
                    <h2 style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "clamp(28px,4vw,42px)", fontWeight: 800,
                        letterSpacing: "-1.5px", color: "#0f172a",
                        lineHeight: 1.1, marginBottom: 14,
                    }}>
                        A closer look at every feature,
                        <br />
                        <span style={{
                            background: "linear-gradient(130deg,#0d9488,#06b6d4)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>built for how teams actually work</span>
                    </h2>
                    <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
                        From smart task boards to real-time chat and one-click meetings — here's what TaskQube looks like in the real world.
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 32 }}>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className="ftab"
                            onClick={() => setActive(tab.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 18px", borderRadius: 100,
                                border: `1.5px solid ${active === tab.id ? "#0d9488" : "#cbd5e1"}`,
                                background: active === tab.id ? "#0d9488" : "#fff",
                                color: active === tab.id ? "#fff" : "#475569",
                                fontSize: 13, fontWeight: 600,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            <span style={{ fontSize: 15 }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Panel */}
                <div key={active} style={{ animation: "fadeUp 0.35s ease both" }}>
                    {PANEL_MAP[active]}
                </div>
            </div>
        </div>
    );
}

/* ─── MAIN EXPORT ─── */
export default function ShowcaseSection() {
    const isMobile = useIsMobile(768);
    return isMobile ? <MobileShowcase /> : <DesktopShowcase />;
}