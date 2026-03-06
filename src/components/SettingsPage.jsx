import { useState } from "react";

/* ── Sample Data ─────────────────────────────────────────────────── */

const SAMPLE_STUDENTS = [
  { id: 1, name: "Sophia Martinez", email: "sophia.martinez@email.com", status: "Active", gradYear: 2026, highSchool: "Lakewood High School" },
  { id: 2, name: "Liam Johnson", email: "liam.johnson@email.com", status: "Active", gradYear: 2026, highSchool: "Cherry Creek High School" },
  { id: 3, name: "Emma Williams", email: "emma.williams@email.com", status: "Active", gradYear: 2027, highSchool: "Regis Jesuit High School" },
  { id: 4, name: "Noah Brown", email: "noah.brown@email.com", status: "Active", gradYear: 2026, highSchool: "Grandview High School" },
  { id: 5, name: "Olivia Davis", email: "olivia.davis@email.com", status: "Inactive", gradYear: 2025, highSchool: "Lakewood High School" },
  { id: 6, name: "James Garcia", email: "james.garcia@email.com", status: "Active", gradYear: 2027, highSchool: "ThunderRidge High School" },
  { id: 7, name: "Ava Wilson", email: "ava.wilson@email.com", status: "Active", gradYear: 2026, highSchool: "Arapahoe High School" },
  { id: 8, name: "Lucas Taylor", email: "lucas.taylor@email.com", status: "Active", gradYear: 2027, highSchool: "Cherry Creek High School" },
  { id: 9, name: "Isabella Anderson", email: "isabella.anderson@email.com", status: "Inactive", gradYear: 2025, highSchool: "Smoky Hill High School" },
  { id: 10, name: "Mason Thomas", email: "mason.thomas@email.com", status: "Active", gradYear: 2026, highSchool: "Grandview High School" },
  { id: 11, name: "Mia Jackson", email: "mia.jackson@email.com", status: "Active", gradYear: 2027, highSchool: "Regis Jesuit High School" },
  { id: 12, name: "Ethan White", email: "ethan.white@email.com", status: "Active", gradYear: 2026, highSchool: "Arapahoe High School" },
  { id: 13, name: "Charlotte Harris", email: "charlotte.harris@email.com", status: "Pending", gradYear: 2027, highSchool: "ThunderRidge High School" },
  { id: 14, name: "Benjamin Clark", email: "benjamin.clark@email.com", status: "Active", gradYear: 2026, highSchool: "Cherry Creek High School" },
  { id: 15, name: "Amelia Lewis", email: "amelia.lewis@email.com", status: "Active", gradYear: 2027, highSchool: "Lakewood High School" },
  { id: 16, name: "Alexander Robinson", email: "alexander.robinson@email.com", status: "Active", gradYear: 2026, highSchool: "Smoky Hill High School" },
  { id: 17, name: "Harper Walker", email: "harper.walker@email.com", status: "Pending", gradYear: 2027, highSchool: "Grandview High School" },
  { id: 18, name: "Daniel Young", email: "daniel.young@email.com", status: "Inactive", gradYear: 2025, highSchool: "Arapahoe High School" },
  { id: 19, name: "Evelyn Hall", email: "evelyn.hall@email.com", status: "Active", gradYear: 2026, highSchool: "Cherry Creek High School" },
  { id: 20, name: "Henry Allen", email: "henry.allen@email.com", status: "Active", gradYear: 2027, highSchool: "Regis Jesuit High School" },
];

const SAMPLE_EMPLOYEES = [
  { id: 1, name: "Alex Morgan", email: "alex.morgan@hellocollege.com", role: "Admin", status: "Active" },
  { id: 2, name: "Amanda Yoder", email: "amanda.yoder@hellocollege.com", role: "Counselor", status: "Active" },
  { id: 3, name: "Chris Bench", email: "chris.bench@hellocollege.com", role: "Counselor", status: "Active" },
  { id: 4, name: "Don Keller", email: "don.keller@hellocollege.com", role: "Admin", status: "Active" },
  { id: 5, name: "Ian Simon", email: "ian.simon@hellocollege.com", role: "Essay Coach", status: "Active" },
  { id: 6, name: "Allison Dahleen", email: "allison.dahleen@hellocollege.com", role: "Counselor", status: "Active" },
  { id: 7, name: "Raymond Gonzales", email: "raymond.gonzales@hellocollege.com", role: "Tutor", status: "Active" },
  { id: 8, name: "Miracle Husband", email: "miracle.husband@hellocollege.com", role: "Tutor", status: "Inactive" },
];

