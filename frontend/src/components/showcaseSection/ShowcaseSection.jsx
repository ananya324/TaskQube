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

/*
  Teal tokens (mirrors Home.jsx)
  --teal-950  #042f2e
  --teal-50   #f0fdfa   page bg
  --teal-100  #ccfbf1
  --teal-200  #99f6e4
  --teal-300  #2d8a81   subtle text
  --teal-500  #14b8a6   accent
  --teal-600  #0d9488   primary
  --border    #d1fae5
  --text-main #0f3d38
  --text-sub  #3d7a72
*/

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
            borderRadius: 12, border: "1px solid #d1fae5", overflow: "hidden",
            background: "#f0fdfa",
        }}>
            <div style={{
                display: "flex", alignItems: "center", gap: 5, padding: "8px 12px",
                background: "#ccfbf1", borderBottom: "1px solid #d1fae5",
            }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                    <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
                {label && (
                    <span style={{ fontSize: 11, color: "#2d8a81", marginLeft: 6, fontFamily: "'DM Mono', monospace" }}>
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
    return (
        <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "3px 9px",
            borderRadius: 100, fontFamily: "'DM Mono', monospace",
            background: "#ccfbf1", color: "#0f3d38", border: "1px solid #99f6e4",
        }}>{role}</span>
    );
}

