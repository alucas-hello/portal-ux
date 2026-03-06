import { useState } from "react";

/* ── Sample Data ── */

const COUNSELORS = ["All Counselors", "Allison Dahleen", "Amanda Yoder", "Chris Bench", "Don Keller", "Ian Simon", "Miracle Husband", "Raymond Gonzales"];
const EMPLOYEES = ["All Employees", "Allison Dahleen", "Amanda Yoder", "Chris Bench", "Don Keller", "Ian Simon", "Miracle Husband", "Raymond Gonzales"];

const COLLEGE_DECISION_DATA = [
  { name: "Emma Rodriguez", state: "TX", hs: "Westlake High School", yog: 2026, college: "UT Austin", major: "Computer Science", ugpa: "3.92", wgpa: "4.31", accepted: 5, waitlisted: 1, rejected: 2, rescinded: 0, appeal: "Yes", appealSchool: "Rice University", appealAmt: "$12,000", merit: "Yes", meritAmt: "$8,000" },
  { name: "Liam Chen", state: "CA", hs: "Palo Alto High School", yog: 2026, college: "Stanford", major: "Electrical Engineering", ugpa: "3.97", wgpa: "4.52", accepted: 8, waitlisted: 0, rejected: 1, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "Yes", meritAmt: "$20,000" },
  { name: "Sophia Williams", state: "GA", hs: "North Atlanta High School", yog: 2026, college: "Emory University", major: "Biology", ugpa: "3.85", wgpa: "4.18", accepted: 6, waitlisted: 2, rejected: 1, rescinded: 0, appeal: "Yes", appealSchool: "Vanderbilt", appealAmt: "$5,000", merit: "Yes", meritAmt: "$15,000" },
  { name: "Noah Patel", state: "NJ", hs: "Bergen County Academies", yog: 2026, college: "MIT", major: "Physics", ugpa: "3.99", wgpa: "4.61", accepted: 7, waitlisted: 1, rejected: 2, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "No", meritAmt: "—" },
  { name: "Olivia Martinez", state: "FL", hs: "Coral Gables Senior High", yog: 2026, college: "University of Miami", major: "Business", ugpa: "3.78", wgpa: "4.05", accepted: 4, waitlisted: 0, rejected: 3, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "Yes", meritAmt: "$10,000" },
  { name: "Jackson Lee", state: "VA", hs: "Thomas Jefferson HSST", yog: 2026, college: "UVA", major: "Economics", ugpa: "3.91", wgpa: "4.38", accepted: 6, waitlisted: 1, rejected: 1, rescinded: 0, appeal: "Yes", appealSchool: "Duke", appealAmt: "$8,500", merit: "Yes", meritAmt: "$12,000" },
  { name: "Ava Thompson", state: "NC", hs: "Myers Park High School", yog: 2026, college: "UNC Chapel Hill", major: "Nursing", ugpa: "3.88", wgpa: "4.22", accepted: 5, waitlisted: 0, rejected: 2, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "Yes", meritAmt: "$6,000" },
  { name: "Ethan Kim", state: "WA", hs: "Lakeside School", yog: 2026, college: "University of Washington", major: "Computer Science", ugpa: "3.94", wgpa: "4.45", accepted: 7, waitlisted: 2, rejected: 0, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "Yes", meritAmt: "$18,000" },
  { name: "Isabella Davis", state: "IL", hs: "New Trier High School", yog: 2026, college: "Northwestern", major: "Journalism", ugpa: "3.82", wgpa: "4.15", accepted: 4, waitlisted: 1, rejected: 3, rescinded: 1, appeal: "Yes", appealSchool: "Georgetown", appealAmt: "$4,000", merit: "No", meritAmt: "—" },
  { name: "Mason Brown", state: "CO", hs: "Cherry Creek High School", yog: 2026, college: "CU Boulder", major: "Mechanical Engineering", ugpa: "3.75", wgpa: "4.02", accepted: 6, waitlisted: 0, rejected: 1, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "Yes", meritAmt: "$14,000" },
  { name: "Mia Johnson", state: "MA", hs: "Boston Latin School", yog: 2026, college: "Boston University", major: "Psychology", ugpa: "3.86", wgpa: "4.20", accepted: 5, waitlisted: 1, rejected: 2, rescinded: 0, appeal: "No", appealSchool: "—", appealAmt: "—", merit: "Yes", meritAmt: "$11,000" },
  { name: "Aiden Wilson", state: "PA", hs: "Central High School", yog: 2026, college: "Undecided", major: "Pre-Med", ugpa: "3.90", wgpa: "4.30", accepted: 3, waitlisted: 3, rejected: 1, rescinded: 0, appeal: "Yes", appealSchool: "Penn", appealAmt: "$7,000", merit: "Yes", meritAmt: "$9,500" },
];

