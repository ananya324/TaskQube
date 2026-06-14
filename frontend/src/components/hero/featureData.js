/**
 * featureData.js — single source of truth for all hero feature tabs
 */

export const FEATURES = [
  {
    id: "chat",
    label: "Chat",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    title: "Team Chat",
    desc: "Real-time messaging built in. No Slack tab, no context switching.",
    accent: "#0891b2",
    accentBg: "#e0f2fe",
    hint: true, // shows the "tap to explore" hint
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/></svg>`,
    title: "Task Board",
    desc: "Kanban with role-based assignment, priority labels and due dates.",
    accent: "#0d9488",
    accentBg: "#ccfbf1",
    hint: false,
  },
  {
    id: "notes",
    label: "Notes",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    title: "Shared Notes",
    desc: "Team-wide notes visible instantly. Decisions never get lost.",
    accent: "#7c3aed",
    accentBg: "#ede9fe",
    hint: false,
  },
  {
    id: "presence",
    label: "Active",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: "Live Presence",
    desc: "See who's online right now. No need to ping just to check.",
    accent: "#059669",
    accentBg: "#d1fae5",
    hint: false,
  },
  {
    id: "meet",
    label: "Meet",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    title: "Meetings",
    desc: "One-click Google Meet. Link appears in the workspace header instantly.",
    accent: "#dc2626",
    accentBg: "#fee2e2",
    hint: false,
  },
  {
    id: "requests",
    label: "Requests",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    title: "Join Requests",
    desc: "Teammates request to join. Admins accept or reject in one click.",
    accent: "#d97706",
    accentBg: "#fef3c7",
    hint: false,
  },
];