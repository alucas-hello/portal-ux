import { useState } from "react";
import { StudentAvatar } from "./Avatars";
import { STATUS_COLORS, STATUS_LABELS, TASK_ICONS, WORKSHOP_ICONS } from "../data/constants";
import { TASK_MILESTONES, WORKSHOPS } from "../data/milestones";
import { SAMPLE_STUDENTS } from "../data/students";
import { generateTaskStatus, generateWorkshopStatus, getTaskDueDate, getEffectiveStatus } from "../utils/status";

const DATE_STATUS_COLORS = { completed: "#00e6c3", "in-progress": "#fbbf24", "not-started": "#b2b2b2", behind: "#ff3467", "opted-out": "#b2b2b2", registered: "#42788c" };

function TasksTab({ students, activeRole, onDotClick, onStudentClick }) {
  const [activeTip, setActiveTip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [counselorFilter, setCounselorFilter] = useState(activeRole === "counselor" ? "Alex Morgan" : "all");
  const [essayCoachFilter, setEssayCoachFilter] = useState(activeRole === "essay-coach" ? "Taylor Reed" : "all");
  const [tutorFilter, setTutorFilter] = useState(activeRole === "tutor" ? "Jamie Park" : "all");

  const uniqueCounselors = [...new Set(students.map(s => s.counselor))];
  const uniqueCoaches = [...new Set(students.map(s => s.essayCoach))];
  const uniqueTutors = [...new Set(students.map(s => s.tutor))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = searchTerm === "" || `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.highSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = gradYearFilter === "all" || s.gradYear === parseInt(gradYearFilter);
    const matchesCounselor = counselorFilter === "all" || s.counselor === counselorFilter;
    const matchesCoach = essayCoachFilter === "all" || s.essayCoach === essayCoachFilter;
    const matchesTutor = tutorFilter === "all" || s.tutor === tutorFilter;
    return matchesSearch && matchesYear && matchesCounselor && matchesCoach && matchesTutor;
  });

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input type="text" placeholder="Search by name or school..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }} />
        {(activeRole === "admin" || activeRole === "counselor") && (
          <select value={counselorFilter} onChange={e => setCounselorFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
            <option value="all">All Counselors</option>
            {uniqueCounselors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {(activeRole === "admin" || activeRole === "essay-coach") && (
          <select value={essayCoachFilter} onChange={e => setEssayCoachFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
            <option value="all">All Essay Coaches</option>
            {uniqueCoaches.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {(activeRole === "admin" || activeRole === "tutor") && (
          <select value={tutorFilter} onChange={e => setTutorFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
            <option value="all">All Tutors</option>
            {uniqueTutors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <div className="flex gap-1.5">
          {[2025, 2026, 2027].map(year => (
            <button key={year} onClick={() => setGradYearFilter(gradYearFilter === year.toString() ? "all" : year.toString())} className="px-2.5 py-1 rounded-full text-xs font-medium transition-all" style={{ backgroundColor: gradYearFilter === year.toString() ? "#55478f" : "#e5e0f0", color: gradYearFilter === year.toString() ? "white" : "#474747" }}>{year}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #e5e0f0" }}>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00e6c3" }} /><span className="text-xs font-medium">Completed</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#42788c" }} /><span className="text-xs font-medium">Registered</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#fbbf24" }} /><span className="text-xs font-medium">In Progress</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#c0bad4" }} /><span className="text-xs font-medium">Not Started</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff3467" }} /><span className="text-xs font-medium">Behind Schedule</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#e5e0f0" }} /><span className="text-xs font-medium">Opted Out</span></div>
      </div>
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: "#281d51" }}>No students found</p>
          <p className="text-sm" style={{ color: "#b2b2b2" }}>Try adjusting your search or filters.</p>
        </div>
      )}
      <div className="grid gap-4">
        {filteredStudents.map((student) => {
          const sIdx = students.indexOf(student);
          const taskItems = TASK_MILESTONES.map((task, tIdx) => {
            const raw = generateTaskStatus(sIdx, tIdx);
            const due = getTaskDueDate(tIdx, student.gradYear);
            const status = getEffectiveStatus(raw, due);
            return { icon: TASK_ICONS[tIdx], status, name: task, dueDate: due };
          });
          const wsItems = WORKSHOPS.map((ws, wIdx) => {
            const raw = generateWorkshopStatus(sIdx, wIdx);
            const due = getTaskDueDate(wIdx, student.gradYear);
            const status = getEffectiveStatus(raw, due);
            return { icon: WORKSHOP_ICONS[wIdx], status, name: ws, dueDate: due };
          });
          const allItems = [...taskItems, ...wsItems];
          const completed = allItems.filter(i => i.status === "completed").length;
          const behind = allItems.filter(i => i.status === "behind").length;

          const renderTimeline = (items, prefix, typeLabel) => (
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>{typeLabel}</p>
              <div className="flex flex-wrap items-start justify-center" style={{ gap: 2, paddingBottom: 80 }}>
                {items.map((item, idx) => {
                  const tipKey = `${student.id}-${prefix}-${idx}`;
                  const isActive = activeTip === tipKey;
                  const color = STATUS_COLORS[item.status] || "#c0bad4";
                  const dateColor = DATE_STATUS_COLORS[item.status] || "#b2b2b2";
                  const strokeColor = item.status === "not-started" || item.status === "opted-out" ? "#8e7bb7" : "#ffffff";
                  return (
                    <div key={idx} className="flex flex-col items-center" style={{ width: 56 }}>
                      <div className="relative flex items-center justify-center" style={{ width: 56, height: 48 }}
                        onMouseEnter={() => setActiveTip(tipKey)} onMouseLeave={() => setActiveTip(null)}
                        onClick={() => onDotClick && onDotClick(student, items, idx, prefix === "t" ? "task" : "workshop")}>
                        <div style={{ position: "absolute", top: "50%", left: "50%", width: idx < items.length - 1 ? 56 : 20, height: 2, backgroundColor: "#e5e0f0", transform: "translateY(-50%)", zIndex: 0 }} />
                        <div className="rounded-full flex items-center justify-center cursor-pointer" style={{
                          width: 34, height: 34, backgroundColor: color, position: "relative", zIndex: 1,
                          opacity: isActive ? 1 : 0.7,
                          transform: isActive ? "scale(1.35)" : "scale(1)",
                          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease-out, opacity 0.2s ease-out",
                          boxShadow: isActive ? "0 3px 10px rgba(40,29,81,0.3)" : "none",
                        }}>
                          {isActive ? (
                            <svg className="w-4 h-4" fill="none" stroke="#ffffff" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke={strokeColor} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
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
                      <div style={{ height: 70, width: 56, position: "relative", overflow: "visible", pointerEvents: "none" }}>
                        <div style={{ position: "absolute", top: 2, right: "50%", transformOrigin: "top right", transform: "rotate(-55deg)", whiteSpace: "nowrap", textAlign: "right" }}>
                          <p className="font-medium leading-tight" style={{ color: "#474747", fontSize: 10 }}>{item.name.length > 20 ? item.name.slice(0, 18) + "…" : item.name}</p>
                          <p className="font-semibold" style={{ color: dateColor, fontSize: 9 }}>{item.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center" style={{ height: 48, marginLeft: -4 }}>
                  <svg width="12" height="16" viewBox="0 0 10 14" fill="none"><path d="M1 1L8 7L1 13" stroke="#c0bad4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          );

          return (
            <div key={student.id} className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <StudentAvatar student={student} size={40} />
                <div className="flex-1 min-w-0">
                  <button onClick={() => onStudentClick && onStudentClick(student)} className="font-bold text-sm text-left hover:underline" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</button>
                  <p className="text-xs" style={{ color: "#b2b2b2" }}>{student.highSchool} • Class of {student.gradYear}</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <span style={{ color: "#00e6c3" }} className="font-semibold">{completed}/{allItems.length} done</span>
                  {behind > 0 && <span style={{ color: "#ff3467" }} className="font-semibold">{behind} behind</span>}
                </div>
              </div>
              {renderTimeline(taskItems, "t", "TASKS")}
              {renderTimeline(wsItems, "w", "WORKSHOPS")}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TasksTab;