const HOURS_REPORT_DATA = [
  { employee: "Allison Dahleen", total: 162.5, counseling: 98.0, essay: 32.5, tutoring: 0, admin: 32.0 },
  { employee: "Amanda Yoder", total: 148.0, counseling: 88.0, essay: 40.0, tutoring: 0, admin: 20.0 },
  { employee: "Chris Bench", total: 155.0, counseling: 0, essay: 0, tutoring: 120.0, admin: 35.0 },
  { employee: "Don Keller", total: 170.0, counseling: 110.0, essay: 25.0, tutoring: 0, admin: 35.0 },
  { employee: "Ian Simon", total: 138.5, counseling: 0, essay: 98.5, tutoring: 0, admin: 40.0 },
  { employee: "Miracle Husband", total: 145.0, counseling: 92.0, essay: 28.0, tutoring: 0, admin: 25.0 },
  { employee: "Raymond Gonzales", total: 160.0, counseling: 0, essay: 0, tutoring: 130.0, admin: 30.0 },
];

const SCORES_DATA = [
  { name: "Emma Rodriguez", type: "SAT", date: "10/12/25", composite: "1480", english: "740", math: "740", reading: "—", science: "—" },
  { name: "Liam Chen", type: "SAT", date: "10/12/25", composite: "1560", english: "780", math: "780", reading: "—", science: "—" },
  { name: "Noah Patel", type: "ACT", date: "09/14/25", composite: "35", english: "36", math: "35", reading: "34", science: "35" },
  { name: "Sophia Williams", type: "ACT", date: "09/14/25", composite: "32", english: "33", math: "30", reading: "34", science: "31" },
  { name: "Olivia Martinez", type: "SAT", date: "11/02/25", composite: "1320", english: "680", math: "640", reading: "—", science: "—" },
  { name: "Jackson Lee", type: "ACT", date: "09/14/25", composite: "34", english: "35", math: "34", reading: "33", science: "34" },
  { name: "Ava Thompson", type: "SAT", date: "10/12/25", composite: "1410", english: "720", math: "690", reading: "—", science: "—" },
  { name: "Ethan Kim", type: "SAT", date: "11/02/25", composite: "1520", english: "760", math: "760", reading: "—", science: "—" },
  { name: "Isabella Davis", type: "ACT", date: "09/14/25", composite: "31", english: "33", math: "29", reading: "32", science: "30" },
  { name: "Mason Brown", type: "ACT", date: "10/26/25", composite: "29", english: "28", math: "31", reading: "28", science: "29" },
];

const EVIDENCE_CATEGORIES = [
  { heading: "Finance", items: ["Accounts Receivable", "Chargeability", "Payroll Export", "QuickBooks Export", "Resource Utilization", "Revenue Dashboard", "Student Services"] },
  { heading: "Planning", items: ["Assignment Gaps", "Capacity Forecast", "Capacity Planning", "Counselor Deep Dive", "Hours Projection", "Student Progress"] },
  { heading: "College Outcomes", items: ["College Applications", "College Decisions", "Exit Survey"] },
  { heading: "Service Delivery", items: ["Contact Health", "Counselor Performance", "Essay Coach Performance", "Hours Overview", "Task Progress", "Team Performance", "Tutor Dashboard"] },
  { heading: "Growth", items: ["Enrollment Trends", "Onboarding", "Retention & Churn", "Sales Pipeline"] },
  { heading: "Operations", items: ["Former Students", "HubSpot Data", "Student Directory", "Student Engagement"] },
];

/* ── Sub-tab definitions ── */

const TABS = [
  { key: "evidence", label: "Evidence (BI Dashboard)" },
  { key: "decisions", label: "College Decisions" },
  { key: "hours", label: "Hours Report" },
  { key: "scores", label: "Student Scores" },
];

/* ── Sortable Table Header ── */

