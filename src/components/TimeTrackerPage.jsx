import { useState } from "react";

const EMPLOYEES = [
  "Alex Morgan", "Amanda Yoder", "Chris Bench", "Don Keller",
  "Ian Simon", "Allison Dahleen", "Raymond Gonzales", "Miracle Husband",
];

const DISCIPLINES = ["Counseling", "Essay Coaching", "Tutoring", "Admin"];

// Generate 6 weeks of timesheet data for each employee
const TIMESHEETS = [];
let id = 1;
const weeks = [
  "02/03/26 - 02/07/26", "02/10/26 - 02/14/26", "02/17/26 - 02/21/26",
  "02/24/26 - 02/28/26", "03/03/26 - 03/07/26", "03/10/26 - 03/14/26",
];
for (const emp of EMPLOYEES) {
  for (const week of weeks) {
    const hrs = +(Math.random() * 30 + 10).toFixed(1);
    const isCurrent = week.includes("03/10");
    TIMESHEETS.push({
      id: id++,
      employee: emp,
      week,
      totalHours: hrs,
      status: isCurrent ? "Open" : Math.random() > 0.15 ? "Closed" : "Open",
      discipline: DISCIPLINES[Math.floor(Math.random() * DISCIPLINES.length)],
    });
  }
}

// Sort by week descending, then employee
TIMESHEETS.sort((a, b) => b.week.localeCompare(a.week) || a.employee.localeCompare(b.employee));

