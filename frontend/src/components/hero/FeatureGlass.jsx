/**
 * FeatureGlass.jsx
 * Vertical tab list on the left side of the glass card.
 * Preview panel on the right.
 * Chat is open by default so users immediately see the interaction.
 */

import { useState, useEffect } from "react";
import { FEATURES } from "./featureData";
import {
  ChatPreview,
  TasksPreview,
  NotesPreview,
  PresencePreview,
  MeetPreview,
  RequestsPreview,
} from "./FeaturePreview";

function PreviewFor({ id }) {
  switch (id) {
    case "chat":     return <ChatPreview />;
    case "tasks":    return <TasksPreview />;
    case "notes":    return <NotesPreview />;
    case "presence": return <PresencePreview />;
    case "meet":     return <MeetPreview />;
    case "requests": return <RequestsPreview />;
    default:         return null;
  }
}

export default function FeatureGlass() {
  // Chat open by default — user immediately sees interaction
  const [activeId, setActiveId] = useState("chat");
  useEffect(() => {
  const interval = setInterval(() => {
    setActiveId((current) => {
      const currentIndex = FEATURES.findIndex(
        (feature) => feature.id === current
      );

      const nextIndex =
        currentIndex === FEATURES.length - 1
          ? 0
          : currentIndex + 1;

      return FEATURES[nextIndex].id;
    });
  }, 4500);

  return () => clearInterval(interval);
}, []);
  const active = FEATURES.find((f) => f.id === activeId);

  return (
    <div className="fg-wrap">
      <div className="fg-blob fg-blob--1" />
      <div className="fg-blob fg-blob--2" />

      <div className="fg-card">
        <div className="fg-shine" />

        <div className="fg-body">

          {/* ── LEFT — vertical tabs ── */}
          <div className="fg-tabs">
            <div className="fg-tabs-label">Features</div>

            {FEATURES.map((f) => {
              const isActive = activeId === f.id;
              return (
                <button
                  key={f.id}
                  className={`fg-tab${isActive ? " active" : ""}`}
                  style={isActive ? {
                    "--tab-accent":    f.accent,
                    "--tab-accent-bg": f.accentBg,
                  } : {}}
                  onClick={() => setActiveId(f.id)}
                >
                  {isActive && (
                    <span className="fg-tab-bar" style={{ background: f.accent }} />
                  )}
                  <span
                    className="fg-tab-icon"
                    style={{ color: isActive ? f.accent : undefined }}
                    dangerouslySetInnerHTML={{ __html: f.icon }}
                  />
                  <span className="fg-tab-label">{f.label}</span>

                  {/* Nudge dot on Tasks — signals "there's more to explore" */}
                  {f.id === "tasks" && activeId === "chat" && (
                    <span className="fg-hint-dot" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── RIGHT — preview pane ── */}
          <div className="fg-pane">
            {active && (
              <div key={active.id} className="fg-pane-inner">
                <div className="fg-pane-hdr">
                  <div
                    className="fg-pane-icon-wrap"
                    style={{ background: active.accentBg }}
                  >
                    <span
                      className="fg-pane-icon"
                      style={{ color: active.accent }}
                      dangerouslySetInnerHTML={{ __html: active.icon }}
                    />
                  </div>
                  <div>
                    <div className="fg-pane-title">{active.title}</div>
                    <div className="fg-pane-desc">{active.desc}</div>
                  </div>
                </div>

                <div className="fg-pane-divider" />

                <div className="fg-pane-preview">
                  <PreviewFor id={active.id} />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}