function SortHeader({ col, label, sortCol, sortDir, onSort, minW }) {
  return (
    <th
      className="text-left px-3 py-3 text-xs font-semibold cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
      style={{ color: "#281d51", minWidth: minW || undefined }}
      onClick={() => onSort(col)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortCol === col && <span className="text-xs">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
      </div>
    </th>
  );
}

/* ── Tab 1: College Decision Reports ── */

function CollegeDecisionsTab() {
  const [search, setSearch] = useState("");
  const [counselor, setCounselor] = useState("All Counselors");
  const [noCollege, setNoCollege] = useState(false);
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = COLLEGE_DECISION_DATA.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.hs.toLowerCase().includes(q) || s.state.toLowerCase().includes(q) || s.college.toLowerCase().includes(q);
    const matchesNoCollege = !noCollege || s.college === "Undecided";
    return matchesSearch && matchesNoCollege;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (sortCol === "ugpa" || sortCol === "wgpa") { va = parseFloat(va); vb = parseFloat(vb); }
    if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return 0;
  });

  const cols = [
    { col: "name", label: "Student Name", minW: "160px" },
    { col: "state", label: "State" },
    { col: "hs", label: "High School", minW: "180px" },
    { col: "yog", label: "YOG" },
    { col: "college", label: "College Choice", minW: "160px" },
    { col: "major", label: "Major", minW: "140px" },
    { col: "ugpa", label: "Unwtd GPA" },
    { col: "wgpa", label: "Wtd GPA" },
    { col: "accepted", label: "Accepted" },
    { col: "waitlisted", label: "Waitlisted" },
    { col: "rejected", label: "Rejected" },
    { col: "rescinded", label: "Rescinded" },
    { col: "appeal", label: "Appeal" },
    { col: "appealSchool", label: "Appeal School" },
    { col: "appealAmt", label: "Appeal Amt" },
    { col: "merit", label: "Merit" },
    { col: "meritAmt", label: "Merit Amt" },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={counselor}
          onChange={e => setCounselor(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", backgroundColor: "white" }}
        >
          {COUNSELORS.map(c => <option key={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#474747" }}>
          <input
            type="checkbox"
            checked={noCollege}
            onChange={e => setNoCollege(e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: "#55478f" }}
          />
          Only show students with no college selected
        </label>
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm w-72"
          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
        />
        <span className="text-sm ml-auto" style={{ color: "#b2b2b2" }}>
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              {cols.map(c => (
                <SortHeader key={c.col} col={c.col} label={c.label} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} minW={c.minW} />
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #f0edf5" }}>
                <td className="px-3 py-3 text-sm font-medium cursor-pointer hover:underline" style={{ color: "#42778c" }}>{s.name}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.state}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.hs}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.yog}</td>
                <td className="px-3 py-3 text-sm font-medium" style={{ color: s.college === "Undecided" ? "#ff3467" : "#281d51" }}>{s.college}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.major}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.ugpa}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.wgpa}</td>
                <td className="px-3 py-3 text-sm text-center" style={{ color: "#474747" }}>{s.accepted}</td>
                <td className="px-3 py-3 text-sm text-center" style={{ color: s.waitlisted > 0 ? "#fbbf24" : "#474747" }}>{s.waitlisted}</td>
                <td className="px-3 py-3 text-sm text-center" style={{ color: s.rejected > 0 ? "#ff3467" : "#474747" }}>{s.rejected}</td>
                <td className="px-3 py-3 text-sm text-center" style={{ color: s.rescinded > 0 ? "#ff3467" : "#474747" }}>{s.rescinded}</td>
                <td className="px-3 py-3 text-sm" style={{ color: s.appeal === "Yes" ? "#00e6c3" : "#c0bad4" }}>{s.appeal}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.appealSchool}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.appealAmt}</td>
                <td className="px-3 py-3 text-sm" style={{ color: s.merit === "Yes" ? "#00e6c3" : "#c0bad4" }}>{s.merit}</td>
                <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.meritAmt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tab 2: Hours Report ── */

