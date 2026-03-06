import { useState } from "react";
import { StudentAvatar, TeamAvatar } from "./Avatars";
import { SAMPLE_STUDENTS } from "../data/students";
import { STATUS_COLORS } from "../data/constants";
import MetricItem from "./MetricItem";
import Icons from "./Icons";

// Essay-specific milestone labels and SVG path icons
const ESSAY_MILESTONES = [
  { label: "PS Workshop", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3" },
  { label: "PS Topic", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { label: "PS Draft 1", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "PS Complete", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Supp Strategy", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { label: "Supp Workshop", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
  { label: "App Review", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { label: "All Essays Done", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
];

// Deterministic milestone status per student
function getEssayStatus(studentIdx, milestoneIdx) {
  const hoursRatio = SAMPLE_STUDENTS[studentIdx]
    ? SAMPLE_STUDENTS[studentIdx].essayHoursUsed / (SAMPLE_STUDENTS[studentIdx].essayHoursTotal || 1)
    : 0;
  const threshold = milestoneIdx / ESSAY_MILESTONES.length;
  if (hoursRatio > threshold + 0.15) return "completed";
  if (hoursRatio > threshold - 0.1) return "in-progress";
  return "not-started";
}

function daysSince(dateStr) {
  if (!dateStr) return 999;
  const d = new Date(dateStr);
  return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
}
function sessionDateColor(days) {
  if (days < 30) return "#00e6c3";
  if (days < 60) return "#fbbf24";
  return "#ff3467";
}

function EssayCoachTab({ students = SAMPLE_STUDENTS, onStudentClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [coachFilter, setCoachFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [activeTip, setActiveTip] = useState(null);

  const uniqueCoaches = [...new Set(students.map(s => s.essayCoach))];

  const filtered = students.filter(s => {
    const matchSearch = searchTerm === "" || `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.highSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCoach = coachFilter === "all" || s.essayCoach === coachFilter;
    const matchYear = gradYearFilter === "all" || s.gradYear === parseInt(gradYearFilter);
    return matchSearch && matchCoach && matchYear;
  }).sort((a, b) => {
    let va, vb;
    if (sortBy === "name") { va = `${a.lastName} ${a.firstName}`; vb = `${b.lastName} ${b.firstName}`; }
    else if (sortBy === "sessions") { va = a.essaySessions; vb = b.essaySessions; }
    else if (sortBy === "hours") { va = a.essayHoursUsed; vb = b.essayHoursUsed; }
    else if (sortBy === "lastSession") { va = a.essayLastSession || ""; vb = b.essayLastSession || ""; }
    else { va = a.essayNextSession || "zzz"; vb = b.essayNextSession || "zzz"; }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="p-6">
      {/* Filter row */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <input type="text" placeholder="Search by name or school..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4", minWidth: 200 }} />
        <select value={coachFilter} onChange={e => setCoachFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
          <option value="all">All Essay Coaches</option>
          {uniqueCoaches.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1.5">
          {[2025, 2026, 2027].map(year => (
            <button key={year} onClick={() => setGradYearFilter(gradYearFilter === year.toString() ? "all" : year.toString())} className="px-2.5 py-1 rounded-full text-xs font-medium transition-all" style={{ backgroundColor: gradYearFilter === year.toString() ? "#55478f" : "#e5e0f0", color: gradYearFilter === year.toString() ? "white" : "#474747" }}>{year}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
            <option value="name">Sort: Name</option>
            <option value="sessions">Sort: Sessions</option>
            <option value="hours">Sort: Hours Used</option>
            <option value="lastSession">Sort: Last Session</option>
            <option value="nextSession">Sort: Next Session</option>
          </select>
          <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")} className="px-3 py-1.5 border rounded-lg text-xs font-medium" style={{ borderColor: "#c0bad4", color: "#281d51" }}>
            {sortDir === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
        </div>
      </div>

      {/* Student cards */}
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg font-semibold mb-1" style={{ color: "#281d51" }}>No students found</p>
            <p className="text-sm" style={{ color: "#b2b2b2" }}>Try adjusting your search or filters.</p>
          </div>
        )}
        {filtered.map((student) => {
          const sIdx = SAMPLE_STUDENTS.indexOf(student);
          const lastDays = daysSince(student.essayLastSession);
          return (
            <div key={student.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              {/* Row 1: Avatar + name + team + hours */}
              <div className="flex items-start gap-4 mb-3">
                <StudentAvatar student={student} size={44} />
                <div className="flex-1 min-w-0">
                  <button onClick={() => onStudentClick && onStudentClick(student)} className="font-bold text-base text-left hover:underline" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</button>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-xs" style={{ color: "#b2b2b2" }}>{student.highSchool} • Class of {student.gradYear} • {student.major}</p>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded" style={{ color: "#8e7bb7" }}><Icons.Email /></button>
                      <button className="p-1 hover:bg-gray-100 rounded" style={{ color: "#8e7bb7" }}><Icons.Info /></button>
                    </div>
                  </div>
                </div>
                {/* Team avatars */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>TEAM</p>
                  <div className="flex items-center justify-end">
                    {[
                      { name: student.counselor, role: "Counselor", color: "#55478f" },
                      { name: student.essayCoach, role: "Essay Coach", color: "#42778c" },
                      { name: student.tutor, role: "Tutor", color: "#8e7bb7" },
                    ].map((m, i) => (
                      <div key={i} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                        <TeamAvatar name={m.name} role={m.role} size={32} color={m.color} style={{ border: "2px solid white" }} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Essay hours */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>ESSAY HRS</p>
                  <p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.essayHoursUsed}/{student.essayHoursTotal}</p>
                  <div className="w-16 h-1 rounded-full mt-1" style={{ backgroundColor: "#e5e0f0" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (student.essayHoursUsed / student.essayHoursTotal) * 100)}%`, backgroundColor: "#42778c" }} />
                  </div>
                </div>
              </div>

              {/* Row 2: Metric items */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
                <MetricItem label="Sessions" value={student.essaySessions} />
                <MetricItem label="Last Session" value={student.essayLastSession || "None yet"} color={student.essayLastSession ? sessionDateColor(lastDays) : "#ff3467"} />
                <MetricItem label="Next Session" value={student.essayNextSession || "NOT BOOKED"} color={!student.essayNextSession ? "#ff3467" : undefined} />
              </div>

              {/* Row 3: Essay milestone timeline + focus/notes */}
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>ESSAY MILESTONES</p>
                  <div className="flex items-center flex-wrap" style={{ gap: 2 }}>
                    {ESSAY_MILESTONES.map((m, mIdx) => {
                      const status = getEssayStatus(sIdx >= 0 ? sIdx : 0, mIdx);
                      const color = STATUS_COLORS[status] || "#c0bad4";
                      const strokeColor = status === "not-started" ? "#8e7bb7" : "#ffffff";
                      const tipKey = `${student.id}-essay-${mIdx}`;
                      const isActive = activeTip === tipKey;
                      return (
                        <div key={mIdx} className="relative flex items-center justify-center" style={{ width: 46, height: 40 }}
                          onMouseEnter={() => setActiveTip(tipKey)}
                          onMouseLeave={() => setActiveTip(null)}>
                          <div style={{ position: "absolute", top: "50%", left: "50%", width: mIdx < ESSAY_MILESTONES.length - 1 ? 46 : 18, height: 2, backgroundColor: "#e5e0f0", transform: "translateY(-50%)", zIndex: 0 }} />
                          <div className="rounded-full flex items-center justify-center cursor-pointer" style={{
                            width: 32, height: 32, backgroundColor: color, position: "relative", zIndex: 1,
                            opacity: isActive ? 1 : 0.75,
                            transform: isActive ? "scale(1.3)" : "scale(1)",
                            transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease-out",
                            boxShadow: isActive ? "0 3px 10px rgba(40,29,81,0.3)" : "none",
                          }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke={strokeColor} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d={m.icon} />
                            </svg>
                          </div>
                          {isActive && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg shadow-lg text-xs whitespace-nowrap z-50" style={{ backgroundColor: "#281d51", color: "#ffffff" }}>
                              <p className="font-semibold">{m.label}</p>
                              <p style={{ color: "#c0bad4" }}>{status.replace("-", " ")}</p>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #281d51" }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Focus / Notes column */}
                <div className="flex-shrink-0 pl-4" style={{ width: 300, borderLeft: "1px solid #e5e0f0" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>CURRENT FOCUS</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#474747" }}>{student.essayFocus || "No focus noted"}</p>
                  {student.notes && (
                    <>
                      <p className="text-xs font-semibold mt-2 mb-1" style={{ color: "#b2b2b2" }}>NOTES</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#474747" }}>{student.notes}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of {students.length} students</p>
      </div>
    </div>
  );
}

export default EssayCoachTab;