/* ─── Caption card ─── */
function Caption({ title, text }) {
    return (
        <div style={{
            borderRadius: 10, padding: "14px 16px",
            border: "1px solid #d1fae5", background: "#f0fdfa",
        }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0f3d38", marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12.5, color: "#3d7a72", lineHeight: 1.6 }}>{text}</div>
        </div>
    );
}

/* ─── TABS config ─── */
const TABS = [
    { id: "tasks",    label: "Tasks (Admin)"  },
    { id: "members",  label: "Tasks (Member)" },
    { id: "chat",     label: "Chat"           },
    { id: "notes",    label: "Notes"          },
    { id: "meet",     label: "Meetings"       },
    { id: "activity", label: "Activity"       },
];

/* ─── DESKTOP PANELS ─── */
function TasksAdminPanel() {
    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <RoleBadge role="Admin" />
                    <span style={{ fontSize: 13, color: "#3d7a72", fontWeight: 400 }}>
                        Full kanban board + assign controls
                    </span>
                </div>
                <BrowserFrame label="taskqube.app / team-1 / tasks">
                    <img src={SCREENSHOTS.adminKanban} alt="Admin kanban board" style={{ width: "100%", display: "block" }} />
                </BrowserFrame>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                    <div style={{ fontSize: 12, color: "#2d8a81", fontFamily: "'DM Mono', monospace", marginBottom: 10, letterSpacing: "0.05em" }}>Assign task modal</div>
                    <BrowserFrame>
                        <img src={SCREENSHOTS.assignModal} alt="Assign task modal" style={{ width: "100%", display: "block" }} />
                    </BrowserFrame>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                    <Caption title="Assign & reassign"    text="Only admins see the Assign Task button. Set the assignee, priority, and due date from a clean modal." />
                    <Caption title="Due-within-24h alert" text="Tasks nearing deadlines get a warning banner so nothing slips through." />
                    <Caption title="Priority labels"      text="High, Medium, Low — colour-coded so your team always knows what matters most." />
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Caption title="Full kanban board"   text="Admins see every task across To Do, In Progress, and Completed columns with deadlines." />
                <Caption title="Admin-only controls" text="Assignment controls are gated — members get a focused, distraction-free view." />
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
                    <span style={{ fontSize: 13, color: "#3d7a72", fontWeight: 400 }}>Your Tasks + Team Tasks</span>
                </div>
                <BrowserFrame>
                    <img src={SCREENSHOTS.memberTasks} alt="Member tasks view" style={{ width: "100%", display: "block" }} />
                </BrowserFrame>
            </div>
            <div style={{
                border: "1px solid #d1fae5", borderRadius: 10, padding: "16px 18px", marginBottom: 12,
                background: "#f0fdfa",
            }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#0f3d38", marginBottom: 12 }}>
                    Admin vs Member — what's different?
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                        { label: "Admin sees", items: ["Full kanban board (all columns)", "Assign Task button", "Reassign & status-change controls", "All team members' tasks", "Activity feed"] },
                        { label: "Member sees", items: ["Your Tasks (assigned to you)", "Team Tasks (everyone else's)", "Due dates & priority tags", "Completed tasks (strikethrough)", "No assignment controls"] },
                    ].map(({ label, items }) => (
                        <div key={label}>
                            <div style={{ fontSize: 10, fontWeight: 500, color: "#2d8a81", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>{label}</div>
                            {items.map(t => (
                                <div key={t} style={{ fontSize: 12.5, color: "#3d7a72", display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                                    <span style={{ color: "#0d9488", marginTop: 1, flexShrink: 0 }}>—</span> {t}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Caption title="Role-based controls"        text="Assign, Reassign, and status-change buttons are admin-only. Members get a clean, focused view." />
                <Caption title="Personal + team visibility" text="Members always see their own tasks and teammates' tasks — no info silos." />
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                <Caption title="Real-time team chat"  text="Every workspace has built-in chat — conversation lives right beside your tasks and notes." />
                <Caption title="Unread indicators"    text="A red dot on the Chat tab alerts you to new messages the moment they arrive." />
                <Caption title="Timestamped messages" text="Every message shows the sender and exact time so the conversation timeline is always clear." />
                <Caption title="Instant send"         text="Hit Send or press Enter — messages appear for everyone in real-time." />
            </div>
        </div>
    );
}

function NotesPanel() {
    return (
        <div>
            <div style={{ fontSize: 12, color: "#2d8a81", fontFamily: "'DM Mono', monospace", marginBottom: 10, letterSpacing: "0.05em" }}>Notes overview</div>
            <BrowserFrame>
                <img src={SCREENSHOTS.notesA} alt="Notes page" style={{ width: "100%", display: "block" }} />
            </BrowserFrame>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                <Caption title="Shared team notes"     text="Any team member can create notes — meeting summaries, reminders, decisions. Everyone sees them instantly." />
                <Caption title="Bullet-point format"   text="Notes display as scannable bullet lists. Author name and date are always shown on each card." />
                <Caption title="New note in one click" text="Hit New Note, give it a title, add bullets — published to the whole team immediately." />
                <Caption title="Multiple notes"        text="Each note is its own card — meeting notes, reminders, and more stack cleanly on the board." />
            </div>
        </div>
    );
}

function MeetPanel() {
    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                    <div style={{ fontSize: 12, color: "#2d8a81", fontFamily: "'DM Mono', monospace", marginBottom: 10, letterSpacing: "0.05em" }}>Admin starts the meet</div>
                    <BrowserFrame>
                        <div style={{ height: 240 }}>
                            <img src={SCREENSHOTS.meetActive} alt="Admin starting a meeting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    </BrowserFrame>
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#2d8a81", fontFamily: "'DM Mono', monospace", marginBottom: 10, letterSpacing: "0.05em" }}>Team joins — avatars shown live</div>
                    <BrowserFrame>
                        <div style={{ height: 240 }}>
                            <img src={SCREENSHOTS.meetJoin} alt="Team joining the meeting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    </BrowserFrame>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Caption title="One-click Google Meet" text="Hit Start Meet — a Google Meet room is created instantly. The link appears in the workspace header." />
                <Caption title="Share to notify team"  text="A Share button lets the admin broadcast the meeting link. Members join with one click." />
                <Caption title="Live presence bubbles" text="Avatar circles in the header show exactly who has joined — at a glance, in real-time." />
                <Caption title="Meet active indicator" text="A green badge replaces the Start Meet button so everyone knows a call is live." />
            </div>
        </div>
    );
}

function ActivityPanel() {
    return (
        <div>
            <BrowserFrame label="taskqube.app / team-1 — activity">
                <img src={SCREENSHOTS.activity} alt="Activity feed" style={{ width: "100%", display: "block" }} />
            </BrowserFrame>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                <Caption title="Live activity feed"  text="Every task assignment, reassignment, and status change is logged in real-time with who did it and when." />
                <Caption title="Time-ago timestamps" text="Entries show relative timestamps — seconds ago, minutes ago — so you always know how fresh each action was." />
                <Caption title="Full audit trail"    text='No more "who assigned this?" — the activity panel gives complete workspace history at a glance.' />
                <Caption title="Bell notification"   text="A red dot on the bell icon alerts you to new activity without interrupting your current flow." />
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
   MOBILE VERSION
───────────────────────────────────────────────────────────── */
const MOBILE_FEATURES = [
    { label: "Tasks",    title: "Smart task boards",  desc: "Kanban board with priorities, deadlines, and role-based controls for admins and members.", screenshot: SCREENSHOTS.adminKanban },
    { label: "Chat",     title: "Real-time chat",     desc: "Built-in team chat with unread indicators and timestamps — no app switching needed.",       screenshot: SCREENSHOTS.chat },
    { label: "Notes",    title: "Shared notes",       desc: "Create and share bullet-point notes with your whole team instantly.",                        screenshot: SCREENSHOTS.notesA },
    { label: "Meetings", title: "One-click meetings", desc: "Start a Google Meet instantly. Team sees avatars of who has joined live.",                   screenshot: SCREENSHOTS.meetActive },
    { label: "Activity", title: "Activity feed",      desc: "Full audit trail of every action — who did what and when.",                                  screenshot: SCREENSHOTS.activity },
];

function MobileShowcase() {
    const [activeIdx, setActiveIdx] = useState(0);
    const active = MOBILE_FEATURES[activeIdx];

    return (
        <div style={{ padding: "60px 20px", background: "#f0fdfa", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #d1fae5" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
                @keyframes fadeUpMob { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#2d8a81", marginBottom: 12 }}>
                    Product walkthrough
                </div>
                <h2 style={{ fontSize: "clamp(24px,6vw,30px)", fontWeight: 300, letterSpacing: "-1.5px", color: "#0f3d38", lineHeight: 1.1, marginBottom: 10 }}>
                    A closer look<br /><span style={{ color: "#2d8a81", fontStyle: "italic" }}>at every feature.</span>
                </h2>
                <p style={{ fontSize: 13.5, color: "#3d7a72", lineHeight: 1.7, maxWidth: 300 }}>
                    Here's what TaskQube looks like in the real world.
                </p>
            </div>

            {/* Pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 18, scrollbarWidth: "none" }}>
                {MOBILE_FEATURES.map((f, i) => (
                    <button
                        key={f.label}
                        onClick={() => setActiveIdx(i)}
                        style={{
                            padding: "6px 14px", borderRadius: 100, whiteSpace: "nowrap", border: "none",
                            background: activeIdx === i ? "#0d9488" : "#ccfbf1",
                            color: activeIdx === i ? "#f0fdfa" : "#3d7a72",
                            fontSize: 12, fontWeight: 500, cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "background 0.15s, color 0.15s",
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Screenshot */}
            <div key={activeIdx} style={{ animation: "fadeUpMob 0.28s ease both" }}>
                <div style={{ borderRadius: 10, border: "1px solid #d1fae5", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", background: "#ccfbf1", borderBottom: "1px solid #d1fae5" }}>
                        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                        ))}
                        <span style={{ fontSize: 10, color: "#2d8a81", marginLeft: 5, fontFamily: "'DM Mono', monospace" }}>taskqube.app</span>
                    </div>
                    <img
                        src={active.screenshot}
                        alt={active.title}
                        style={{ width: "100%", display: "block", maxHeight: 210, objectFit: "cover", objectPosition: "top" }}
                    />
                </div>

                <div style={{ border: "1px solid #d1fae5", borderRadius: 10, padding: "14px 16px", background: "#f0fdfa" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#0f3d38", marginBottom: 4 }}>{active.title}</div>
                    <div style={{ fontSize: 13, color: "#3d7a72", lineHeight: 1.65 }}>{active.desc}</div>
                </div>

                {/* Dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 18 }}>
                    {MOBILE_FEATURES.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            style={{
                                width: activeIdx === i ? 18 : 6, height: 6, borderRadius: 100,
                                background: activeIdx === i ? "#0d9488" : "#99f6e4",
                                cursor: "pointer", transition: "all 0.22s ease",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP VERSION
───────────────────────────────────────────────────────────── */
function DesktopShowcase() {
    const [active, setActive] = useState("tasks");

    return (
        <div style={{ padding: "88px 80px", background: "#f0fdfa", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #d1fae5" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
                @keyframes fadeUpDesk { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div style={{ maxWidth: 960, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#2d8a81", marginBottom: 14 }}>
                        Product walkthrough
                    </div>
                    <h2 style={{
                        fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 300,
                        letterSpacing: "-2px", color: "#0f3d38",
                        lineHeight: 1.06, marginBottom: 14, maxWidth: 560,
                    }}>
                        A closer look at every feature,{" "}
                        <em style={{ fontStyle: "italic", color: "#2d8a81" }}>built for how teams actually work.</em>
                    </h2>
                    <p style={{ fontSize: 15, color: "#3d7a72", lineHeight: 1.7, maxWidth: 460 }}>
                        From smart task boards to real-time chat and one-click meetings — here's what TaskQube looks like in the real world.
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 32, borderBottom: "1px solid #d1fae5", paddingBottom: 0 }}>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            style={{
                                padding: "9px 18px", border: "none", background: "none", cursor: "pointer",
                                fontSize: 13, fontWeight: active === tab.id ? 500 : 400,
                                color: active === tab.id ? "#0f3d38" : "#2d8a81",
                                fontFamily: "'DM Sans', sans-serif",
                                borderBottom: `2px solid ${active === tab.id ? "#0d9488" : "transparent"}`,
                                marginBottom: "-1px",
                                transition: "color 0.15s",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Panel */}
                <div key={active} style={{ animation: "fadeUpDesk 0.3s ease both" }}>
                    {PANEL_MAP[active]}
                </div>
            </div>
        </div>
    );
}

export default function ShowcaseSection() {
    const isMobile = useIsMobile(768);
    return isMobile ? <MobileShowcase /> : <DesktopShowcase />;
}