function HoursReportTab() {
  const [startDate, setStartDate] = useState("2025-09-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [employee, setEmployee] = useState("All Employees");
  const [showResults, setShowResults] = useState(true);

  const filtered = employee === "All Employees"
    ? HOURS_REPORT_DATA
    : HOURS_REPORT_DATA.filter(r => r.employee === employee);

  const totals = filtered.reduce((acc, r) => ({
    total: acc.total + r.total,
    counseling: acc.counseling + r.counseling,
    essay: acc.essay + r.essay,
    tutoring: acc.tutoring + r.tutoring,
    admin: acc.admin + r.admin,
  }), { total: 0, counseling: 0, essay: 0, tutoring: 0, admin: 0 });

  return (
    <div>
      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: "1px solid #e5e0f0" }}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: "#281d51" }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: "#281d51" }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: "#281d51" }}>Employee</label>
            <select
              value={employee}
              onChange={e => setEmployee(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", backgroundColor: "white" }}
            >
              {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowResults(true)}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white tracking-wide"
            style={{ backgroundColor: "#55478f" }}
          >
            GENERATE REPORT
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
          <table className="w-full">
            <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Employee</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Total Hours</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Counseling</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Essay</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Tutoring</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Admin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #f0edf5" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{r.employee}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold" style={{ color: "#474747" }}>{r.total.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "#474747" }}>{r.counseling.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "#474747" }}>{r.essay.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "#474747" }}>{r.tutoring.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-right" style={{ color: "#474747" }}>{r.admin.toFixed(1)}</td>
                </tr>
              ))}
              {/* Totals row */}
              <tr style={{ borderTop: "2px solid #e5e0f0", backgroundColor: "#f8f7fc" }}>
                <td className="px-4 py-3 text-sm font-bold" style={{ color: "#281d51" }}>TOTAL</td>
                <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: "#281d51" }}>{totals.total.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: "#281d51" }}>{totals.counseling.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: "#281d51" }}>{totals.essay.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: "#281d51" }}>{totals.tutoring.toFixed(1)}</td>
                <td className="px-4 py-3 text-sm text-right font-bold" style={{ color: "#281d51" }}>{totals.admin.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Tab 3: Student Scores Reports ── */

function StudentScoresTab() {
  const [yog, setYog] = useState("2026");
  const [counselor, setCounselor] = useState("All Counselors");
  const [testType, setTestType] = useState("All");
  const [showResults, setShowResults] = useState(true);
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = SCORES_DATA.filter(s => {
    if (testType !== "All" && s.type !== testType) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return 0;
  });

  const cols = [
    { col: "name", label: "Student Name" },
    { col: "type", label: "Test Type" },
    { col: "date", label: "Date" },
    { col: "composite", label: "Composite" },
    { col: "english", label: "English" },
    { col: "math", label: "Math" },
    { col: "reading", label: "Reading" },
    { col: "science", label: "Science" },
  ];

  return (
    <div>
      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={{ border: "1px solid #e5e0f0" }}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: "#281d51" }}>Year of Graduation</label>
            <select
              value={yog}
              onChange={e => setYog(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", backgroundColor: "white" }}
            >
              {["2024", "2025", "2026", "2027", "2028"].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: "#281d51" }}>Counselor / Tutor</label>
            <select
              value={counselor}
              onChange={e => setCounselor(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", backgroundColor: "white" }}
            >
              {COUNSELORS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: "#281d51" }}>Test Type</label>
            <select
              value={testType}
              onChange={e => setTestType(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", backgroundColor: "white" }}
            >
              <option>All</option>
              <option>ACT</option>
              <option>SAT</option>
            </select>
          </div>
          <button
            onClick={() => setShowResults(true)}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white tracking-wide"
            style={{ backgroundColor: "#55478f" }}
          >
            GENERATE REPORT
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
          <table className="w-full">
            <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
              <tr>
                {cols.map(c => (
                  <SortHeader key={c.col} col={c.col} label={c.label} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #f0edf5" }}>
                  <td className="px-3 py-3 text-sm font-medium cursor-pointer hover:underline" style={{ color: "#42778c" }}>{s.name}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: s.type === "SAT" ? "#e5e0f0" : "#fef3c7", color: s.type === "SAT" ? "#55478f" : "#92400e" }}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.date}</td>
                  <td className="px-3 py-3 text-sm font-semibold" style={{ color: "#281d51" }}>{s.composite}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.english}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: "#474747" }}>{s.math}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: s.reading === "\u2014" ? "#c0bad4" : "#474747" }}>{s.reading}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: s.science === "\u2014" ? "#c0bad4" : "#474747" }}>{s.science}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Tab 4: Evidence (BI Dashboard) ── */