const SAMPLE_EMAILS = [
  { id: 1, name: "Welcome Email", subject: "Welcome to HelloCollege!", lastEdited: "02/14/26", status: "Active" },
  { id: 2, name: "Password Reset", subject: "Reset your HelloCollege password", lastEdited: "01/08/26", status: "Active" },
  { id: 3, name: "Workshop Reminder", subject: "Reminder: Your upcoming workshop", lastEdited: "02/28/26", status: "Active" },
  { id: 4, name: "Application Deadline", subject: "Application deadline approaching!", lastEdited: "03/01/26", status: "Active" },
  { id: 5, name: "Meeting Confirmation", subject: "Your meeting has been confirmed", lastEdited: "12/20/25", status: "Active" },
  { id: 6, name: "Meeting Cancellation", subject: "Meeting cancelled - please reschedule", lastEdited: "12/20/25", status: "Active" },
  { id: 7, name: "Essay Feedback Ready", subject: "Your essay feedback is ready for review", lastEdited: "01/15/26", status: "Active" },
  { id: 8, name: "Task Assignment", subject: "New task assigned to you", lastEdited: "02/10/26", status: "Active" },
  { id: 9, name: "Progress Report", subject: "Monthly progress update", lastEdited: "03/02/26", status: "Draft" },
  { id: 10, name: "Parent Newsletter", subject: "HelloCollege monthly newsletter", lastEdited: "02/25/26", status: "Draft" },
  { id: 11, name: "Financial Aid Reminder", subject: "Don't forget to submit your FAFSA", lastEdited: "11/30/25", status: "Active" },
  { id: 12, name: "Summer Program Info", subject: "Summer enrichment opportunities", lastEdited: "01/05/26", status: "Draft" },
];

/* ── Sub-tab definitions ─────────────────────────────────────────── */

const SUB_TABS = ["Students", "Employees", "Emails", "Portal Settings"];

/* ── Students Sub-tab ────────────────────────────────────────────── */

