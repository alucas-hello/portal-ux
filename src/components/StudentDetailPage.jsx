import { useState } from "react";
import { StudentAvatar, TeamAvatar } from "./Avatars";
import Icons from "./Icons";
import Timeline from "./Timeline";
import { TASK_MILESTONES, WORKSHOPS } from "../data/milestones";
import { TASK_ICONS, WORKSHOP_ICONS } from "../data/constants";
import { SAMPLE_STUDENTS } from "../data/students";
import { generateTaskStatus, generateWorkshopStatus, getTaskDueDate, getEffectiveStatus } from "../utils/status";

/* ------------------------------------------------------------------ */
/*  Reusable helpers                                                   */
/* ------------------------------------------------------------------ */

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
      <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{label}</p>
      <p className="text-sm font-bold mt-1" style={{ color: "#281d51" }}>{value}</p>
    </div>
  );
}

function InputField({ label, value, type = "text", wide = false, editing = true }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{label}</label>
      {editing ? (
        type === "textarea" ? (
          <textarea defaultValue={value} className="w-full px-3 py-2 border rounded-lg text-sm mt-1" style={{ borderColor: "#c0bad4", minHeight: "72px" }} />
        ) : (
          <input type={type} defaultValue={value} className="w-full px-3 py-2 border rounded-lg text-sm mt-1" style={{ borderColor: "#c0bad4" }} />
        )
      ) : (
        <p className="text-sm mt-0.5 font-medium truncate" style={{ color: "#281d51" }}>{value || "—"}</p>
      )}
    </div>
  );
}

function SelectField({ label, value, options = [], editing = true }) {
  return (
    <div>
      <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{label}</label>
      {editing ? (
        <select defaultValue={value} className="w-full px-3 py-2 border rounded-lg text-sm mt-1" style={{ borderColor: "#c0bad4", color: "#281d51" }}>
          {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      ) : (
        <p className="text-sm mt-0.5 font-medium" style={{ color: "#281d51" }}>{value || "—"}</p>
      )}
    </div>
  );
}

function CheckboxField({ label, checked = false, editing = true }) {
  return editing ? (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" defaultChecked={checked} />
      <span style={{ color: "#474747" }}>{label}</span>
    </label>
  ) : checked ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{label}</span>
  ) : null;
}