function EvidenceTab() {
  const [selectedReport, setSelectedReport] = useState("Executive Overview");

  const metrics = [
    { label: "Active Students", value: "142", color: "#55478f", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Active Employees", value: "12", color: "#42778c", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { label: "Open Deals", value: "8", color: "#281d51", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Contact Health", value: "87%", color: "#00e6c3", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { label: "Students Scheduled", value: "94%", color: "#55478f", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "YTD Chargeability", value: "76%", color: "#42778c", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  ];

  return (
    <div className="flex gap-0" style={{ minHeight: "calc(100vh - 200px)" }}>
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 overflow-y-auto rounded-l-lg" style={{ backgroundColor: "#281d51", borderRight: "1px solid #55478f" }}>
        <div className="p-4">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#c0bad4" }}>Report Categories</h3>
          {EVIDENCE_CATEGORIES.map((cat, ci) => (
            <div key={ci} className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 px-2" style={{ color: "#8e7bb7" }}>{cat.heading}</h4>
              {cat.items.map((item, ii) => (
                <button
                  key={ii}
                  onClick={() => setSelectedReport(item)}
                  className="block w-full text-left px-3 py-1.5 rounded text-sm transition-colors mb-0.5"
                  style={{
                    color: selectedReport === item ? "white" : "#c0bad4",
                    backgroundColor: selectedReport === item ? "#55478f" : "transparent",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedReport === "Executive Overview" ? (
          <>
            <h2 className="text-xl font-bold mb-6" style={{ color: "#281d51" }}>Executive Overview</h2>
            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {metrics.map((m, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4" style={{ border: "1px solid #e5e0f0" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: m.color + "18" }}>
                    <svg className="w-6 h-6" fill="none" stroke={m.color} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={m.icon} /></svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: "#281d51" }}>{m.value}</div>
                    <div className="text-xs font-medium" style={{ color: "#b2b2b2" }}>{m.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder chart areas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #e5e0f0" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Revenue by Month</h3>
                <div className="flex items-end gap-2 h-40">
                  {[65, 72, 58, 80, 90, 75, 85, 92, 78, 88, 95, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i < 6 ? "#55478f" : "#8e7bb7", opacity: 0.7 + (i % 3) * 0.1 }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "#b2b2b2" }}>Jan</span>
                  <span className="text-xs" style={{ color: "#b2b2b2" }}>Jun</span>
                  <span className="text-xs" style={{ color: "#b2b2b2" }}>Dec</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #e5e0f0" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Student Progress Distribution</h3>
                <div className="flex items-center justify-center h-40 gap-6">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-32 h-32">
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e5e0f0" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#00e6c3" strokeWidth="3" strokeDasharray="42 58" strokeDashoffset="25" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="28 72" strokeDashoffset="83" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#c0bad4" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="55" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#ff3467" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="37" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#00e6c3" }} /><span style={{ color: "#474747" }}>Completed (42%)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#fbbf24" }} /><span style={{ color: "#474747" }}>In Progress (28%)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#c0bad4" }} /><span style={{ color: "#474747" }}>Not Started (18%)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#ff3467" }} /><span style={{ color: "#474747" }}>Behind (12%)</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5" style={{ border: "1px solid #e5e0f0" }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Hours by Category (Last 12 Weeks)</h3>
              <div className="flex items-end gap-1 h-32">
                {[
                  { c: 40, e: 20, t: 30 }, { c: 45, e: 18, t: 28 }, { c: 38, e: 22, t: 32 },
                  { c: 50, e: 25, t: 20 }, { c: 42, e: 20, t: 35 }, { c: 48, e: 15, t: 30 },
                  { c: 44, e: 28, t: 25 }, { c: 52, e: 22, t: 22 }, { c: 46, e: 20, t: 30 },
                  { c: 40, e: 24, t: 28 }, { c: 55, e: 18, t: 26 }, { c: 48, e: 26, t: 24 },
                ].map((w, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-0.5">
                    <div className="rounded-t" style={{ height: `${w.c}%`, backgroundColor: "#55478f" }} />
                    <div style={{ height: `${w.e}%`, backgroundColor: "#42778c" }} />
                    <div className="rounded-b" style={{ height: `${w.t}%`, backgroundColor: "#8e7bb7" }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#55478f" }} /><span style={{ color: "#474747" }}>Counseling</span></div>
                <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#42778c" }} /><span style={{ color: "#474747" }}>Essay</span></div>
                <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#8e7bb7" }} /><span style={{ color: "#474747" }}>Tutoring</span></div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#281d51" }}>{selectedReport}</h2>
            <p className="text-sm mb-6" style={{ color: "#b2b2b2" }}>Interactive BI report powered by Evidence</p>
            {/* Show the evidence-reports.png as reference */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <img
                src={import.meta.env.BASE_URL + "evidence-reports.png"}
                alt={`${selectedReport} dashboard`}
                className="w-full h-auto block opacity-80"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Reports Page ── */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("evidence");

  return (
    <div className="p-6">
      {/* Sub-tabs */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: "2px solid #e5e0f0" }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-5 py-3 text-sm font-semibold transition-colors relative"
            style={{
              color: activeTab === tab.key ? "#281d51" : "#b2b2b2",
              borderBottom: activeTab === tab.key ? "3px solid #ff3467" : "3px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "decisions" && <CollegeDecisionsTab />}
      {activeTab === "hours" && <HoursReportTab />}
      {activeTab === "scores" && <StudentScoresTab />}
      {activeTab === "evidence" && <EvidenceTab />}
    </div>
  );
}