function StudentsTab() {
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = SAMPLE_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || s.highSchool.toLowerCase().includes(search.toLowerCase());
    const matchesYear = filterYear === "All" || s.gradYear === parseInt(filterYear);
    const matchesStatus = filterStatus === "All" || s.status === filterStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case "name": va = a.name; vb = b.name; break;
      case "email": va = a.email; vb = b.email; break;
      case "status": va = a.status; vb = b.status; break;
      case "gradYear": va = a.gradYear; vb = b.gradYear; break;
      case "highSchool": va = a.highSchool; vb = b.highSchool; break;
      default: va = a.name; vb = b.name;
    }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const gradYears = [...new Set(SAMPLE_STUDENTS.map(s => s.gradYear))].sort();
  const statuses = [...new Set(SAMPLE_STUDENTS.map(s => s.status))].sort();

  const SortHeader = ({ col, label }) => (
    <th className="text-left px-4 py-3 text-xs font-semibold cursor-pointer select-none hover:bg-gray-50" style={{ color: "#281d51" }} onClick={() => handleSort(col)}>
      <div className="flex items-center gap-1">
        {label}
        {sortCol === col && <span className="text-xs">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
      </div>
    </th>
  );

  const statusColor = (s) => {
    if (s === "Active") return { bg: "#e6faf6", text: "#00c9a7" };
    if (s === "Inactive") return { bg: "#fde8ed", text: "#ff3467" };
    return { bg: "#fef9e7", text: "#d49b00" };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search students..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="px-4 py-2 rounded-lg text-sm w-72" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          <select value={filterYear} onChange={e => { setFilterYear(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}>
            <option value="All">All Years</option>
            {gradYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}>
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of {SAMPLE_STUDENTS.length} students</span>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ ADD STUDENT</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <SortHeader col="name" label="Name" />
              <SortHeader col="email" label="Email" />
              <SortHeader col="status" label="Status" />
              <SortHeader col="gradYear" label="Grad Year" />
              <SortHeader col="highSchool" label="High School" />
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(s => {
              const sc = statusColor(s.status);
              return (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #f0edf5" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{s.name}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{s.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{s.gradYear}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{s.highSchool}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-xs px-3 py-1 rounded font-medium hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Edit</button>
                    <button className="text-xs px-3 py-1 rounded font-medium hover:opacity-80" style={{ backgroundColor: s.status === "Active" ? "#fde8ed" : "#e6faf6", color: s.status === "Active" ? "#ff3467" : "#00c9a7" }}>
                      {s.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Prev</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 rounded text-sm font-medium disabled:opacity-40" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Employees Sub-tab ───────────────────────────────────────────── */

function EmployeesTab() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const roles = [...new Set(SAMPLE_EMPLOYEES.map(e => e.role))].sort();

  const filtered = SAMPLE_EMPLOYEES.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "All" || e.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va, vb;
    switch (sortCol) {
      case "name": va = a.name; vb = b.name; break;
      case "email": va = a.email; vb = b.email; break;
      case "role": va = a.role; vb = b.role; break;
      case "status": va = a.status; vb = b.status; break;
      default: va = a.name; vb = b.name;
    }
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const SortHeader = ({ col, label }) => (
    <th className="text-left px-4 py-3 text-xs font-semibold cursor-pointer select-none hover:bg-gray-50" style={{ color: "#281d51" }} onClick={() => handleSort(col)}>
      <div className="flex items-center gap-1">
        {label}
        {sortCol === col && <span className="text-xs">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>}
      </div>
    </th>
  );

  const roleColor = (r) => {
    if (r === "Admin") return { bg: "#ede8f5", text: "#55478f" };
    if (r === "Counselor") return { bg: "#e0f0f4", text: "#42778c" };
    if (r === "Essay Coach") return { bg: "#fef3e2", text: "#c77d00" };
    return { bg: "#e6faf6", text: "#00c9a7" };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 rounded-lg text-sm w-72" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}>
            <option value="All">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of {SAMPLE_EMPLOYEES.length} employees</span>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ ADD EMPLOYEE</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <SortHeader col="name" label="Name" />
              <SortHeader col="email" label="Email" />
              <SortHeader col="role" label="Role" />
              <SortHeader col="status" label="Status" />
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => {
              const rc = roleColor(e.role);
              const isActive = e.status === "Active";
              return (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #f0edf5" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>{e.name}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{e.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: rc.bg, color: rc.text }}>{e.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: isActive ? "#e6faf6" : "#fde8ed", color: isActive ? "#00c9a7" : "#ff3467" }}>{e.status}</span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-xs px-3 py-1 rounded font-medium hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Edit</button>
                    <button className="text-xs px-3 py-1 rounded font-medium hover:opacity-80" style={{ backgroundColor: isActive ? "#fde8ed" : "#e6faf6", color: isActive ? "#ff3467" : "#00c9a7" }}>
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Emails Sub-tab ──────────────────────────────────────────────── */

function EmailsTab() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = SAMPLE_EMAILS.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 rounded-lg text-sm w-72" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
          <span className="text-sm" style={{ color: "#b2b2b2" }}>Showing {filtered.length} of {SAMPLE_EMAILS.length} templates</span>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>+ NEW TEMPLATE</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8f7fc", borderBottom: "2px solid #e5e0f0" }}>
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Template Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Subject</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Last Edited</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Status</th>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: "#281d51" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const isActive = e.status === "Active";
              return (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid #f0edf5" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#281d51" }}>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#55478f" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {e.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#474747" }}>{e.subject}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#b2b2b2" }}>{e.lastEdited}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: isActive ? "#e6faf6" : "#fef9e7", color: isActive ? "#00c9a7" : "#d49b00" }}>{e.status}</span>
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button className="text-xs px-3 py-1 rounded font-medium hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Edit</button>
                    <button className="text-xs px-3 py-1 rounded font-medium hover:opacity-80" style={{ backgroundColor: isActive ? "#fef9e7" : "#e6faf6", color: isActive ? "#d49b00" : "#00c9a7" }}>
                      {isActive ? "Set Draft" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Portal Settings Sub-tab ─────────────────────────────────────── */

function PortalSettingsTab() {
  const [companyName, setCompanyName] = useState("HelloCollege");
  const [supportEmail, setSupportEmail] = useState("support@hellocollege.com");
  const [timezone, setTimezone] = useState("America/Denver");
  const [primaryColor, setPrimaryColor] = useState("#281d51");
  const [secondaryColor, setSecondaryColor] = useState("#55478f");
  const [studentPortal, setStudentPortal] = useState(true);
  const [essayCoachPortal, setEssayCoachPortal] = useState(true);
  const [tutorPortal, setTutorPortal] = useState(false);

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid #f0edf5" }}>
      <div>
        <div className="text-sm font-semibold" style={{ color: "#281d51" }}>{label}</div>
        <div className="text-xs mt-0.5" style={{ color: "#b2b2b2" }}>{description}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
        style={{ backgroundColor: checked ? "#00e6c3" : "#c0bad4" }}
      >
        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ left: checked ? "22px" : "2px" }} />
      </button>
    </div>
  );

  const timezones = [
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "America/Phoenix", "America/Anchorage", "Pacific/Honolulu",
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* General Settings Card */}
      <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: "1px solid #e5e0f0" }}>
        <h3 className="text-base font-bold mb-5" style={{ color: "#281d51" }}>General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#281d51" }}>Company Name</label>
            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#281d51" }}>Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#55478f" }}>
                <span className="text-white font-bold text-xl" style={{ fontFamily: "Montserrat" }}>HC</span>
              </div>
              <button className="text-xs px-4 py-2 rounded-lg font-medium hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Upload New Logo</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#281d51" }}>Support Email</label>
            <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#281d51" }}>Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}>
              {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Branding & Feature Toggles Card */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: "1px solid #e5e0f0" }}>
          <h3 className="text-base font-bold mb-5" style={{ color: "#281d51" }}>Branding</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#281d51" }}>Primary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="px-3 py-2 rounded-lg text-sm w-32 font-mono" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#281d51" }}>Secondary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="px-3 py-2 rounded-lg text-sm w-32 font-mono" style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: primaryColor }} />
              <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: secondaryColor }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6" style={{ border: "1px solid #e5e0f0" }}>
          <h3 className="text-base font-bold mb-2" style={{ color: "#281d51" }}>Feature Toggles</h3>
          <Toggle label="Student Portal" description="Allow students to access their own portal view" checked={studentPortal} onChange={setStudentPortal} />
          <Toggle label="Essay Coach Portal" description="Enable the essay coach role and dashboard" checked={essayCoachPortal} onChange={setEssayCoachPortal} />
          <Toggle label="Tutor Portal" description="Enable the tutor role and dashboard" checked={tutorPortal} onChange={setTutorPortal} />
        </div>
      </div>

      {/* Save bar spanning both columns */}
      <div className="col-span-2 flex justify-end gap-3 pt-2">
        <button className="px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Reset Changes</button>
        <button className="px-5 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: "#55478f" }}>Save Settings</button>
      </div>
    </div>
  );
}

/* ── Main Settings Page ──────────────────────────────────────────── */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Students");

  return (
    <div className="p-6">
      {/* Sub-tab bar */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: "2px solid #e5e0f0" }}>
        {SUB_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-3 text-sm font-semibold transition-colors relative"
            style={{
              color: activeTab === tab ? "#281d51" : "#b2b2b2",
              borderBottom: activeTab === tab ? "3px solid #ff3467" : "3px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Students" && <StudentsTab />}
      {activeTab === "Employees" && <EmployeesTab />}
      {activeTab === "Emails" && <EmailsTab />}
      {activeTab === "Portal Settings" && <PortalSettingsTab />}
    </div>
  );
}
