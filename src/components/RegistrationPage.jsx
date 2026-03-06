import { useState } from "react";

const SAMPLE_EVENTS = [
  { id: 1, name: "College Application Workshop - Common App Basics", dateTime: "2026-03-15 10:00 AM", profile: "Amanda Yoder", type: "Workshop", registered: 18, attended: 15 },
  { id: 2, name: "SAT Prep - Math Strategies Session 1", dateTime: "2026-03-14 2:00 PM", profile: "Ian Simon", type: "Tutoring", registered: 8, attended: 7 },
  { id: 3, name: "Essay Brainstorming Workshop", dateTime: "2026-03-13 3:30 PM", profile: "Chris Bench", type: "Essay", registered: 12, attended: 10 },
  { id: 4, name: "Financial Aid & FAFSA Overview", dateTime: "2026-03-12 6:00 PM", profile: "Don Keller", type: "Workshop", registered: 25, attended: 22 },
  { id: 5, name: "Junior Kickoff Meeting - Class of 2028", dateTime: "2026-03-11 4:00 PM", profile: "Allison Dahleen", type: "Workshop", registered: 30, attended: 28 },
  { id: 6, name: "ACT Prep - Science Section Review", dateTime: "2026-03-10 2:00 PM", profile: "Ian Simon", type: "Tutoring", registered: 6, attended: 5 },
  { id: 7, name: "College List Building Workshop", dateTime: "2026-03-08 11:00 AM", profile: "Amanda Yoder", type: "Workshop", registered: 14, attended: 12 },
  { id: 8, name: "Personal Statement Writing Workshop", dateTime: "2026-03-07 3:00 PM", profile: "Chris Bench", type: "Essay", registered: 16, attended: 14 },
  { id: 9, name: "Scholarship Strategy Session", dateTime: "2026-03-06 5:00 PM", profile: "Raymond Gonzales", type: "Workshop", registered: 20, attended: 17 },
  { id: 10, name: "SAT Prep - Reading Comprehension", dateTime: "2026-03-05 2:00 PM", profile: "Ian Simon", type: "Tutoring", registered: 7, attended: 6 },
  { id: 11, name: "Resume Building for College Apps", dateTime: "2026-03-04 4:00 PM", profile: "Allison Dahleen", type: "Workshop", registered: 11, attended: 9 },
  { id: 12, name: "Supplemental Essay Strategies", dateTime: "2026-03-03 3:00 PM", profile: "Chris Bench", type: "Essay", registered: 13, attended: 11 },
  { id: 13, name: "Parent Info Night - Senior Year Timeline", dateTime: "2026-03-01 7:00 PM", profile: "Don Keller", type: "Workshop", registered: 35, attended: 31 },
  { id: 14, name: "Mock College Interview Practice", dateTime: "2026-02-28 10:00 AM", profile: "Amanda Yoder", type: "Workshop", registered: 8, attended: 8 },
  { id: 15, name: "ACT Prep - English & Grammar", dateTime: "2026-02-27 2:00 PM", profile: "Ian Simon", type: "Tutoring", registered: 9, attended: 7 },
  { id: 16, name: "College Decision Day Prep", dateTime: "2026-02-26 4:00 PM", profile: "Allison Dahleen", type: "Workshop", registered: 22, attended: 19 },
  { id: 17, name: "Recommendation Letter Strategy Session", dateTime: "2026-02-25 3:00 PM", profile: "Raymond Gonzales", type: "Workshop", registered: 10, attended: 8 },
  { id: 18, name: "SAT Prep - Full Practice Test", dateTime: "2026-02-22 9:00 AM", profile: "Ian Simon", type: "Tutoring", registered: 12, attended: 11 },
  { id: 19, name: "Application Review Workshop", dateTime: "2026-02-20 3:30 PM", profile: "Amanda Yoder", type: "Workshop", registered: 15, attended: 13 },
  { id: 20, name: "Early Decision vs Early Action Workshop", dateTime: "2026-02-18 5:00 PM", profile: "Don Keller", type: "Workshop", registered: 18, attended: 16 },
  { id: 21, name: "Summer Program Planning", dateTime: "2026-04-01 4:00 PM", profile: "Allison Dahleen", type: "Workshop", registered: 10, attended: 0 },
  { id: 22, name: "AP Exam Prep - Overview", dateTime: "2026-04-05 2:00 PM", profile: "Ian Simon", type: "Tutoring", registered: 14, attended: 0 },
  { id: 23, name: "Senior Year Checklist Workshop", dateTime: "2026-04-10 3:00 PM", profile: "Amanda Yoder", type: "Workshop", registered: 20, attended: 0 },
];

const ATTENDEES = [
  { name: "Aguilar Villalobos, Daniela", status: "Attended" },
  { name: "Hart, Madelyn", status: "Attended" },
  { name: "Kumar, Maya", status: "Attended" },
  { name: "Chen, William", status: "No Show" },
  { name: "Rodriguez, Sofia", status: "Attended" },
  { name: "Thompson, James", status: "Cancelled" },
  { name: "Patel, Ananya", status: "Attended" },
  { name: "Williams, Jordan", status: "Attended" },
];