export default function TimeTrackerPage() {
  const [empFilter, setEmpFilter] = useState("all");
  const [discFilter, setDiscFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [weekFilter, setWeekFilter] = useState("all");
  const [sortCol, setSortCol] = useState("week");
  const [sortDir, setSortDir] = useState("desc");
  const [showMyTimesheet, setShowMyTimesheet] = useState(false);
  const [viewingTimesheet, setViewingTimesheet] = useState(null); // { employee, week, status }
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);

  const filtered = TIMESHEETS.filter(t => {
    if (empFilter !== "all" && t.employee !== empFilter) return false;
    if (discFilter !== "all" && t.discipline !== discFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (weekFilter !== "all" && t.week !== weekFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "employee") cmp = a.employee.localeCompare(b.employee);
    else if (sortCol === "week") cmp = a.week.localeCompare(b.week);
    else if (sortCol === "hours") cmp = a.totalHours - b.totalHours;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageData = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortArrow = ({ col }) => (
    <span className="ml-1 text-xs">{sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
  );

  // Manager view of an employee's timesheet (for approval)
  if (viewingTimesheet) {
    const entries = [
      { date: viewingTimesheet.week.split(" - ")[0], student: "Student A", type: "Counselor Session", hours: 1.5, notes: "College list review" },
      { date: viewingTimesheet.week.split(" - ")[0], student: "Student B", type: "Counselor Session", hours: 1.0, notes: "Application strategy" },
      { date: viewingTimesheet.week.split(" - ")[0], student: "Student C", type: "Essay Session", hours: 1.0, notes: "Personal statement" },
      { date: viewingTimesheet.week.split(" - ")[1], student: "Student D", type: "Counselor Session", hours: 0.75, notes: "Scholarship planning" },
      { date: viewingTimesheet.week.split(" - ")[1], student: "", type: "Team Meeting", hours: 1.0, notes: "Weekly sync" },
      { date: viewingTimesheet.week.split(" - ")[1], student: "Student A", type: "Admin/Communications", hours: 0.5, notes: "Parent follow-up" },
    ];
    const total = entries.reduce((s, e) => s + e.hours, 0);

    return (
      <div className="p-6">
        <button onClick={() => setViewingTimesheet(null)} className="mb-4 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>← Back to Timesheets</button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#281d51" }}>{viewingTimesheet.employee} — {viewingTimesheet.week}</h2>
            <p className="text-sm" style={{ color: "#b2b2b2" }}>Status: <span className="font-semibold" style={{ color: viewingTimesheet.status === "Open" ? "#fbbf24" : "#00e6c3" }}>{viewingTimesheet.status}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg px-5 py-3" style={{ backgroundColor: "#e5e0f0" }}>
              <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>TOTAL HOURS</p>
              <p className="text-xl font-bold" style={{ color: "#281d51" }}>{total.toFixed(1)}</p>
            </div>
            {viewingTimesheet.status === "Open" && (
              <>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#00e6c3" }}>APPROVE</button>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#ff3467" }}>REJECT</button>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f8f7fc" }}>
                {["Date", "Student", "Type", "Hours", "Notes"].map(h => (
                  <th key={h} className="p-3 text-left text-xs font-semibold" style={{ color: "#b2b2b2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <td className="p-3 text-sm" style={{ color: "#474747" }}>{e.date}</td>
                  <td className="p-3 text-sm font-medium" style={{ color: "#281d51" }}>{e.student || "—"}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: e.type.includes("Counselor") ? "#e5e0f0" : e.type.includes("Essay") ? "#d1fae5" : "#f0f9ff", color: e.type.includes("Counselor") ? "#55478f" : e.type.includes("Essay") ? "#065f46" : "#42778c" }}>{e.type}</span></td>
                  <td className="p-3 text-sm font-bold" style={{ color: "#281d51" }}>{e.hours.toFixed(2)}</td>
                  <td className="p-3 text-sm" style={{ color: "#b2b2b2" }}>{e.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // My Timesheet detail view
  if (showMyTimesheet) {
    const myEntries = [
      { date: "03/10/26", student: "Aguilar Villalobos, Daniela", type: "Counselor Session", hours: 1.0, notes: "College list review" },
      { date: "03/10/26", student: "Hart, Madelyn", type: "Counselor Session", hours: 1.5, notes: "Application strategy discussion" },
      { date: "03/11/26", student: "Kumar, Maya", type: "Counselor Session", hours: 1.0, notes: "Course selection" },
      { date: "03/11/26", student: "Chen, William", type: "Admin/Communications", hours: 0.5, notes: "Parent email follow-up" },
      { date: "03/12/26", student: "Rodriguez, Sofia", type: "Counselor Session", hours: 1.0, notes: "FAFSA walkthrough" },
      { date: "03/12/26", student: "Patel, Ananya", type: "Counselor Session", hours: 0.75, notes: "Scholarship planning" },
      { date: "03/13/26", student: "Thompson, James", type: "Admin/Communications", hours: 0.25, notes: "Decision follow-up" },
      { date: "03/13/26", student: "Williams, Jordan", type: "Counselor Session", hours: 1.0, notes: "College visit debrief" },
      { date: "03/14/26", student: "", type: "Team Meeting", hours: 1.0, notes: "Weekly staff sync" },
      { date: "03/14/26", student: "Hart, Madelyn", type: "Essay Session", hours: 1.0, notes: "Personal statement review" },
    ];
    const total = myEntries.reduce((s, e) => s + e.hours, 0);

    return (
      <div className="p-6">
        <button onClick={() => setShowMyTimesheet(false)} className="mb-4 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>← Back to Timesheets</button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#281d51" }}>My Timesheet — Week of 03/10/26</h2>
            <p className="text-sm" style={{ color: "#b2b2b2" }}>Alex Morgan • Status: <span className="font-semibold" style={{ color: "#fbbf24" }}>Open</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg px-5 py-3" style={{ backgroundColor: "#e5e0f0" }}>
              <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>TOTAL HOURS</p>
              <p className="text-xl font-bold" style={{ color: "#281d51" }}>{total.toFixed(1)}</p>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>SUBMIT TIMESHEET</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f8f7fc" }}>
                {["Date", "Student", "Type", "Hours", "Notes", ""].map(h => (
                  <th key={h} className="p-3 text-left text-xs font-semibold" style={{ color: "#b2b2b2" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myEntries.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <td className="p-3 text-sm" style={{ color: "#474747" }}>{e.date}</td>
                  <td className="p-3 text-sm font-medium" style={{ color: "#281d51" }}>{e.student || "—"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                      backgroundColor: e.type.includes("Counselor") ? "#e5e0f0" : e.type.includes("Essay") ? "#d1fae5" : e.type.includes("Tutor") ? "#fef3c7" : "#f0f9ff",
                      color: e.type.includes("Counselor") ? "#55478f" : e.type.includes("Essay") ? "#065f46" : e.type.includes("Tutor") ? "#92400e" : "#42778c",
                    }}>{e.type}</span>
                  </td>
                  <td className="p-3 text-sm font-bold" style={{ color: "#281d51" }}>{e.hours.toFixed(2)}</td>
                  <td className="p-3 text-sm" style={{ color: "#b2b2b2" }}>{e.notes}</td>
                  <td className="p-3">
                    <button className="text-xs" style={{ color: "#ff3467" }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-4 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>+ Add Entry</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select value={empFilter} onChange={e => { setEmpFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
          <option value="all">All Employees</option>
          {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={discFilter} onChange={e => { setDiscFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
          <option value="all">All Disciplines</option>
          {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
          <option value="all">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={weekFilter} onChange={e => { setWeekFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
          <option value="all">All Weeks</option>
          {weeks.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <button onClick={() => setShowMyTimesheet(true)} className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>MY TIMESHEET</button>
      </div>

      {/* Results count */}
      <p className="text-xs mb-3" style={{ color: "#b2b2b2" }}>Showing {pageData.length} of {sorted.length} timesheets</p>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#f8f7fc" }}>
              <th className="p-3 text-left text-xs font-semibold cursor-pointer" style={{ color: "#b2b2b2" }} onClick={() => toggleSort("employee")}>Employee Name <SortArrow col="employee" /></th>
              <th className="p-3 text-left text-xs font-semibold cursor-pointer" style={{ color: "#b2b2b2" }} onClick={() => toggleSort("week")}>Week <SortArrow col="week" /></th>
              <th className="p-3 text-right text-xs font-semibold cursor-pointer" style={{ color: "#b2b2b2" }} onClick={() => toggleSort("hours")}>Total Hours <SortArrow col="hours" /></th>
              <th className="p-3 text-left text-xs font-semibold" style={{ color: "#b2b2b2" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(t => (
              <tr key={t.id} onClick={() => setViewingTimesheet(t)} className="hover:bg-gray-50 cursor-pointer" style={{ borderTop: "1px solid #e5e0f0" }}>
                <td className="p-3 text-sm font-medium" style={{ color: "#281d51" }}>{t.employee}</td>
                <td className="p-3 text-sm" style={{ color: "#474747" }}>{t.week}</td>
                <td className="p-3 text-sm text-right font-bold" style={{ color: "#281d51" }}>{t.totalHours.toFixed(1)}</td>
                <td className="p-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{
                    backgroundColor: t.status === "Open" ? "#fef3c7" : "#d1fae5",
                    color: t.status === "Open" ? "#92400e" : "#065f46",
                  }}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "#b2b2b2" }}>Show</span>
          <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="px-2 py-1 rounded text-xs" style={{ border: "1px solid #c0bad4" }}>
            {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs" style={{ color: "#b2b2b2" }}>per page</span>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 rounded text-xs" style={{ color: page === 1 ? "#c0bad4" : "#55478f" }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className="w-7 h-7 rounded text-xs font-medium" style={{ backgroundColor: page === p ? "#55478f" : "transparent", color: page === p ? "white" : "#55478f" }}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-1 rounded text-xs" style={{ color: page === totalPages ? "#c0bad4" : "#55478f" }}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
