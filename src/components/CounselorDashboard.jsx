import { useState } from "react";
import { StudentAvatar, TeamAvatar } from "./Avatars";
import { STATUS_COLORS } from "../data/constants";
import { TASK_MILESTONES, WORKSHOPS } from "../data/milestones";
import { TASK_ICONS, WORKSHOP_ICONS } from "../data/constants";
import { SAMPLE_STUDENTS } from "../data/students";
import { generateTaskStatus, generateWorkshopStatus, getTaskDueDate, getEffectiveStatus } from "../utils/status";
import Timeline from "./Timeline";
import Icons from "./Icons";
import MetricItem from "./MetricItem";

function CounselorDashboard({ students, onStudentClick, onDotClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === "TBD" || dateStr === "NOT BOOKED") return null;
    return new Date(dateStr);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.highSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounselor = counselorFilter === "all" || s.counselor === counselorFilter;
    const matchesGradYear = gradYearFilter === "all" || s.gradYear === parseInt(gradYearFilter);
    return matchesSearch && matchesCounselor && matchesGradYear;
  }).sort((a, b) => {
    let valA, valB;
    switch (sortBy) {
      case "meetings": valA = a.meetings; valB = b.meetings; break;
      case "lastMeeting": valA = parseDate(a.lastMeeting); valB = parseDate(b.lastMeeting); break;
      case "nextContact": valA = parseDate(a.nextContact); valB = parseDate(b.nextContact); break;
      case "nextMeeting": valA = parseDate(a.nextMeeting); valB = parseDate(b.nextMeeting); break;
      case "nextWorkshop": valA = a.nextWorkshop === "NOT BOOKED" ? null : parseDate(a.nextWorkshopDate); valB = b.nextWorkshop === "NOT BOOKED" ? null : parseDate(b.nextWorkshopDate); break;
      case "hoursUsed": valA = a.counselorHoursUsed; valB = b.counselorHoursUsed; break;
      case "hoursTotal": valA = a.counselorHoursTotal; valB = b.counselorHoursTotal; break;
      case "hoursRemaining": valA = a.counselorHoursTotal - a.counselorHoursUsed; valB = b.counselorHoursTotal - b.counselorHoursUsed; break;
      default: valA = `${a.lastName} ${a.firstName}`.toLowerCase(); valB = `${b.lastName} ${b.firstName}`.toLowerCase();
    }
    if (valA == null && valB == null) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const getStatusColor = (days) => {
    if (days < 30) return "#00e6c3";
    if (days < 60) return "#fbbf24";
    return "#ff3467";
  };

  const daysSince = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return Math.floor((today - date) / (1000 * 60 * 60 * 24));
  };

  const uniqueCounselors = [...new Set(students.map((s) => s.counselor))];

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <input type="text" placeholder="Search by name or school..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4", minWidth: 200 }} />
        <select value={counselorFilter} onChange={(e) => setCounselorFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
          <option value="all">All Counselors</option>
          {uniqueCounselors.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <div className="flex gap-1.5">
          {[2025, 2026, 2027].map((year) => (
            <button key={year} onClick={() => setGradYearFilter(gradYearFilter === year.toString() ? "all" : year.toString())} className="px-2.5 py-1 rounded-full text-xs font-medium transition-all" style={{ backgroundColor: gradYearFilter === year.toString() ? "#55478f" : "#e5e0f0", color: gradYearFilter === year.toString() ? "white" : "#474747" }}>{year}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
            <option value="name">Sort: Name</option>
            <option value="meetings">Sort: Meetings</option>
            <option value="lastMeeting">Sort: Last Meeting</option>
            <option value="nextContact">Sort: Next Contact</option>
            <option value="nextMeeting">Sort: Next Meeting</option>
            <option value="nextWorkshop">Sort: Next Workshop</option>
            <option value="hoursUsed">Sort: Used Hours</option>
            <option value="hoursTotal">Sort: Total Hours</option>
            <option value="hoursRemaining">Sort: Hours Remaining</option>
          </select>
          <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")} className="px-3 py-1.5 border rounded-lg text-xs font-medium transition-all" style={{ borderColor: "#c0bad4", color: "#281d51" }}>
            {sortDir === "asc" ? "\u2191 Asc" : "\u2193 Desc"}
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg font-semibold mb-1" style={{ color: "#281d51" }}>No students found</p>
            <p className="text-sm" style={{ color: "#b2b2b2" }}>Try adjusting your search or filters.</p>
          </div>
        )}
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            {/* Row 1: Student info + team + hours + notes */}
            <div className="flex items-start gap-4 mb-3">
              <StudentAvatar student={student} size={44} />
              <div className="flex-1 min-w-0">
                <button onClick={() => onStudentClick(student)} className="font-bold text-base hover:opacity-80 transition-opacity text-left" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</button>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-xs" style={{ color: "#b2b2b2" }}>{student.highSchool} • Class of {student.gradYear}</p>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded" style={{ color: "#8e7bb7" }}><Icons.Email /></button>
                    <button className="p-1 hover:bg-gray-100 rounded" style={{ color: "#8e7bb7" }}><Icons.Info /></button>
                  </div>
                </div>
              </div>
              {/* Team member circles */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>TEAM</p>
                <div className="flex items-center justify-end">
                  {[
                    { name: student.counselor, role: "Counselor", color: "#55478f" },
                    { name: student.essayCoach, role: "Essay Coach", color: "#42778c" },
                    { name: student.tutor, role: "Tutor", color: "#8e7bb7" },
                  ].map((member, i) => (
                    <div key={i} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                      <TeamAvatar name={member.name} role={member.role} size={32} color={member.color} style={{ border: "2px solid white" }} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Hours compact */}
              <div className="text-right" style={{ flexShrink: 0 }}>
                <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>HOURS</p>
                <p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.counselorHoursUsed}/{student.counselorHoursTotal}</p>
                <div className="w-16 h-1 rounded-full mt-1" style={{ backgroundColor: "#e5e0f0" }}>
                  <div className="h-full rounded-full" style={{ width: `${(student.counselorHoursUsed / student.counselorHoursTotal) * 100}%`, backgroundColor: "#00e6c3" }} />
                </div>
              </div>
            </div>
            {/* Row 2: Metric items */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
              <MetricItem label="Meetings" value={student.meetings} />
              <MetricItem label="Last Meeting" value={student.lastMeeting} color={getStatusColor(daysSince(student.lastMeeting))} />
              <MetricItem label="Next Contact" value={student.nextContact} />
              <MetricItem label="Next Meeting" value={student.nextMeeting || "TBD"} />
              <MetricItem label="Next Workshop" value={student.nextWorkshop === "NOT BOOKED" ? "NOT BOOKED" : student.nextWorkshop} color={student.nextWorkshop === "NOT BOOKED" ? "#ff3467" : undefined} />
            </div>
            {/* Row 3: Timelines + Notes side by side */}
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>TASKS</p>
                  <Timeline items={TASK_MILESTONES.map((task, tIdx) => {
                    const sIdx = SAMPLE_STUDENTS.indexOf(student);
                    const raw = generateTaskStatus(sIdx, tIdx);
                    const due = getTaskDueDate(tIdx, student.gradYear);
                    const status = getEffectiveStatus(raw, due);
                    return { icon: TASK_ICONS[tIdx], status, name: task, dueDate: due };
                  })} onDotClick={onDotClick ? (items, idx) => onDotClick(student, items, idx, "task") : undefined} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>WORKSHOPS</p>
                  <Timeline items={WORKSHOPS.map((ws, wIdx) => {
                    const sIdx = SAMPLE_STUDENTS.indexOf(student);
                    const raw = generateWorkshopStatus(sIdx, wIdx);
                    const due = getTaskDueDate(wIdx, student.gradYear);
                    const status = getEffectiveStatus(raw, due);
                    return { icon: WORKSHOP_ICONS[wIdx], status, name: ws, dueDate: due };
                  })} onDotClick={onDotClick ? (items, idx) => onDotClick(student, items, idx, "workshop") : undefined} />
                </div>
              </div>
              {/* Notes column */}
              <div className="flex-shrink-0 pl-4" style={{ width: 300, borderLeft: "1px solid #e5e0f0" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>NOTES</p>
                <p className="text-xs leading-relaxed" style={{ color: "#474747" }}>{student.notes || "No notes"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: "#b2b2b2" }}>Showing 1-{filteredStudents.length} of {students.length} students</p>
      </div>
    </div>
  );
}

export default CounselorDashboard;