function CheckboxGroup({ title, options, checkedItems = [], editing = true }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>{title}</p>
      {editing ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {options.map((o, i) => (
            <label key={i} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" defaultChecked={checkedItems.includes(o)} />
              <span style={{ color: "#474747" }}>{o}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {checkedItems.length > 0
            ? checkedItems.map((o) => <span key={o} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{o}</span>)
            : <span className="text-xs" style={{ color: "#b2b2b2" }}>—</span>}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, isOpen, onToggle, count }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between py-3 px-1 text-left group">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold" style={{ color: "#281d51" }}>{title}</span>
        {count != null && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{count}</span>}
      </div>
      <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: "#8e7bb7" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
  );
}

function SectionCard({ children }) {
  return <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

function StudentDetailPage({ student, editing = false, onBack, onLoginAsStudent, onDotClick }) {
  const [activeTab, setActiveTab] = useState("counselor");

  // Section collapse state — all open by default
  const [openSections, setOpenSections] = useState({
    basic: true, finalSurvey: false, studentInfo: true, scores: true,
    collegeDecision: true, importantNotes: true, conversationLog: true,
    selectedServices: true, programStatuses: true, team: true,
    family: true, documents: true, transactionLog: false, loginHistory: false,
    hsQuestions: true, financials: true, password: false,
  });
  const toggle = (key) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  const [modal, setModal] = useState(null);
  const [convNoteType, setConvNoteType] = useState("Counselor Time");

  /* ---- Sample data for sections not on the student object ---- */

  const conversationLog = [
    { date: "03/01/26", employee: "Alex Morgan", type: "Counselor Session", subject: "College List Review", topic: "College Selection", comment: "Discussed safety schools and reach schools. Student interested in engineering programs.", actions: "Edit" },
    { date: "02/25/26", employee: "Taylor Reed", type: "Essay Session", subject: "Personal Statement Draft", topic: "Common App Essay", comment: "Reviewed first draft of common app essay. Excellent narrative voice.", actions: "Edit" },
    { date: "02/15/26", employee: "Jamie Park", type: "Tutoring Session", subject: "ACT Prep - Reading", topic: "Test Prep", comment: "Worked on time management strategies for reading section.", actions: "Edit" },
    { date: "02/01/26", employee: "Alex Morgan", type: "Admin/Communications", subject: "Schedule Update", topic: "Admin", comment: "Rescheduled March counseling sessions per parent request.", actions: "Edit" },
    { date: "01/20/26", employee: "Taylor Reed", type: "Essay Session", subject: "Supplemental Essays", topic: "Supplementals", comment: "Brainstormed ideas for UF and Emory supplemental prompts.", actions: "Edit" },
    { date: "01/10/26", employee: "Alex Morgan", type: "Counselor Session", subject: "Financial Aid Strategy", topic: "Financial Aid", comment: "Reviewed FAFSA timeline and merit scholarship opportunities.", actions: "Edit" },
  ];

  const ycbmEvents = [
    { type: "Counselor Meeting", date: "03/15/26", profile: "Alex Morgan", time: "2:00 PM" },
    { type: "Essay Session", date: "03/12/26", profile: "Taylor Reed", time: "3:30 PM" },
    { type: "Tutoring Session", date: "03/10/26", profile: "Jamie Park", time: "4:00 PM" },
    { type: "Counselor Meeting", date: "03/20/26", profile: "Alex Morgan", time: "1:00 PM" },
  ];

  const [familyMembers, setFamilyMembers] = useState([
    { name: "Sarah Hart", relationship: "Mother", email: "sarah.hart@email.com", phone: "(555)867-5308", occupation: "Marketing Director", employer: "TechCorp Inc." },
    { name: "Michael Hart", relationship: "Father", email: "mhart@email.com", phone: "(555)867-5310", occupation: "Attorney", employer: "Hart & Associates" },
    { name: "Emma Hart", relationship: "Sibling", email: "emma.hart@email.com", phone: "(555)867-5312", occupation: "College Sophomore", employer: "University of Georgia" },
  ]);
  const [familyForm, setFamilyForm] = useState({ name: "", relationship: "", email: "", phone: "", occupation: "", employer: "" });
  const [editingFamilyIdx, setEditingFamilyIdx] = useState(null);

  const selectedServices = [
    { name: "Premium Counseling Package", advisor: "Alex Morgan", enrollmentDate: "09/01/24", price: "$4,500.00" },
    { name: "Essay Coaching - Extended", advisor: "Taylor Reed", enrollmentDate: "09/01/24", price: "$2,800.00" },
    { name: "ACT Prep Tutoring", advisor: "Jamie Park", enrollmentDate: "10/15/24", price: "$1,200.00" },
    { name: "College Visit Planning", advisor: "Alex Morgan", enrollmentDate: "11/01/24", price: "$500.00" },
  ];

  const documents = [
    { name: "Transcript - Westview Academy.pdf", folder: "Transcripts", date: "01/15/26", size: "245 KB" },
    { name: "SAT Score Report.pdf", folder: "Test Scores", date: "12/01/25", size: "128 KB" },
    { name: "Resume_Hart_Madelyn.docx", folder: "Applications", date: "02/10/26", size: "67 KB" },
    { name: "Recommendation_Letter_AP_Bio.pdf", folder: "Recommendations", date: "02/20/26", size: "312 KB" },
    { name: "Common_App_Essay_Final.docx", folder: "Essays", date: "02/28/26", size: "54 KB" },
    { name: "FAFSA_Confirmation.pdf", folder: "Financial Aid", date: "01/05/26", size: "98 KB" },
    { name: "UF_Supplemental_Essay.docx", folder: "Essays", date: "03/01/26", size: "42 KB" },
  ];

  const transactionLog = [
    { date: "09/01/24", description: "Premium Counseling Package - Initial Payment", hours: 10, amount: "$2,250.00" },
    { date: "09/01/24", description: "Essay Coaching Extended - Initial Payment", hours: 8, amount: "$1,400.00" },
    { date: "10/15/24", description: "ACT Prep Tutoring - Full Payment", hours: 12, amount: "$1,200.00" },
    { date: "11/01/24", description: "College Visit Planning - Full Payment", hours: 5, amount: "$500.00" },
    { date: "01/01/25", description: "Premium Counseling Package - 2nd Payment", hours: 10, amount: "$2,250.00" },
    { date: "01/01/25", description: "Essay Coaching Extended - 2nd Payment", hours: 8, amount: "$1,400.00" },
  ];

  const loginHistory = [
    { date: "03/05/26 09:32 AM", ip: "192.168.1.105", device: "Chrome / macOS" },
    { date: "03/04/26 03:15 PM", ip: "192.168.1.105", device: "Safari / iOS 18" },
    { date: "03/02/26 11:48 AM", ip: "10.0.0.42", device: "Chrome / Windows 11" },
    { date: "02/28/26 08:22 AM", ip: "192.168.1.105", device: "Chrome / macOS" },
    { date: "02/25/26 06:10 PM", ip: "172.16.0.8", device: "Safari / iOS 18" },
  ];

  const collegeDecisions = [
    { college: "University of Florida", decision: "Accepted", status: "accepted" },
    { college: "Emory University", decision: "Accepted", status: "accepted" },
    { college: "University of Michigan", decision: "Waitlisted", status: "waitlist" },
    { college: "Duke University", decision: "Pending", status: "pending" },
    { college: "Vanderbilt University", decision: "Pending", status: "pending" },
    { college: "University of South Florida", decision: "Accepted", status: "accepted" },
    { college: "Florida State University", decision: "Accepted", status: "accepted" },
    { college: "Georgia Tech", decision: "Denied", status: "denied" },
    { college: "University of Virginia", decision: "Pending", status: "pending" },
    { college: "Wake Forest University", decision: "Accepted", status: "accepted" },
  ];

  const sIdx = SAMPLE_STUDENTS.indexOf(student);
  const taskItems = TASK_MILESTONES.map((name, tIdx) => {
    const raw = generateTaskStatus(sIdx, tIdx);
    const due = getTaskDueDate(tIdx, student.gradYear);
    return { icon: TASK_ICONS[tIdx], status: getEffectiveStatus(raw, due), name, dueDate: due };
  });
  const workshopItems = WORKSHOPS.map((name, wIdx) => {
    const raw = generateWorkshopStatus(sIdx, wIdx);
    const due = getTaskDueDate(wIdx, student.gradYear);
    return { icon: WORKSHOP_ICONS[wIdx], status: getEffectiveStatus(raw, due), name, dueDate: due };
  });

  const decisionColor = (status) => {
    if (status === "accepted") return { bg: "#e6fff9", text: "#42778c", border: "#00e6c3" };
    if (status === "denied") return { bg: "#fff0f3", text: "#ff3467", border: "#ff3467" };
    if (status === "waitlist") return { bg: "#fff7ed", text: "#92400e", border: "#fbbf24" };
    return { bg: "#f0ece8", text: "#55478f", border: "#c0bad4" };
  };

  const [convSearch, setConvSearch] = useState("");
  const [docFolder, setDocFolder] = useState("All");
  const filteredConversations = conversationLog.filter((c) =>
    !convSearch || [c.employee, c.subject, c.type, c.comment, c.topic].some((f) => f.toLowerCase().includes(convSearch.toLowerCase()))
  );
  const filteredDocs = documents.filter((d) => docFolder === "All" || d.folder === docFolder);
  const docFolders = ["All", ...new Set(documents.map((d) => d.folder))];

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="p-6">
      {/* ============================================================ */}
      {/*  TWO-COLUMN LAYOUT                                           */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-6">

        {/* ========== LEFT / MAIN COLUMN (2/3) ========== */}
        <div className="col-span-2 space-y-6">

          {/* -------------------------------------------------------- */}
          {/*  TOP CARD — Student header + hours + actions              */}
          {/* -------------------------------------------------------- */}
          <div className="bg-white rounded-lg shadow-sm p-6 relative" style={{ borderTop: "4px solid #55478f" }}>
            {/* Quick-access icon buttons — top right */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {[
                { key: "billing", title: "Services & Billing", d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                { key: "documents", title: "Documents", d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
                { key: "loginHistory", title: "Login History", d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
              ].map(({ key, title, d }) => (
                <button key={key} onClick={() => setModal(key)} title={title} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#8e7bb7" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} /></svg>
                </button>
              ))}
              {/* Family manage — group icon */}
              <button onClick={() => { setFamilyForm({ name: "", relationship: "", email: "", phone: "", occupation: "", employer: "" }); setEditingFamilyIdx(null); setModal("family"); }} title="Manage Family" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#8e7bb7" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </button>
            </div>
            <div className="flex items-start gap-4">
              <StudentAvatar student={student} size={60} />
              <div className="flex-1">
                <h2 className="text-2xl font-bold leading-tight" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</h2>
                <p className="text-sm mt-0.5" style={{ color: "#b2b2b2" }}>{student.highSchool} &bull; {student.state} &bull; Class of {student.gradYear}</p>
                <p className="text-xs mt-0.5" style={{ color: "#b2b2b2" }}>HC ID: HC-2026-0847 &bull; DOB: 04/15/2008 &bull; {student.email || "madelyn.hart@email.com"} &bull; {student.phone || "(555)867-5309"}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { label: "Counselor", used: student.counselorHoursUsed, total: student.counselorHoursTotal },
                    { label: "Essay", used: student.essayHoursUsed, total: student.essayHoursTotal },
                    { label: "Tutoring", used: student.tutorHoursUsed, total: student.tutorHoursTotal },
                  ].map(({ label, used, total }) => {
                    const pct = Math.min((used / total) * 100, 100);
                    const barColor = pct >= 90 ? "#ff3467" : pct >= 70 ? "#fbbf24" : "#00e6c3";
                    return (
                      <div key={label} className="relative overflow-hidden rounded-md px-2.5 py-1" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                        <div className="absolute inset-0 rounded-md" style={{ width: `${pct}%`, backgroundColor: barColor, opacity: 0.18 }} />
                        <p className="relative text-xs font-semibold leading-none" style={{ color: "#b2b2b2" }}>{label}</p>
                        <p className="relative text-sm font-bold leading-snug" style={{ color: "#281d51" }}>{used}<span className="font-normal text-xs" style={{ color: "#b2b2b2" }}>/{total} hrs</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Cadence */}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e5e0f0" }}>
              {editing ? (
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Pre (Up to Apr Jr)", value: "Monthly" },
                    { label: "Peak (May–Aug Jr)", value: "Bi-weekly" },
                    { label: "Peak (Sep–Dec Jr)", value: "Bi-weekly" },
                    { label: "Jan Sr – Grad", value: "Weekly" },
                  ].map(({ label, value }, idx) => (
                    <div key={idx}>
                      <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{label}</label>
                      <select defaultValue={value} className="w-full px-2 py-1 border rounded-lg text-xs mt-0.5" style={{ borderColor: "#c0bad4", color: "#281d51" }}>
                        <option>Monthly</option><option>Bi-weekly</option><option>Weekly</option><option>As Needed</option>
                      </select>
                    </div>
                  ))}
                  <div className="col-span-4 flex items-center gap-3 mt-1">
                    <span className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>Next Contact Date:</span>
                    <input type="date" defaultValue="2026-03-15" className="px-2 py-1 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>CADENCE</span>
                  {[
                    { label: "Pre", value: "Monthly" },
                    { label: "Peak Spring", value: "Bi-weekly" },
                    { label: "Peak Fall", value: "Bi-weekly" },
                    { label: "Senior", value: "Weekly" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-1">
                      <span className="text-xs" style={{ color: "#b2b2b2" }}>{label}:</span>
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{value}</span>
                    </div>
                  ))}
                  <span className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>Next: <span style={{ color: "#281d51" }}>03/15/2026</span></span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #e5e0f0" }}>
              <button onClick={onLoginAsStudent} className="px-3 py-1 rounded-lg font-semibold text-white text-xs" style={{ backgroundColor: "#281d51" }}>LOGIN AS STUDENT</button>
              <button className="px-3 py-1 rounded-lg font-semibold text-xs" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>SEND PASSWORD RESET</button>
              <button className="px-3 py-1 rounded-lg font-semibold text-xs" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>LOG ADMIN TASK</button>
            </div>

            {/* Family strip */}
            <div className="mt-3 pt-3 flex items-center gap-6" style={{ borderTop: "1px solid #e5e0f0" }}>
              <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#b2b2b2" }}>FAMILY</span>
              {familyMembers.slice(0, 2).map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>
                    {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-none truncate" style={{ color: "#281d51" }}>{m.name} <span className="font-normal" style={{ color: "#b2b2b2" }}>· {m.relationship}</span></p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#b2b2b2" }}>{m.phone}</p>
                  </div>
                </div>
              ))}
              {familyMembers.length > 2 && (
                <button onClick={() => { setFamilyForm({ name: "", relationship: "", email: "", phone: "", occupation: "", employer: "" }); setEditingFamilyIdx(null); setModal("family"); }} className="text-xs font-medium flex-shrink-0" style={{ color: "#42778c" }}>
                  +{familyMembers.length - 2} more
                </button>
              )}
            </div>
          </div>

          {/* ── ADD CONVERSATION ── */}
          {(() => {
            const NOTE_TYPES = [
              "Counselor Time", "Counselor No Show",
              "Essay Coaching Session", "Essay Coaching Session No Show",
              "Tutoring Session", "Tutor No Show",
              "Admin/Communications", "Group Session",
            ];
            const DUAL_PANEL_TYPES = ["Counselor Time", "Essay Coaching Session", "Tutoring Session", "Group Session"];
            const isDual = DUAL_PANEL_TYPES.includes(convNoteType);
            const HOURS_OPTS = ["Select conversation hour", "0.25", "0.5", "0.75", "1.0", "1.5", "2.0", "2.5", "3.0"];
            const Toolbar = () => (
              <div className="flex items-center gap-px px-2 py-1 flex-wrap" style={{ borderBottom: "1px solid #e5e0f0" }}>
                {[["B","font-bold"],["I","italic"],["S","line-through"]].map(([ch, cls]) => (
                  <button key={ch} type="button" className={`w-6 h-6 text-xs rounded hover:bg-gray-100 flex items-center justify-center ${cls}`} style={{ color: "#474747" }}>{ch}</button>
                ))}
                <span className="mx-1 text-xs" style={{ color: "#e5e0f0" }}>|</span>
                {/* Link */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Link">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
                <button type="button" className="w-6 h-6 text-xs font-bold rounded hover:bg-gray-100 flex items-center justify-center" style={{ color: "#474747" }} title="Heading">T</button>
                {/* Blockquote */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Blockquote">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
                {/* Code */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Code">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </button>
                <span className="mx-1 text-xs" style={{ color: "#e5e0f0" }}>|</span>
                {/* Bullets */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Bullet list">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                {/* Numbered list */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Numbered list">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </button>
                {/* Outdent / indent */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Outdent">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Indent">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="mx-1 text-xs" style={{ color: "#e5e0f0" }}>|</span>
                {/* Attachment */}
                <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Attach file">
                  <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                <div className="ml-auto flex gap-px">
                  {/* Undo / redo */}
                  <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Undo">
                    <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  </button>
                  <button type="button" className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center" title="Redo">
                    <svg className="w-3 h-3" fill="none" stroke="#474747" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
                  </button>
                </div>
              </div>
            );
            const Panel = ({ title }) => (
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
                <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid #e5e0f0", backgroundColor: "#faf9fd" }}>
                  <span className="text-sm font-bold" style={{ color: "#281d51" }}>{title}</span>
                  <button type="button" title="Help" className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>?</button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#474747" }}>Hours</label>
                    <select className="w-full px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
                      {HOURS_OPTS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <p className="text-xs mt-1" style={{ color: "#b2b2b2" }}>Hours can only be tracked for billable note types (Essay, Counselor, or Tutor sessions).</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#474747" }}>Subject</label>
                    <input type="text" className="w-full px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#474747" }}>Comment</label>
                    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #c0bad4" }}>
                      <Toolbar />
                      <textarea className="w-full px-3 py-2 text-xs resize-none outline-none" style={{ minHeight: 90 }} />
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs" style={{ color: "#474747" }}>
                    <input type="checkbox" />
                    Show subject and comment to clients
                  </label>
                </div>
              </div>
            );
            return (
              <div className="bg-white rounded-lg shadow-sm p-5">
                {/* Top row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#474747" }}>Select HC Employee</label>
                    <select className="w-full px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
                      <option>{student.counselor}</option>
                      <option>{student.essayCoach}</option>
                      <option>{student.tutor}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#474747" }}>Comment Date</label>
                    <input type="text" defaultValue="03/06/2026" className="w-full px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4", backgroundColor: "#f8f7fc" }} readOnly />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#474747" }}>Note Type</label>
                    <select value={convNoteType} onChange={(e) => setConvNoteType(e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: "#c0bad4" }}>
                      {NOTE_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                {/* Panels */}
                <div className={isDual ? "grid grid-cols-2 gap-4" : ""}>
                  <Panel title="Session" />
                  {isDual && <Panel title="Admin/Communications" />}
                </div>
                {/* Buttons */}
                <div className="flex justify-center gap-3 mt-4">
                  <button className="px-6 py-2 rounded-lg font-bold text-white text-xs tracking-wide" style={{ backgroundColor: "#55478f" }}>SAVE CONVERSATION</button>
                  <button className="px-6 py-2 rounded-lg font-bold text-white text-xs tracking-wide" style={{ backgroundColor: "#8e7bb7" }}>SAVE AND NOTIFY</button>
                </div>
              </div>
            );
          })()}

          {/* ── TASK & WORKSHOP TIMELINES ── */}
          <div className="bg-white rounded-lg shadow-sm px-5 py-4">
            <div className="mb-3">
              <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>TASKS</p>
              <Timeline
                items={taskItems}
                onDotClick={onDotClick ? (items, idx) => onDotClick(student, items, idx, "task") : undefined}
              />
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>WORKSHOPS</p>
              <Timeline
                items={workshopItems}
                onDotClick={onDotClick ? (items, idx) => onDotClick(student, items, idx, "workshop") : undefined}
              />
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  SECTION 1: BASIC INFORMATION                            */}
          {/* -------------------------------------------------------- */}
          <SectionCard>
            <SectionHeader title="Basic Information" isOpen={openSections.basic} onToggle={() => toggle("basic")} />
            {openSections.basic && (editing ? (
              <>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <InputField label="First Name" value={student.firstName} editing={editing} />
                  <InputField label="Last Name" value={student.lastName} editing={editing} />
                  <SelectField label="Gender" value={student.gender || "Female"} options={["Male", "Female", "Transgender", "Non-binary", "Prefer not to respond"]} editing={editing} />
                  <InputField label="Email" value={student.email || "madelyn.hart@email.com"} type="email" editing={editing} />
                  <InputField label="Secondary Email" value="madelyn.h@school.edu" type="email" editing={editing} />
                  <InputField label="Mobile Phone" value={student.phone || "(555)867-5309"} editing={editing} />
                  <InputField label="Home Phone" value="(555)867-5300" editing={editing} />
                  <InputField label="Birth Date" value="04/15/2008" type="date" editing={editing} />
                  <InputField label="High School" value={student.highSchool} editing={editing} />
                  <InputField label="Graduation Year" value={student.gradYear} editing={editing} />
                  <InputField label="Enrollment Date" value="09/01/2024" editing={editing} />
                  <InputField label="Major" value={student.major || "Psychology"} editing={editing} />
                  <InputField label="City" value="Tampa" editing={editing} />
                  <InputField label="State" value={student.state} editing={editing} />
                  <InputField label="Zip" value="33602" editing={editing} />
                  <InputField label="Address" value="1234 Oak Street" editing={editing} />
                  <SelectField label="Citizenship" value="U.S. Citizen" options={["U.S. Citizen", "Permanent Resident", "International Student", "DACA/Undocumented", "Other"]} editing={editing} />
                  <SelectField label="Ethnicity" value="Not Hispanic" options={["Hispanic/Latino", "Not Hispanic", "Prefer not to respond"]} editing={editing} />
                  <SelectField label="Race" value="White" options={["American Indian/Alaska Native", "Asian", "Black/African American", "Native Hawaiian/Pacific Islander", "White", "Two or more races", "Prefer not to respond"]} editing={editing} />
                  <InputField label="HC ID" value="HC-2026-0847" editing={editing} />
                  <InputField label="Account Balance" value="$0.00" editing={editing} />
                  <InputField label="Desired Outcomes" value="Strong pre-med program with research opportunities" editing={editing} />
                </div>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <CheckboxField label="Active" checked={true} editing={editing} />
                  <CheckboxField label="Suspended" editing={editing} />
                  <CheckboxField label="Hidden" editing={editing} />
                  <CheckboxField label="On Hold" editing={editing} />
                  <CheckboxField label="Reference" checked={true} editing={editing} />
                </div>
                <div className="mt-6 pt-4" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <SectionHeader title="High School Related Questions" isOpen={openSections.hsQuestions} onToggle={() => toggle("hsQuestions")} />
                  {openSections.hsQuestions && (
                    <>
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <CheckboxField label="1st Generation" editing={editing} />
                        <CheckboxField label="Highly Selective" checked={true} editing={editing} />
                        <CheckboxField label="IEP or 504" editing={editing} />
                        <CheckboxField label="Scholarship Potential" checked={true} editing={editing} />
                        <CheckboxField label="BSMD" editing={editing} />
                        <CheckboxField label="Family Military" editing={editing} />
                        <CheckboxField label="Other" editing={editing} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Work Ethic" value="Strong work ethic, self-motivated learner" type="textarea" editing={editing} />
                        <InputField label="Challenges" value="Time management during swim season" type="textarea" editing={editing} />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <SectionHeader title="Financial Details" isOpen={openSections.financials} onToggle={() => toggle("financials")} />
                  {openSections.financials && (
                    <div className="grid grid-cols-3 gap-4">
                      <InputField label="Fed. Aid Estimate" value="$5,500" editing={editing} />
                      <SelectField label="Household Income" value="$120,000-$150,000" options={["Under $30K", "$30K-$60K", "$60K-$90K", "$90K-$120K", "$120K-$150K", "$150K-$200K", "$200K-$300K", "$300K+"]} editing={editing} />
                      <InputField label="Non-Retirement Assets" value="$85,000" editing={editing} />
                      <InputField label="College Savings" value="$45,000" editing={editing} />
                      <InputField label="Willing to Pay (annual)" value="$25,000/year" editing={editing} />
                      <div className="flex flex-col justify-end gap-2">
                        <CheckboxField label="Considering Loans" checked={true} editing={editing} />
                        <CheckboxField label="OK Discussing w/ Student" checked={true} editing={editing} />
                        <CheckboxField label="OK Discussing w/ HC Team" checked={true} editing={editing} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <SectionHeader title="Change Student Password" isOpen={openSections.password} onToggle={() => toggle("password")} />
                  {openSections.password && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="New Password" value="" type="password" editing={editing} />
                      <InputField label="Password Confirmation" value="" type="password" editing={editing} />
                      <div className="flex items-center gap-4">
                        <CheckboxField label="Autogenerate" editing={editing} />
                        <CheckboxField label="Send to Student" editing={editing} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── READ-ONLY COMPACT VIEW ── */
              <div className="mt-3 space-y-2 text-xs" style={{ color: "#474747" }}>
                {/* Status flags + ID */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#00e6c3", color: "#fff" }}>Active</span>
                  <span className="px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Reference</span>
                  <span style={{ color: "#b2b2b2" }}>HC-2026-0847</span>
                  <span style={{ color: "#b2b2b2" }}>·</span>
                  <span style={{ color: "#b2b2b2" }}>$0.00 balance</span>
                  <span style={{ color: "#b2b2b2" }}>·</span>
                  <span style={{ color: "#b2b2b2" }}>Female</span>
                  <span style={{ color: "#b2b2b2" }}>·</span>
                  <span style={{ color: "#b2b2b2" }}>DOB 04/15/2008</span>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
                  {[
                    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email", val: student.email || "madelyn.hart@email.com" },
                    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Secondary email", val: "madelyn.h@school.edu" },
                    { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Mobile", val: student.phone || "(555)867-5309" },
                    { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Home phone", val: "(555)867-5300" },
                  ].map(({ icon, label, val }) => (
                    <span key={label} className="flex items-center gap-1" title={label}>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="#b2b2b2" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
                      {val}
                    </span>
                  ))}
                </div>

                {/* School + enrollment */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 pt-0.5">
                  <span className="flex items-center gap-1" title="High school">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="#b2b2b2" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m-7-3.75V17m14-6.75V17" /></svg>
                    {student.highSchool}
                  </span>
                  <span title="Grad year" style={{ color: "#b2b2b2" }}>Class of {student.gradYear}</span>
                  <span title="Enrollment date" style={{ color: "#b2b2b2" }}>Enrolled 09/01/2024</span>
                  <span className="flex items-center gap-1" title="Major">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="#b2b2b2" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    {student.major || "Psychology"}
                  </span>
                </div>

                {/* Location + demographics */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 pt-0.5">
                  <span className="flex items-center gap-1" title="Address">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="#b2b2b2" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    1234 Oak Street, Tampa, {student.state} 33602
                  </span>
                  <span style={{ color: "#b2b2b2" }}>U.S. Citizen · Not Hispanic · White</span>
                </div>

                {/* Goals */}
                <div className="pt-0.5 flex gap-1">
                  <span className="font-semibold flex-shrink-0" style={{ color: "#b2b2b2" }}>Goals:</span>
                  <span>Strong pre-med program with research opportunities</span>
                </div>

                {/* HS flags */}
                <div className="pt-2 mt-1 flex flex-wrap gap-x-4 gap-y-1.5" style={{ borderTop: "1px solid #f0ece8" }}>
                  <span className="font-semibold flex-shrink-0" style={{ color: "#b2b2b2" }}>HS Flags</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Highly Selective</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Scholarship Potential</span>
                </div>
                <div className="flex gap-x-5 flex-wrap gap-y-1">
                  <span><span className="font-semibold" style={{ color: "#b2b2b2" }}>Ethic: </span>Strong work ethic, self-motivated learner</span>
                  <span><span className="font-semibold" style={{ color: "#b2b2b2" }}>Challenges: </span>Time management during swim season</span>
                </div>

                {/* Financials */}
                <div className="pt-2 mt-1 flex flex-wrap gap-x-5 gap-y-1" style={{ borderTop: "1px solid #f0ece8" }}>
                  <span className="font-semibold flex-shrink-0" style={{ color: "#b2b2b2" }}>Financials</span>
                  {[
                    ["Aid", "$5,500"],
                    ["Income", "$120K–$150K"],
                    ["Assets", "$85K"],
                    ["Savings", "$45K"],
                    ["Pay/yr", "$25K"],
                  ].map(([k, v]) => (
                    <span key={k}><span style={{ color: "#b2b2b2" }}>{k}: </span><span className="font-semibold" style={{ color: "#281d51" }}>{v}</span></span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Considering Loans</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>OK w/ Student</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>OK w/ HC Team</span>
                </div>
              </div>
            ))}
          </SectionCard>


          {/* -------------------------------------------------------- */}
          {/*  SECTION 3: STUDENT INFORMATION (65 fields)              */}
          {/* -------------------------------------------------------- */}
          <SectionCard>
            <SectionHeader title="Student Information" isOpen={openSections.studentInfo} onToggle={() => toggle("studentInfo")} />
            {openSections.studentInfo && (editing ? (
              <>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <InputField label="Extracurricular Activities" value="Varsity swim team (captain), debate team, NHS, Mental Health Awareness Club president, peer tutoring" type="textarea" editing={editing} />
                  <InputField label="Hobbies" value="Swimming, reading psychology books, journaling, volunteering at local hospital" type="textarea" editing={editing} />
                  <InputField label="Employment" value="Part-time lab assistant at USF Neuroscience Department (10 hrs/week)" type="textarea" editing={editing} />
                  <InputField label="Fun Facts" value="Loves neuroscience documentaries, collects vintage psychology textbooks, speaks conversational Spanish" type="textarea" editing={editing} />
                  <InputField label="Potential Major(s)" value="Psychology, Neuroscience, Cognitive Science" type="textarea" editing={editing} />
                  <SelectField label="Commitment to Major" value="Very Committed" options={["Very Committed", "Somewhat Committed", "Exploring Options", "Undecided"]} editing={editing} />
                  <InputField label="College Goals" value="Pre-med track with strong undergraduate research, D3 swimming, active campus life" type="textarea" editing={editing} />
                  <InputField label="Career Interests" value="Clinical psychology, neuroscience research, psychiatric medicine" type="textarea" editing={editing} />
                  <InputField label="Dream Job" value="Neuropsychologist at a research hospital" editing={editing} />
                  <InputField label="Interested Colleges" value="UF, Emory, Duke, UVA, Michigan, Vanderbilt, Wake Forest, FSU, USF, Georgia Tech" editing={editing} />
                </div>
                <div className="mt-6 space-y-3 pt-4" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <p className="text-sm font-bold" style={{ color: "#281d51" }}>College Preferences</p>
                  <div className="grid grid-cols-2 gap-4">
                    <CheckboxGroup title="Region" options={["West", "Midwest", "Northwest", "South", "Southwest", "Southeast", "Midatlantic", "Northeast", "No Preference"]} checkedItems={["Southeast", "Northeast"]} editing={editing} />
                    <CheckboxGroup title="Setting" options={["Urban", "Suburban", "Rural", "No Preference"]} checkedItems={["Urban", "Suburban"]} editing={editing} />
                    <CheckboxGroup title="Size" options={["X-Large (25k+)", "Large (15-25k)", "Med (5-15k)", "Small (under 5k)", "No Preference"]} checkedItems={["Large (15-25k)", "Med (5-15k)"]} editing={editing} />
                    <CheckboxGroup title="Diversity" options={["HBCU", "Diverse Campus Important", "All Male", "All Female", "No Preference"]} checkedItems={["Diverse Campus Important"]} editing={editing} />
                    <CheckboxGroup title="Political Climate" options={["Conservative", "Moderate", "Liberal", "No Preference"]} checkedItems={["No Preference"]} editing={editing} />
                    <CheckboxGroup title="Athletics" options={["Scholarship Desired", "D1 Desired", "Not a Consideration"]} checkedItems={["Not a Consideration"]} editing={editing} />
                  </div>
                </div>
                <div className="mt-6 pt-4" style={{ borderTop: "1px solid #e5e0f0" }}>
                  <p className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Ranked Preferences</p>
                  <div className="grid grid-cols-3 gap-4">
                    <CheckboxGroup title="Academic Selectivity" options={["Elite", "Highly Selective", "Moderately Selective", "Open Enrollment", "No Preference"]} checkedItems={["Highly Selective", "Moderately Selective"]} editing={editing} />
                    <SelectField label="Strength for My Major" value="Top Tier" options={["Top Tier", "Strong", "Adequate", "Not Important"]} editing={editing} />
                    <SelectField label="Brand Recognition" value="Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Student-Faculty Ratio" value="Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Study Abroad" value="Somewhat Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Affordability" value="Very Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Need-Based Aid" value="Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Merit Aid" value="Very Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Internships" value="Very Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Alumni Network" value="Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Job Placement" value="Very Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Religious Affiliation" value="No Preference" options={["Very Important", "Important", "Somewhat Important", "No Preference"]} editing={editing} />
                    <SelectField label="Athletic Reputation" value="Somewhat Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                    <SelectField label="Support Services" value="Important" options={["Very Important", "Important", "Somewhat Important", "Not Important"]} editing={editing} />
                  </div>
                </div>
              </>
            ) : (
              /* ── READ-ONLY COMPACT VIEW ── */
              <div className="mt-3 space-y-2 text-xs" style={{ color: "#474747" }}>
                {/* Profile text fields */}
                {[
                  { label: "Activities", val: "Varsity swim team (captain), debate team, NHS, Mental Health Awareness Club president, peer tutoring" },
                  { label: "Hobbies", val: "Swimming, reading psychology books, journaling, volunteering at local hospital" },
                  { label: "Employment", val: "Part-time lab assistant at USF Neuroscience Department (10 hrs/week)" },
                  { label: "Fun Facts", val: "Loves neuroscience documentaries, collects vintage psychology textbooks, speaks conversational Spanish" },
                  { label: "Goals", val: "Pre-med track with strong undergraduate research, D3 swimming, active campus life" },
                  { label: "Career", val: "Clinical psychology, neuroscience research, psychiatric medicine" },
                  { label: "Dream Job", val: "Neuropsychologist at a research hospital" },
                  { label: "Colleges", val: "UF, Emory, Duke, UVA, Michigan, Vanderbilt, Wake Forest, FSU, USF, Georgia Tech" },
                ].map(({ label, val }) => (
                  <div key={label} className="flex gap-1.5">
                    <span className="font-semibold flex-shrink-0 w-20 text-right" style={{ color: "#b2b2b2" }}>{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
                <div className="flex gap-1.5">
                  <span className="font-semibold flex-shrink-0 w-20 text-right" style={{ color: "#b2b2b2" }}>Major(s)</span>
                  <span>Psychology, Neuroscience, Cognitive Science</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Very Committed</span>
                </div>

                {/* Preferences */}
                <div className="pt-2 mt-1" style={{ borderTop: "1px solid #f0ece8" }}>
                  <p className="font-semibold mb-1.5" style={{ color: "#b2b2b2" }}>College Preferences</p>
                  <div className="space-y-1.5">
                    {[
                      { label: "Region", tags: ["Southeast", "Northeast"] },
                      { label: "Setting", tags: ["Urban", "Suburban"] },
                      { label: "Size", tags: ["Large (15-25k)", "Med (5-15k)"] },
                      { label: "Diversity", tags: ["Diverse Campus Important"] },
                      { label: "Politics", tags: ["No Preference"] },
                      { label: "Athletics", tags: ["Not a Consideration"] },
                    ].map(({ label, tags }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="font-semibold flex-shrink-0 w-20 text-right" style={{ color: "#b2b2b2" }}>{label}</span>
                        <div className="flex flex-wrap gap-1">
                          {tags.map((t) => <span key={t} className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ranked preferences — dot scale */}
                <div className="pt-2 mt-1" style={{ borderTop: "1px solid #f0ece8" }}>
                  <p className="font-semibold mb-1.5" style={{ color: "#b2b2b2" }}>Ranked Preferences</p>
                  {(() => {
                    const importanceColor = (v) => ({ "Very Important": "#281d51", "Top Tier": "#281d51", "Important": "#55478f", "Somewhat Important": "#8e7bb7", "No Preference": "#c0bad4", "Not Important": "#e5e0f0", "Strong": "#55478f", "Adequate": "#8e7bb7", "Highly Selective": "#281d51", "Moderately Selective": "#55478f" }[v] || "#c0bad4");
                    const ranked = [
                      ["Selectivity", "Highly Selective"],["Major Strength", "Top Tier"],["Brand", "Important"],
                      ["Faculty Ratio", "Important"],["Study Abroad", "Somewhat Important"],["Affordability", "Very Important"],
                      ["Need Aid", "Important"],["Merit Aid", "Very Important"],["Internships", "Very Important"],
                      ["Alumni", "Important"],["Job Placement", "Very Important"],["Religion", "No Preference"],
                      ["Athletics", "Somewhat Important"],["Support Svcs", "Important"],
                    ];
                    return (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        {ranked.map(([label, val]) => (
                          <div key={label} className="flex items-center justify-between gap-2">
                            <span style={{ color: "#b2b2b2" }}>{label}</span>
                            <span className="flex items-center gap-0.5" title={val}>
                              {[0,1,2,3].map((i) => {
                                const levels = { "Very Important": 4, "Top Tier": 4, "Important": 3, "Strong": 3, "Highly Selective": 4, "Moderately Selective": 3, "Somewhat Important": 2, "Adequate": 2, "No Preference": 1, "Not Important": 0 };
                                const filled = i < (levels[val] ?? 1);
                                return <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: filled ? importanceColor(val) : "#e5e0f0" }} />;
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </SectionCard>



















        </div>

        {/* ========== RIGHT SIDEBAR (1/3) ========== */}
        <div className="space-y-6">

          {/* 1. Events */}
          <SectionCard>
            <h3 className="text-sm font-bold mb-2" style={{ color: "#281d51" }}>Events</h3>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e0f0" }}>
                  <th className="text-left pb-1 text-xs font-semibold" style={{ color: "#b2b2b2" }}>Appointment</th>
                  <th className="text-right pb-1 text-xs font-semibold" style={{ color: "#b2b2b2" }}>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {ycbmEvents.map((event, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f0ece8" }}>
                    <td className="py-1.5" style={{ color: "#281d51" }}>
                      <p className="font-medium text-xs">{event.type}</p>
                      <p className="text-xs" style={{ color: "#42778c" }}>{event.profile}</p>
                    </td>
                    <td className="py-1.5 text-right">
                      <p className="text-xs" style={{ color: "#b2b2b2" }}>{event.date}</p>
                      <p className="text-xs font-medium" style={{ color: "#b2b2b2" }}>{event.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-2 w-full text-center text-xs font-medium py-1.5 rounded-lg" style={{ color: "#42778c", backgroundColor: "#f0ece8" }}>View More</button>
          </SectionCard>

          {/* 2. Important Notes */}
          <SectionCard>
            <SectionHeader title="Important Notes" isOpen={openSections.importantNotes} onToggle={() => toggle("importantNotes")} count={3} />
            {openSections.importantNotes && (
              <div className="mt-2 space-y-2">
                {[
                  { admin: "Alex Morgan", date: "03/01/26", body: "Student is highly motivated and self-directed. Parents are very involved and responsive. Priority student for merit scholarship strategy — strong candidate for UF Benacquisto and Emory Scholars." },
                  { admin: "Taylor Reed", date: "02/15/26", body: "Essay voice is strong. Student should focus supplementals on neuroscience research experience at USF lab. Common App essay about mental health awareness club is compelling." },
                  { admin: "Don Keller", date: "01/10/26", body: "Family expressed concerns about cost at reach schools. Ensure financial aid strategy is discussed at every counselor meeting. Consider adding scholarship search service." },
                ].map((note, i) => (
                  <div key={i} className="rounded-lg px-3 py-2" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold" style={{ color: "#281d51" }}>{note.admin}</span>
                      <span className="text-xs" style={{ color: "#b2b2b2" }}>{note.date}</span>
                    </div>
                    <p className="text-xs" style={{ color: "#474747" }}>{note.body}</p>
                  </div>
                ))}
                <div className="pt-1">
                  <p className="text-xs font-semibold mb-1.5" style={{ color: "#b2b2b2" }}>ADD NEW NOTE</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <InputField label="Admin Name" value="" editing={true} />
                    <InputField label="Date" value="" type="date" editing={true} />
                  </div>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-xs" style={{ borderColor: "#c0bad4", minHeight: "60px" }} placeholder="Note body..." />
                  <button className="mt-1.5 px-3 py-1.5 rounded-lg font-medium text-white text-xs" style={{ backgroundColor: "#55478f" }}>SAVE NOTE</button>
                </div>
              </div>
            )}
          </SectionCard>

          {/* 3. Notes tabs */}
          <SectionCard>
            <div className="flex gap-2 mb-3" style={{ borderBottom: "2px solid #e5e0f0" }}>
              {["Counselor Notes", "Tutoring Notes", "Essay Notes"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-1.5 font-medium text-xs transition-all" style={{ color: activeTab === tab ? "#281d51" : "#b2b2b2", borderBottom: activeTab === tab ? "2px solid #ff3467" : "none", marginBottom: "-2px" }}>{tab}</button>
              ))}
            </div>
            <p className="text-xs mb-1.5" style={{ color: "#b2b2b2" }}>Last updated: 03/05/2026</p>
            <textarea className="w-full px-3 py-2 border rounded-lg text-xs" style={{ borderColor: "#c0bad4", minHeight: "88px" }} defaultValue={activeTab === "Counselor Notes" ? "Strong candidate for merit scholarships. Focus on UF, Emory, and Wake Forest applications. Student is very responsive and proactive." : activeTab === "Tutoring Notes" ? "ACT composite improved from 28 to 32 over 3 months. Focus on science section timing. Student excels in reading comprehension." : "Common App essay is nearly final. Outstanding narrative voice. Supplemental essays for UF and Emory are in good shape. Need to start Vanderbilt supplement."} />
            <button className="mt-2 px-3 py-1.5 rounded-lg font-medium text-white text-xs" style={{ backgroundColor: "#55478f" }}>SAVE NOTE</button>
          </SectionCard>

          {/* 5. Scores and Grades */}
          <SectionCard>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold" style={{ color: "#281d51" }}>Scores and Grades</h3>
              <button onClick={() => setModal("scores")} title="View Full Scores" className="p-1 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#8e7bb7" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "GPA (W)", value: student.gpaWeighted || "4.2", color: "#281d51" },
                { label: "GPA (UW)", value: student.gpaUnweighted || "3.9", color: "#281d51" },
                { label: "ACT", value: student.actComposite || 32, color: "#281d51" },
                { label: "SAT", value: student.satTotal || 1420, color: "#281d51" },
                { label: "AP Classes", value: student.apClasses?.length || 5, color: "#281d51" },
                { label: "Applied", value: collegeDecisions.length, color: "#281d51" },
                { label: "Accepted", value: collegeDecisions.filter((c) => c.status === "accepted").length, color: "#00e6c3" },
                { label: "Pending", value: collegeDecisions.filter((c) => c.status === "pending").length, color: "#fbbf24" },
                { label: "Selectivity", value: "Very Selective", color: "#281d51" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: "#b2b2b2" }}>{label}</span>
                  <span className="font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 6. Team */}
          <SectionCard>
            <h3 className="text-sm font-bold mb-2" style={{ color: "#281d51" }}>Team</h3>
            <div className="space-y-2">
              {[
                { name: student.counselor, role: "Counselor" },
                { name: student.essayCoach, role: "Essay Coach" },
                { name: student.tutor, role: "Tutor" },
              ].map((member, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <TeamAvatar name={member.name} role={member.role} size={30} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#281d51" }}>{member.name}</p>
                    <p className="text-xs" style={{ color: "#b2b2b2" }}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>

      {/* ============================================================ */}
      {/*  MODALS                                                       */}
      {/* ============================================================ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(40,29,81,0.45)" }} onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #e5e0f0" }}>
              <h2 className="text-lg font-bold" style={{ color: "#281d51" }}>
                {modal === "billing" && "Services & Billing"}
                {modal === "documents" && "Documents"}
                {modal === "loginHistory" && "Login History"}
                {modal === "conversationLog" && "Conversation Log"}
                {modal === "scores" && "Scores and Grades"}
                {modal === "family" && (editingFamilyIdx !== null ? "Edit Family Member" : "Manage Family")}
              </h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#8e7bb7" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-4">

              {/* BILLING — Selected Services + Transaction Log */}
              {modal === "billing" && (
                <div>
                  {/* Selected Services */}
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#b2b2b2" }}>Selected Services</p>
                  <table className="w-full text-sm mb-1">
                    <thead><tr style={{ borderBottom: "2px solid #e5e0f0" }}>
                      {["Service", "Advisor", "Enrolled", "Price"].map((h) => <th key={h} className="text-left py-2 font-semibold text-xs" style={{ color: "#b2b2b2" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {selectedServices.map((s, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f0ece8" }}>
                          <td className="py-2 font-medium" style={{ color: "#281d51" }}>{s.name}</td>
                          <td className="py-2" style={{ color: "#474747" }}>{s.advisor}</td>
                          <td className="py-2" style={{ color: "#b2b2b2" }}>{s.enrollmentDate}</td>
                          <td className="py-2 font-semibold" style={{ color: "#42778c" }}>{s.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot><tr>
                      <td colSpan={3} className="pt-2 text-xs font-semibold" style={{ color: "#b2b2b2" }}>Total Services</td>
                      <td className="pt-2 font-bold" style={{ color: "#281d51" }}>$9,000.00</td>
                    </tr></tfoot>
                  </table>

                  {/* Divider */}
                  <div className="my-5" style={{ borderTop: "2px solid #e5e0f0" }} />

                  {/* Transaction Log */}
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#b2b2b2" }}>Transaction Log</p>
                  <table className="w-full text-sm">
                    <thead><tr style={{ borderBottom: "2px solid #e5e0f0" }}>
                      {["Date", "Description", "Hours", "Amount"].map((h) => <th key={h} className={`py-2 font-semibold text-xs ${h === "Hours" || h === "Amount" ? "text-right" : "text-left"}`} style={{ color: "#b2b2b2" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {transactionLog.map((t, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f0ece8" }}>
                          <td className="py-2 text-xs" style={{ color: "#b2b2b2" }}>{t.date}</td>
                          <td className="py-2" style={{ color: "#474747" }}>{t.description}</td>
                          <td className="py-2 text-right text-xs font-medium" style={{ color: "#8e7bb7" }}>{t.hours} hr{t.hours !== 1 ? "s" : ""}</td>
                          <td className="py-2 text-right font-semibold" style={{ color: "#281d51" }}>{t.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot><tr>
                      <td colSpan={2} className="pt-2 text-xs font-semibold" style={{ color: "#b2b2b2" }}>Total Paid</td>
                      <td className="pt-2 text-right text-xs font-semibold" style={{ color: "#8e7bb7" }}>53 hrs</td>
                      <td className="pt-2 text-right font-bold" style={{ color: "#00e6c3" }}>$9,000.00</td>
                    </tr></tfoot>
                  </table>
                </div>
              )}

              {/* DOCUMENTS */}
              {modal === "documents" && (
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {docFolders.map((f) => (
                      <button key={f} onClick={() => setDocFolder(f)} className="px-3 py-1 rounded-full text-xs font-medium transition-colors" style={{ backgroundColor: docFolder === f ? "#55478f" : "#f0ece8", color: docFolder === f ? "white" : "#474747" }}>{f}</button>
                    ))}
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr style={{ borderBottom: "2px solid #e5e0f0" }}>
                      {["File Name", "Folder", "Date", "Size"].map((h) => <th key={h} className="text-left py-2 font-semibold text-xs" style={{ color: "#b2b2b2" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {filteredDocs.map((d, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f0ece8" }}>
                          <td className="py-2.5">
                            <button className="font-medium text-left hover:underline" style={{ color: "#42778c" }}>{d.name}</button>
                          </td>
                          <td className="py-2.5 text-xs" style={{ color: "#b2b2b2" }}>{d.folder}</td>
                          <td className="py-2.5 text-xs" style={{ color: "#b2b2b2" }}>{d.date}</td>
                          <td className="py-2.5 text-xs" style={{ color: "#b2b2b2" }}>{d.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}


              {/* LOGIN HISTORY */}
              {modal === "loginHistory" && (
                <table className="w-full text-sm">
                  <thead><tr style={{ borderBottom: "2px solid #e5e0f0" }}>
                    {["Date / Time", "IP Address", "Device"].map((h) => <th key={h} className="text-left py-2 font-semibold text-xs" style={{ color: "#b2b2b2" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {loginHistory.map((l, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f0ece8" }}>
                        <td className="py-2.5 text-xs font-medium" style={{ color: "#474747" }}>{l.date}</td>
                        <td className="py-2.5 text-xs font-mono" style={{ color: "#b2b2b2" }}>{l.ip}</td>
                        <td className="py-2.5 text-xs" style={{ color: "#b2b2b2" }}>{l.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* FAMILY */}
              {modal === "family" && (() => {
                const RELATIONSHIPS = ["Mother", "Father", "Step-Mother", "Step-Father", "Guardian", "Sibling", "Grandparent", "Other"];
                const isEditing = editingFamilyIdx !== null;
                const startEdit = (idx) => { setEditingFamilyIdx(idx); setFamilyForm({ ...familyMembers[idx] }); };
                const cancelEdit = () => { setEditingFamilyIdx(null); setFamilyForm({ name: "", relationship: "", email: "", phone: "", occupation: "", employer: "" }); };
                const saveMember = () => {
                  if (!familyForm.name.trim()) return;
                  if (isEditing) {
                    setFamilyMembers((prev) => prev.map((m, i) => i === editingFamilyIdx ? { ...familyForm } : m));
                  } else {
                    setFamilyMembers((prev) => [...prev, { ...familyForm }]);
                  }
                  cancelEdit();
                };
                const removeMember = (idx) => setFamilyMembers((prev) => prev.filter((_, i) => i !== idx));
                const ff = (field) => (e) => setFamilyForm((prev) => ({ ...prev, [field]: e.target.value }));
                const inputCls = "w-full px-3 py-1.5 border rounded-lg text-xs";
                const inputStyle = { borderColor: "#c0bad4" };
                return (
                  <div>
                    {/* Member list */}
                    <div className="space-y-3 mb-5">
                      {familyMembers.map((m, idx) => (
                        <div key={idx} className="rounded-lg px-4 py-3 flex items-start justify-between gap-4" style={{ border: "1px solid #e5e0f0", backgroundColor: editingFamilyIdx === idx ? "#f8f7fc" : "white" }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <p className="text-sm font-semibold" style={{ color: "#281d51" }}>{m.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{m.relationship}</span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "#474747" }}>{m.email} · {m.phone}</p>
                            {(m.occupation || m.employer) && <p className="text-xs" style={{ color: "#b2b2b2" }}>{m.occupation}{m.employer ? ` · ${m.employer}` : ""}</p>}
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button onClick={() => startEdit(idx)} className="px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-gray-100" style={{ color: "#55478f" }}>Edit</button>
                            <button onClick={() => removeMember(idx)} className="px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-red-50" style={{ color: "#ff3467" }}>Remove</button>
                          </div>
                        </div>
                      ))}
                      {familyMembers.length === 0 && <p className="text-sm text-center py-6" style={{ color: "#b2b2b2" }}>No family members added yet.</p>}
                    </div>

                    {/* Add / Edit form */}
                    <div className="rounded-xl p-4" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#b2b2b2" }}>{isEditing ? "Edit Family Member" : "Add Family Member"}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>Full Name</label>
                          <input className={inputCls} style={inputStyle} value={familyForm.name} onChange={ff("name")} placeholder="First Last" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>Relationship</label>
                          <select className={inputCls} style={inputStyle} value={familyForm.relationship} onChange={ff("relationship")}>
                            <option value="">Select…</option>
                            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>Email</label>
                          <input className={inputCls} style={inputStyle} value={familyForm.email} onChange={ff("email")} placeholder="email@example.com" type="email" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>Phone</label>
                          <input className={inputCls} style={inputStyle} value={familyForm.phone} onChange={ff("phone")} placeholder="(555) 000-0000" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>Occupation</label>
                          <input className={inputCls} style={inputStyle} value={familyForm.occupation} onChange={ff("occupation")} placeholder="Job title" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>Employer</label>
                          <input className={inputCls} style={inputStyle} value={familyForm.employer} onChange={ff("employer")} placeholder="Company / School" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={saveMember} className="px-4 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: "#55478f" }}>{isEditing ? "Save Changes" : "Add Member"}</button>
                        {isEditing && <button onClick={cancelEdit} className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ color: "#8e7bb7", backgroundColor: "#f0ece8" }}>Cancel</button>}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CONVERSATION LOG */}
              {modal === "conversationLog" && (
                <div>
                  <input
                    type="text"
                    placeholder="Search conversations…"
                    value={convSearch}
                    onChange={(e) => setConvSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm mb-4"
                    style={{ borderColor: "#c0bad4" }}
                  />
                  <div className="space-y-3">
                    {filteredConversations.map((c, i) => (
                      <div key={i} className="rounded-lg p-4" style={{ border: "1px solid #e5e0f0" }}>
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <p className="font-semibold text-sm" style={{ color: "#281d51" }}>{c.subject}</p>
                          <span className="text-xs flex-shrink-0" style={{ color: "#b2b2b2" }}>{c.date}</span>
                        </div>
                        <div className="flex gap-2 mb-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{c.type}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f0ece8", color: "#474747" }}>{c.topic}</span>
                        </div>
                        <p className="text-xs" style={{ color: "#474747" }}>{c.comment}</p>
                        <p className="text-xs mt-1" style={{ color: "#b2b2b2" }}>— {c.employee}</p>
                      </div>
                    ))}
                    {filteredConversations.length === 0 && <p className="text-sm text-center py-8" style={{ color: "#b2b2b2" }}>No matching conversations</p>}
                  </div>
                </div>
              )}

              {/* SCORES & GRADES */}
              {modal === "scores" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>GPA</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "GPA (Weighted)", value: student.gpaWeighted || "4.2" },
                        { label: "GPA (Unweighted)", value: student.gpaUnweighted || "3.9" },
                        { label: "Class Rank", value: student.classRank || "12 / 380" },
                        { label: "AP Classes", value: student.apClasses?.length || 5 },
                      ].map((r) => (
                        <div key={r.label} className="rounded-lg p-3 flex justify-between items-center" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                          <span className="text-xs" style={{ color: "#b2b2b2" }}>{r.label}</span>
                          <span className="font-bold text-sm" style={{ color: "#281d51" }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>SAT</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Total", value: student.satTotal || 1420 },
                        { label: "Math", value: student.satMath || 730 },
                        { label: "Evidence-Based R&W", value: student.satReading || 690 },
                      ].map((r) => (
                        <div key={r.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                          <p className="text-xs mb-1" style={{ color: "#b2b2b2" }}>{r.label}</p>
                          <p className="font-bold" style={{ color: "#281d51" }}>{r.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>ACT</p>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: "Composite", value: student.actComposite || 32 },
                        { label: "English", value: student.actEnglish || 34 },
                        { label: "Math", value: student.actMath || 30 },
                        { label: "Reading", value: student.actReading || 33 },
                        { label: "Science", value: student.actScience || 31 },
                        { label: "Writing", value: student.actWriting || 9 },
                      ].map((r) => (
                        <div key={r.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                          <p className="text-xs mb-1" style={{ color: "#b2b2b2" }}>{r.label}</p>
                          <p className="font-bold" style={{ color: "#281d51" }}>{r.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>AP / IB Courses</p>
                    <div className="flex flex-wrap gap-2">
                      {(student.apClasses || ["AP Biology", "AP Calculus BC", "AP US History", "AP Language", "AP Chemistry"]).map((c) => (
                        <span key={c} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentDetailPage;
