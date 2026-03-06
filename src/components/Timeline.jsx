import { useState } from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../data/constants";

// Timeline with single-dot hover effect
function Timeline({ items, onDotClick }) {
  const [activeTip, setActiveTip] = useState(null);

  return (
    <div className="flex flex-wrap items-center" style={{ gap: 4, minHeight: 38 }}>
      {items.map((item, idx) => {
        const isActive = activeTip === idx;
        const color = STATUS_COLORS[item.status] || "#c0bad4";
        return (
          <div
            key={idx}
            className="relative flex items-center justify-center"
            style={{ width: 30, height: 38, zIndex: isActive ? 50 : 1 }}
            onMouseEnter={() => setActiveTip(idx)}
            onMouseLeave={() => setActiveTip(null)}
            onClick={() => onDotClick && onDotClick(items, idx)}
          >
            <div style={{ position: "absolute", top: "50%", left: "50%", width: idx < items.length - 1 ? 30 : 15, height: 2, backgroundColor: "#e5e0f0", transform: "translateY(-50%)", zIndex: 0 }} />
            <div
              className="rounded-full flex items-center justify-center cursor-pointer"
              style={{
                width: 26, height: 26, backgroundColor: color, position: "relative", zIndex: 1,
                opacity: isActive ? 1 : 0.7,
                transform: isActive ? "scale(1.46)" : "scale(1)",
                transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease-out, opacity 0.2s ease-out",
                boxShadow: isActive ? "0 3px 10px rgba(40,29,81,0.3)" : "none",
              }}
            >
              {isActive ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="#ffffff" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke={item.status === "not-started" || item.status === "opted-out" ? "#8e7bb7" : "#ffffff"} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
              )}
            </div>
            {isActive && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap z-50" style={{ backgroundColor: "#281d51", color: "#ffffff" }}>
                <p className="font-semibold">{item.name}</p>
                <p style={{ color: "#c0bad4" }}>{STATUS_LABELS[item.status]} • Due {item.dueDate}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #281d51" }} />
              </div>
            )}
          </div>
        );
      })}
      <div style={{ flexShrink: 0, marginLeft: -2 }}>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none"><path d="M1 1L8 7L1 13" stroke="#c0bad4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

export default Timeline;