export default function RegistrationPage() {
  const [startDate, setStartDate] = useState("2026-02-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedEvent, setExpandedEvent] = useState(null);

  const filtered = SAMPLE_EVENTS
    .filter((e) => {
      if (search.length >= 2) {
        const q = search.toLowerCase();
        return e.name.toLowerCase().includes(q) || e.profile.toLowerCase().includes(q);
      }
      return true;
    })
    .filter((e) => {
      const eventDate = new Date(e.dateTime);
      const now = new Date("2026-03-06");
      if (!showUpcoming && eventDate > now) return false;
      if (startDate && eventDate < new Date(startDate)) return false;
      if (endDate && eventDate > new Date(endDate + "T23:59:59")) return false;
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.dateTime);
      const db = new Date(b.dateTime);
      return sortOrder === "newest" ? db - da : da - db;
    });

  const getAttendanceColor = (registered, attended) => {
    if (attended === 0) return "#b2b2b2";
    const rate = attended / registered;
    if (rate >= 0.9) return "#00e6c3";
    if (rate >= 0.7) return "#fbbf24";
    return "#ff3467";
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Workshop": return { bg: "#55478f", text: "#fff" };
      case "Tutoring": return { bg: "#42778c", text: "#fff" };
      case "Essay": return { bg: "#8e7bb7", text: "#fff" };
      default: return { bg: "#c0bad4", text: "#281d51" };
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-5 mb-6" style={{ border: "1px solid #e5e0f0" }}>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }} />
          </div>
          <label className="flex items-center gap-2 pb-2 cursor-pointer">
            <input type="checkbox" checked={showUpcoming} onChange={(e) => setShowUpcoming(e.target.checked)} className="rounded" style={{ accentColor: "#55478f" }} />
            <span className="text-sm" style={{ color: "#474747" }}>Show upcoming events</span>
          </label>
          <div className="flex-1 min-w-48">
            <input type="text" placeholder="Search by title or profile name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>Sort</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
              <option value="newest">Date Newest First</option>
              <option value="oldest">Date Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: "#b2b2b2" }}>
        Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Event cards */}
      <div className="space-y-3">
        {filtered.map((event) => {
          const isExpanded = expandedEvent === event.id;
          const isUpcoming = event.attended === 0;
          const badge = getTypeBadgeColor(event.type);
          const attendanceColor = getAttendanceColor(event.registered, event.attended);

          return (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden transition-all" style={{ border: "1px solid #e5e0f0" }}>
              <button
                onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <svg style={{ width: 16, height: 16, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" stroke="#b2b2b2" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold truncate" style={{ color: "#281d51" }}>{event.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0" style={{ backgroundColor: badge.bg, color: badge.text }}>{event.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "#b2b2b2" }}>
                      <span>{new Date(event.dateTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} at {event.dateTime.split(" ").slice(-2).join(" ")}</span>
                      <span>•</span>
                      <span style={{ color: "#42778c" }}>{event.profile}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  {isUpcoming ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Upcoming</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: attendanceColor }} />
                      <span className="text-sm font-semibold" style={{ color: attendanceColor }}>
                        {event.attended}/{event.registered} attended
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-4" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <div className="pt-4">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>Event Name</p>
                        <p className="text-sm" style={{ color: "#474747" }}>{event.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>Date & Time</p>
                        <p className="text-sm" style={{ color: "#474747" }}>{event.dateTime}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>Profile</p>
                        <p className="text-sm font-medium" style={{ color: "#42778c" }}>{event.profile}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>Type</p>
                        <p className="text-sm" style={{ color: "#474747" }}>{event.type}</p>
                      </div>
                    </div>

                    {!isUpcoming && (
                      <>
                        <p className="text-xs font-semibold mb-2" style={{ color: "#281d51" }}>ATTENDEES</p>
                        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
                          <table className="w-full text-sm">
                            <thead>
                              <tr style={{ backgroundColor: "#f8f7fc" }}>
                                <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: "#b2b2b2" }}>Student</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: "#b2b2b2" }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ATTENDEES.slice(0, Math.min(event.registered, ATTENDEES.length)).map((a, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #e5e0f0" }}>
                                  <td className="px-4 py-2 font-medium" style={{ color: "#42778c" }}>{a.name}</td>
                                  <td className="px-4 py-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{
                                      backgroundColor: a.status === "Attended" ? "#d1fae5" : a.status === "No Show" ? "#fde2e8" : "#fef3c7",
                                      color: a.status === "Attended" ? "#065f46" : a.status === "No Show" ? "#9b1c31" : "#92400e"
                                    }}>
                                      {a.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {isUpcoming && (
                      <div className="rounded-lg p-4" style={{ backgroundColor: "#f8f7fc" }}>
                        <p className="text-sm" style={{ color: "#b2b2b2" }}>
                          {event.registered} student{event.registered !== 1 ? "s" : ""} registered. Attendance will be tracked after the event.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center" style={{ border: "1px solid #e5e0f0" }}>
          <p className="text-lg font-semibold mb-2" style={{ color: "#281d51" }}>No events found</p>
          <p className="text-sm" style={{ color: "#b2b2b2" }}>Try adjusting your date range or search terms.</p>
        </div>
      )}
    </div>
  );
}
