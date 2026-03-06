import { useState } from "react";
import { StudentAvatar, TeamAvatar } from "./Avatars";
import { SAMPLE_STUDENTS } from "../data/students";
import MetricItem from "./MetricItem";
import Icons from "./Icons";

function daysSince(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}
function sessionDateColor(days) {
  if (days < 30) return "#00e6c3";
  if (days < 60) return "#fbbf24";
  return "#ff3467";
}

function TutorTab({ students = SAMPLE_STUDENTS, onStudentClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tutorFilter, setTutorFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const uniqueTutors = [...new Set(students.map(s => s.tutor))];

  const filtered = students.filter(s => {
    const matchSearch = searchTerm === "" || `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.highSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTutor = tutorFilter === "all" || s.tutor === tutorFilter;
    const matchYear = gradYearFilter === "all" || s.gradYear === parseInt(gradYearFilter);
    return matchSearch && matchTutor && matchYear;
  }).sort((a, b) => {
    let va, vb;
    if (sortBy === "name") { va = `${a.lastName} ${a.firstName}`; vb = `${b.lastName} ${b.firstName}`; }
    else if (sortBy === "sessions") { va = a.tutorSessions; vb = b.tutorSessions; }
    else if (sortBy === "hours") { va = a.tutorHoursUsed; vb = b.tutorHoursUsed; }
    else if (sortBy === "lastSession") { va = a.tutorLastSession || ""; vb = b.tutorLastSession || ""; }
    else if (sortBy === "act") { va = a.actComposite || 0; vb = b.actComposite || 0; }
    else { va = a.satTotal || 0; vb = b.satTotal || 0; }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="p-6">
      {/* Filter row */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <input type="text" placeholder="Search by name or school..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4", minWidth: 200 }} />
        <select value={tutorFilter} onChange={e => setTutorFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
          <option value="all">All Tutors</option>
          {uniqueTutors.map(t => <option key={t} value={t}>{t}</option>)}
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
            <option value="act">Sort: ACT Score</option>
            <option value="sat">Sort: SAT Score</option>
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
        {filtered.map(student => {
          const lastDays = daysSince(student.tutorLastSession);
          const hoursRemaining = student.tutorHoursTotal - student.tutorHoursUsed;
          return (
            <div key={student.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              {/* Row 1: Avatar + name + team + tutor hours */}
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
                {/* Tutor hours */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>TUTOR HRS</p>
                  <p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.tutorHoursUsed}/{student.tutorHoursTotal}</p>
                  <div className="w-16 h-1 rounded-full mt-1" style={{ backgroundColor: "#e5e0f0" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (student.tutorHoursUsed / student.tutorHoursTotal) * 100)}%`, backgroundColor: "#8e7bb7" }} />
                  </div>
                </div>
              </div>

              {/* Row 2: Metric items */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
                <MetricItem label="Sessions" value={student.tutorSessions} />
                <MetricItem label="Last Session" value={student.tutorLastSession || "None yet"} color={student.tutorLastSession ? sessionDateColor(lastDays) : "#ff3467"} />
                <MetricItem label="Next Session" value={student.tutorNextSession || "NOT BOOKED"} color={!student.tutorNextSession ? "#ff3467" : undefined} />
                <MetricItem label="Hrs Remaining" value={hoursRemaining.toFixed(1)} color={hoursRemaining <= 2 ? "#ff3467" : hoursRemaining <= 5 ? "#fbbf24" : undefined} />
              </div>

              {/* Row 3: Scores + focus/notes */}
              <div className="flex gap-4">
                {/* Scores */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>TEST SCORES & GPA</p>
                  <div className="flex flex-wrap gap-2">
                    {student.actComposite && (
                      <div className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#e8f4f8", color: "#42778c", border: "1px solid #b8dde8" }}>
                        ACT <span className="text-base font-bold" style={{ color: "#281d51" }}>{student.actComposite}</span>
                      </div>
                    )}
                    {student.satTotal && (
                      <div className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#f0ece8", color: "#55478f", border: "1px solid #c0bad4" }}>
                        SAT <span className="text-base font-bold" style={{ color: "#281d51" }}>{student.satTotal}</span>
                      </div>
                    )}
                    {student.gpaUnweighted && (
                      <div className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "#e8faf5", color: "#2d8a70", border: "1px solid #a0e0cc" }}>
                        GPA <span className="text-base font-bold" style={{ color: "#281d51" }}>{student.gpaUnweighted}</span>
                        {student.gpaWeighted && <span className="ml-1 font-normal" style={{ color: "#b2b2b2" }}>/ {student.gpaWeighted}W</span>}
                      </div>
                    )}
                    {student.apClasses && student.apClasses.length > 0 && (
                      <div className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: "#f8f7fc", color: "#474747", border: "1px solid #e5e0f0" }}>
                        {student.apClasses.length} AP class{student.apClasses.length !== 1 ? "es" : ""}
                      </div>
                    )}
                  </div>
                </div>
                {/* Focus / Notes column */}
                <div className="flex-shrink-0 pl-4" style={{ width: 300, borderLeft: "1px solid #e5e0f0" }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>CURRENT FOCUS</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#474747" }}>{student.tutorFocus || "No focus noted"}</p>
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

export default TutorTab;
