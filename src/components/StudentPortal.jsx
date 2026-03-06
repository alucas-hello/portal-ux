import { useState, useEffect, useRef } from "react";
import { StudentAvatar, TeamAvatar } from "./Avatars";

/**
 * Student Portal — what students see (and admins via "Login as Student" impersonation).
 * Mirrors the real HelloCollege student portal structure:
 *   Top nav: HOME | COLLEGES ▾ | RESOURCES | SCHEDULING | PROFILE ▾
 *   Pages: Dashboard, College Search, College List, Compare, Resources, Scheduling, Profile, Edit Profile
 */

// ─── Sample Data ─────────────────────────────────────────

const ACTIVITY_ITEMS = [
  // Spring 2026
  { semester: "Spring 2026", name: "Mr. Keller's Farmer — 1:1pm", status: "completed", date: "03/01/26", type: "meeting" },
  { semester: "Spring 2026", name: "Complete YouScience Assessment", status: "completed", date: "01/15/26", type: "task" },
  { semester: "Spring 2026", name: "Review High School Course Selection", status: "in-progress", date: "03/10/26", type: "task" },
  { semester: "Spring 2026", name: "Private Budget Meeting", status: "not-started", date: "03/20/26", type: "task" },
  { semester: "Spring 2026", name: "Mastering Academic Success Workshop", status: "completed", date: "02/15/26", type: "workshop" },
  { semester: "Spring 2026", name: "Understanding the PSAT & National Merit", status: "completed", date: "02/20/26", type: "workshop" },
  { semester: "Spring 2026", name: "Review S.A.F.E College Preferences", status: "completed", date: "02/01/26", type: "task" },
  { semester: "Spring 2026", name: "Create College Research Plan", status: "in-progress", date: "03/15/26", type: "task" },
  { semester: "Spring 2026", name: "Stand Out as an Underclassman Workshop", status: "not-started", date: "04/01/26", type: "workshop" },
  { semester: "Spring 2026", name: "Paying for College Workshop", status: "not-started", date: "04/15/26", type: "workshop" },
  { semester: "Spring 2026", name: "ACT Strategy Workshop", status: "not-started", date: "04/20/26", type: "workshop" },
  { semester: "Spring 2026", name: "SAT Strategy Workshop", status: "not-started", date: "05/01/26", type: "workshop" },
  { semester: "Spring 2026", name: "Academic Planning Meeting", status: "not-started", date: "05/10/26", type: "meeting" },
  { semester: "Spring 2026", name: "Summer Test Prep Workshop", status: "not-started", date: "05/15/26", type: "workshop" },
  // Summer 2026
  { semester: "Summer 2026", name: "Take Practice ACT or SAT", status: "not-started", date: "06/15/26", type: "task" },
  { semester: "Summer 2026", name: "Resume Review", status: "not-started", date: "07/01/26", type: "task" },
  { semester: "Summer 2026", name: "Develop Preliminary College List", status: "not-started", date: "07/15/26", type: "task" },
  { semester: "Summer 2026", name: "Establish Recommendation Letter Strategy", status: "not-started", date: "08/01/26", type: "task" },
  { semester: "Summer 2026", name: "Define Scholarship Plan", status: "not-started", date: "08/15/26", type: "task" },
  // Fall 2026
  { semester: "Fall 2026", name: "Refine College List", status: "not-started", date: "09/01/26", type: "task" },
  { semester: "Fall 2026", name: "Activities & Honors Workshop", status: "not-started", date: "09/15/26", type: "workshop" },
  { semester: "Fall 2026", name: "Common App Personal Statement Topic Identified", status: "not-started", date: "10/01/26", type: "task" },
  { semester: "Fall 2026", name: "Supplemental Essay Strategy", status: "not-started", date: "10/15/26", type: "task" },
  { semester: "Fall 2026", name: "Complete My Common App Personal Statement", status: "not-started", date: "11/01/26", type: "task" },
  { semester: "Fall 2026", name: "Set Application Strategy", status: "not-started", date: "11/15/26", type: "task" },
  { semester: "Fall 2026", name: "Guidance Application Workshop", status: "not-started", date: "11/20/26", type: "workshop" },
  { semester: "Fall 2026", name: "1-1 Application Review", status: "not-started", date: "12/01/26", type: "task" },
  { semester: "Fall 2026", name: "All Essays Reviewed", status: "not-started", date: "12/15/26", type: "task" },
  // Spring 2027
  { semester: "Spring 2027", name: "Mock College Interview Meeting", status: "not-started", date: "01/15/27", type: "task" },
  { semester: "Spring 2027", name: "FAFSA/CSS Profile Workshop", status: "not-started", date: "02/01/27", type: "workshop" },
  { semester: "Spring 2027", name: "Scholarship Bootcamp", status: "not-started", date: "02/15/27", type: "workshop" },
  { semester: "Spring 2027", name: "Senior Assessment & Decision Meeting", status: "not-started", date: "04/01/27", type: "meeting" },
  { semester: "Spring 2027", name: "College & Career Transition Workshop", status: "not-started", date: "05/01/27", type: "workshop" },
];

const COLLEGE_SEARCH_DATA = [
  { id: 1, name: "North Central College", enrollment: 2608, act25: null, inState: "$43,230", acceptance: "74%", state: "IL" },
  { id: 2, name: "Indiana University", enrollment: 33621, act25: null, inState: "$11,164", acceptance: "82%", state: "IN" },
  { id: 3, name: "Alabama State Agricultural College", enrollment: 4852, act25: null, inState: "$12,600", acceptance: "61%", state: "AL" },
  { id: 4, name: "Purdue University", enrollment: 38851, act25: 25, inState: "$9,992", acceptance: "60%", state: "IN" },
  { id: 5, name: "Alabama A&M University", enrollment: 6123, act25: 16, inState: "$10,024", acceptance: "88%", state: "AL" },
  { id: 6, name: "Sussex University", enrollment: 15840, act25: null, inState: "N/A", acceptance: "82%", state: "UK" },
  { id: 7, name: "MIT", enrollment: 11520, act25: 35, inState: "$57,590", acceptance: "3.9%", state: "MA" },
  { id: 8, name: "Georgia Tech", enrollment: 44007, act25: 32, inState: "$12,682", acceptance: "17%", state: "GA" },
  { id: 9, name: "University of Michigan", enrollment: 47907, act25: 31, inState: "$16,312", acceptance: "20%", state: "MI" },
  { id: 10, name: "Stanford University", enrollment: 17534, act25: 34, inState: "$56,169", acceptance: "3.7%", state: "CA" },
];

const MY_COLLEGE_LIST = [
  { rank: 1, name: "Amherst College, Amherst, MA", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "7%", testOptional: "Yes", applications: "", financialAid: "", scholarship: "", status: "January 1 Reg(ular)" },
  { rank: 2, name: "Bard College, Annandale-on-Hudson, NY", major: "Search major (opt.)", deadline: "Early Action November 1", targetDate: "", appStatus: "Haven't Applied", acceptance: "53%", testOptional: "Yes", applications: "", financialAid: "", scholarship: "", status: "January 1 Reg(ular)" },
  { rank: 3, name: "Carnegie Mellon University, Pittsburgh, PA", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "11%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 1 Reg(ular)" },
  { rank: 4, name: "Colby College, Waterville, ME", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "7%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 1 Reg(ular)" },
  { rank: 5, name: "Colgate University, Hamilton, NY", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "13%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 15 Reg(ular)" },
  { rank: 6, name: "Denison University, Granville, OH", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "21%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 15 Reg(ular)" },
  { rank: 7, name: "DePaul University, Chicago, IL", major: "Search major (opt.)", deadline: "Early Action November 15", targetDate: "", appStatus: "Haven't Applied", acceptance: "67%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "February 1 Reg(ular)" },
  { rank: 8, name: "Maryland Institute College of Art, Baltimore, MD", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "64%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "February 1 Reg(ular)" },
  { rank: 9, name: "Massachusetts College of Art and Design, Boston, MA", major: "Search major (opt.)", deadline: "Early Action November 15", targetDate: "", appStatus: "Haven't Applied", acceptance: "70%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "February 1 Reg(ular)" },
  { rank: 10, name: "Oberlin College, Oberlin, OH", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "36%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 15 Reg(ular)" },
  { rank: 11, name: "Oregon State University, Corvallis, OR", major: "Search major (opt.)", deadline: "Early Action November 1", targetDate: "", appStatus: "Haven't Applied", acceptance: "82%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "February 1 Reg(ular)" },
  { rank: 12, name: "Pratt Institute, Brooklyn, NY", major: "Search major (opt.)", deadline: "Early Action November 1", targetDate: "", appStatus: "Haven't Applied", acceptance: "46%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 5 Reg(ular)" },
  { rank: 13, name: "Swarthmore College, Swarthmore, PA", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "7%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 4 Reg(ular)" },
  { rank: 14, name: "UC of California, Santa Barbara, Santa Barbara, CA", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "26%", testOptional: "LRC", applications: "", financialAid: "", scholarship: "", status: "December 1 Reg(ular)" },
  { rank: 15, name: "William & Mary, Williamsburg, VA", major: "Search major (opt.)", deadline: "Choose Deadline", targetDate: "", appStatus: "Haven't Applied", acceptance: "33%", testOptional: "", applications: "", financialAid: "", scholarship: "", status: "January 15 Reg(ular)" },
];

const TEAM_MEMBERS = [
  { name: "Amanda Yoder", title: "Director of Counseling", role: "counselor" },
  { name: "Ian Simon", title: "Director of Tutoring", role: "tutor" },
  { name: "Chris Bench", title: "Director of Essay Services", role: "essay coach" },
  { name: "Raymond Gonzales", title: "Financial Specialist", role: "counselor" },
  { name: "Allison Dahleen", title: "Financial Specialist", role: "counselor" },
];

const WORKSHOPS_ZOOM = {
  "Zoom Links (for Live Sessions)": [
    "Family Orientation", "ACT vs. SAT Find Your Fit", "ACT/SAT Test Strategy",
    "Creating a High School Resume", "Paying for College",
  ],
  "Zoom Links (for Seniors)": [
    "Junior Night", "Activities and Honors", "Common Application Workshop",
    "CAPS/Essay Bootcamp", "Supplemental Essay Workshop", "FAFSA/CSS Workshop",
    "Scholarship Bootcamp", "College Transition",
  ],
};

const RECORDINGS = [
  { name: "Executive Functioning", icon: "☑" },
  { name: "Mastering Academic Success", icon: "⚙" },
  { name: "ACT vs. SAT Find Your Fit", icon: "💡" },
  { name: "ACT Test Strategy", icon: "✔" },
  { name: "SAT Test Strategy", icon: "👥" },
  { name: "The PSAT/NMSQT: What is it?", icon: "❓" },
  { name: "Understanding Course Selection", icon: "🏛" },
  { name: "College Admissions 101", icon: "📋" },
  { name: "Major and Career Exploration", icon: "🎓" },
  { name: "Stand Out Factor for Underclassman", icon: "⭐" },
  { name: "Stand Out Factor for Upperclassman", icon: "★" },
  { name: "Creating a High School Resume", icon: "📄" },
];

const PROFILE_STEPS = [
  "Contact Information", "Academic Information", "Activities and Interests",
  "S.A.F.E College Factors", "Add Your Transcript", "Final Survey",
];

// ─── Status helpers ─────────────────────────────────────────

const statusConfig = {
  completed: { color: "#00e6c3", bg: "#d1fae5", label: "Completed", dot: "✓" },
  "in-progress": { color: "#fbbf24", bg: "#fef3c7", label: "In Progress", dot: "◐" },
  "not-started": { color: "#ff3467", bg: "#fde2e8", label: "Not Started", dot: "●" },
  registered: { color: "#55478f", bg: "#e5e0f0", label: "Registered", dot: "R" },
};

// ─── College Detail — shared data & helpers ─────────────────

const COLLEGE_DETAIL = {
  name: "University of Michigan", nickname: "UMich", type: "Public",
  city: "Ann Arbor", state: "MI", country: "USA",
  ipeds: "170976", phone: "(734) 764-1817", nearestMetro: "Detroit",
  campusSetting: "City: Large", difficulty: "Most Selective",
  categories: "Public Research University", testOptional: false,
  website: "umich.edu", ceebCode: "1839",
  commonApp: true, coalitionApp: false, umichApp: true,
  appFee: 75, lorRequired: 1, lorOptional: true,
  essaysRequired: true, superscoreACT: true, superscoreSAT: true,
  enrolledFreshmen: 7290, undergrads: 32282,
  gradRate4yr: 81, gradRate6yr: 93, retention: 97, studentFacultyRatio: 15,
  act25: 31, act75: 34, sat25: 1360, sat75: 1530, avgGPA: 3.88,
  acceptanceOverall: 16, yield: 45,
  acceptanceByMajor: [
    { major: "LSA (Liberal Arts)", rate: 18 }, { major: "Engineering", rate: 8 },
    { major: "Ross (Business)", rate: 7 }, { major: "Nursing", rate: 14 },
    { major: "Architecture", rate: 20 }, { major: "Information", rate: 15 },
    { major: "Kinesiology", rate: 30 }, { major: "Music, Theatre & Dance", rate: 20 },
    { major: "Art & Design", rate: 25 }, { major: "Natural Resources", rate: 50 },
  ],
  eaDeadline: "11/01/25", eaNotification: "12/24/25",
  edDeadline: "", edNotification: "",
  rdDeadline: "02/01/26", rdNotification: "04/01/26",
  tuitionInState: 18346, tuitionOutOfState: 63962, fees: 328,
  roomBoard: 16246, books: 1184,
  avgAidPackage: 19200, pctReceivingAid: 68, pctNeedMet: 90,
  finaidWebsite: "finaid.umich.edu",
  usNewsNational: 21, usNewsBestPublic: 3, usNewsEngineering: 9,
  usNewsBusiness: 12, usNewsCS: 9, usNewsNursing: 16, forbes: 18,
  admissionsFactors: [
    { label: "Rigor of secondary school record", rating: "VI" },
    { label: "Class rank", rating: "C" },
    { label: "Academic GPA", rating: "VI" },
    { label: "Standardized test scores", rating: "I" },
    { label: "Application essay", rating: "VI" },
    { label: "Recommendations", rating: "I" },
    { label: "Interview", rating: "NC" },
    { label: "Extracurricular activities", rating: "I" },
    { label: "Talent/ability", rating: "I" },
    { label: "Character/personal qualities", rating: "VI" },
    { label: "First generation", rating: "C" },
    { label: "Alumni/ae relation", rating: "C" },
    { label: "Geographical residence", rating: "I" },
    { label: "State residency", rating: "VI" },
    { label: "Religious affiliation/commitment", rating: "NC" },
    { label: "Racial/ethnic status", rating: "NC" },
    { label: "Volunteer work", rating: "C" },
    { label: "Work experience", rating: "C" },
    { label: "Level of applicant's interest", rating: "NC" },
  ],
  hcInsight: "Strong preference for in-state applicants — state residency is listed as Very Important. Ross School of Business and College of Engineering are highly competitive with sub-10% acceptance rates. Test scores required (not test optional). Strong alumni network, especially in Midwest. Students should apply EA (Nov 1) as RD acceptance rates are lower. UMich tends to superscore both ACT and SAT.",
  bsMdProgram: "", verified: true,
};

const FACTOR_COLORS = {
  VI: { bg: "#281d51", text: "#ffffff", label: "Very Important" },
  I:  { bg: "#6b59a8", text: "#ffffff", label: "Important" },
  C:  { bg: "#bfb4db", text: "#281d51", label: "Considered" },
  NC: { bg: "#ede9f5", text: "#9e94b8", label: "Not Considered" },
};

function StatChip({ label, value, accent, sub }) {
  return (
    <div className="rounded-xl px-4 py-3 flex-1 min-w-0" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
      <p className="text-xs font-semibold mb-0.5" style={{ color: "#b2b2b2" }}>{label}</p>
      <p className="text-lg font-bold leading-tight" style={{ color: accent || "#281d51" }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "#b2b2b2" }}>{sub}</p>}
    </div>
  );
}

function FieldRow({ label, value, labelWidth = 160 }) {
  return (
    <div className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid #f0edf5" }}>
      <span className="text-xs font-semibold flex-shrink-0 pt-0.5" style={{ color: "#b2b2b2", width: labelWidth }}>{label}</span>
      <span className="text-sm" style={{ color: value !== undefined && value !== null && value !== "" ? "#474747" : "#c0bad4" }}>
        {value !== undefined && value !== null && value !== "" ? value : "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`} style={{ border: "1px solid #e5e0f0" }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>{title}</p>
      {children}
    </div>
  );
}

function StudentCollegeDetail({ college, onBack }) {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const findScrollParent = (el) => {
      if (!el || el === document.documentElement) return document.documentElement;
      const style = window.getComputedStyle(el);
      if (/auto|scroll/.test(style.overflow + style.overflowY)) return el;
      return findScrollParent(el.parentElement);
    };
    const parent = findScrollParent(containerRef.current?.parentElement);
    const getY = () => parent === document.documentElement ? window.scrollY : parent.scrollTop;
    const handler = () => setScrollY(getY());
    parent.addEventListener("scroll", handler, { passive: true });
    return () => parent.removeEventListener("scroll", handler);
  }, []);

  const totalCostOOS = college.tuitionOutOfState + college.fees + college.roomBoard + college.books;
  const totalCostIS = college.tuitionInState + college.fees + college.roomBoard + college.books;
  const imgTranslate = scrollY * -0.35;
  const maskOpacity = Math.min(0.82, scrollY / 280 * 0.82);

  return (
    <div ref={containerRef}>
      {/* ── HERO BANNER ── */}
      <div style={{ position: "relative", height: "55vh", minHeight: 300, overflow: "hidden", backgroundColor: "#00274C" }}>
        <img
          src={`${import.meta.env.BASE_URL}michigan_banner.png`}
          alt=""
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "140%",
            objectFit: "cover", objectPosition: "center",
            transform: `translateY(${imgTranslate}px)`,
            willChange: "transform",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,39,76,0.15) 0%, rgba(0,39,76,0.9) 100%)",
          opacity: maskOpacity, transition: "opacity 0.04s linear",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,39,76,0.55) 100%)" }} />

        {/* Floating controls */}
        <div className="flex items-center justify-between" style={{ position: "absolute", top: 20, left: 20, right: 20, zIndex: 2 }}>
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold" style={{ padding: "8px 14px", borderRadius: 10, backgroundColor: "rgba(0,0,0,0.3)", color: "white", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
            ← Back
          </button>
          {college.verified && (
            <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ padding: "6px 12px", borderRadius: 999, backgroundColor: "rgba(0,230,195,0.18)", color: "#00e6c3", border: "1px solid rgba(0,230,195,0.35)", backdropFilter: "blur(8px)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              Verified
            </span>
          )}
        </div>

        {/* Name at bottom of banner */}
        <div style={{ position: "absolute", bottom: 44, left: 24, right: 24, zIndex: 2 }}>
          <h1 className="font-bold" style={{ fontSize: 28, color: "white", textShadow: "0 2px 16px rgba(0,0,0,0.6)", lineHeight: 1.2 }}>{college.name}</h1>
        </div>
      </div>

      {/* ── WHITE CONTENT SHEET ── */}
      <div style={{ position: "relative", zIndex: 10, backgroundColor: "white", borderRadius: "24px 24px 0 0", marginTop: -28 }}>
        {/* Logo + metadata */}
        <div className="flex items-end gap-4" style={{ padding: "0 24px", marginTop: -44, marginBottom: 4 }}>
          <div className="flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: 88, height: 88, border: "4px solid white", backgroundColor: "#00274C", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
            <img src={`${import.meta.env.BASE_URL}michigan_logo.png`} alt="U of M" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: college.type === "Public" ? "#e0f5f0" : "#f0edf5", color: college.type === "Public" ? "#42778c" : "#8e7bb7" }}>{college.type}</span>
              <span className="text-sm" style={{ color: "#474747" }}>{college.city}, {college.state}</span>
              <span style={{ color: "#c0bad4" }}>·</span>
              <span className="text-sm" style={{ color: "#474747" }}>{college.difficulty}</span>
              {college.commonApp && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Common App</span>}
              {college.testOptional && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>Test Optional</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm" style={{ color: "#b2b2b2" }}>CEEB <span className="font-bold" style={{ color: "#281d51" }}>{college.ceebCode}</span></span>
              <span className="text-sm" style={{ color: "#42778c" }}>{college.website}</span>
              <span className="text-sm" style={{ color: "#b2b2b2" }}>{college.phone}</span>
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div className="flex gap-3 px-6 pb-5 pt-3">
          <StatChip label="ACCEPTANCE RATE" value={`${college.acceptanceOverall}%`} accent="#ff3467" sub={`Yield ${college.yield}%`} />
          <StatChip label="ENROLLED FRESHMEN" value={college.enrolledFreshmen.toLocaleString()} sub={`${college.undergrads.toLocaleString()} undergrads`} />
          <StatChip label="6-YR GRAD RATE" value={`${college.gradRate6yr}%`} accent="#00e6c3" sub={`4-yr: ${college.gradRate4yr}%`} />
          <StatChip label="RETENTION" value={`${college.retention}%`} accent="#00e6c3" />
          <StatChip label="STUDENT / FACULTY" value={`${college.studentFacultyRatio}:1`} />
          <StatChip label="US NEWS RANK" value={`#${college.usNewsNational}`} sub={`#${college.usNewsBestPublic} Public`} />
        </div>
        <div style={{ height: 1, backgroundColor: "#e5e0f0", margin: "0 24px 20px" }} />

        <div className="px-6 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <SectionCard title="BASIC INFORMATION">
              <FieldRow label="IPEDS Code" value={college.ipeds} />
              <FieldRow label="Phone" value={college.phone} />
              <FieldRow label="Nearest Metro" value={college.nearestMetro} />
              <FieldRow label="Campus Setting" value={college.campusSetting} />
              <FieldRow label="Difficulty" value={college.difficulty} />
              <FieldRow label="Categories" value={college.categories} />
              <FieldRow label="Test Policy" value={college.testOptional ? "Test Optional" : "Test Required"} />
            </SectionCard>
            <SectionCard title="APPLICATION">
              <FieldRow label="Application Fee" value={`$${college.appFee}`} />
              <FieldRow label="Application Methods" value={[college.commonApp && "Common App", college.coalitionApp && "Coalition", college.umichApp && "UMich App"].filter(Boolean).join(", ")} />
              <FieldRow label="Letters of Rec" value={`${college.lorRequired} required${college.lorOptional ? " + optional" : ""}`} />
              <FieldRow label="Essays Required" value={college.essaysRequired ? "Yes" : "No"} />
              <FieldRow label="Superscore ACT" value={college.superscoreACT ? "Yes" : "No"} />
              <FieldRow label="Superscore SAT" value={college.superscoreSAT ? "Yes" : "No"} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <SectionCard title="TEST SCORES & GPA">
              <FieldRow label="ACT 25th %ile" value={college.act25} />
              <FieldRow label="ACT 75th %ile" value={college.act75} />
              <FieldRow label="SAT 25th %ile" value={college.sat25} />
              <FieldRow label="SAT 75th %ile" value={college.sat75} />
              <FieldRow label="Avg GPA (Unweighted)" value={college.avgGPA} />
            </SectionCard>
            <SectionCard title="ADMISSIONS DEADLINES">
              <div className="grid grid-cols-3 gap-2">
                {["EA", "ED", "RD"].map(type => {
                  const dlField = type === "EA" ? "eaDeadline" : type === "ED" ? "edDeadline" : "rdDeadline";
                  const ntField = type === "EA" ? "eaNotification" : type === "ED" ? "edNotification" : "rdNotification";
                  const dl = college[dlField]; const nt = college[ntField];
                  return (
                    <div key={type} className="rounded-lg p-3" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
                      <p className="text-xs font-bold mb-2" style={{ color: "#281d51" }}>{type === "EA" ? "Early Action" : type === "ED" ? "Early Decision" : "Regular Decision"}</p>
                      <p className="text-xs mb-0.5" style={{ color: "#b2b2b2" }}>Deadline</p>
                      <p className="text-sm font-semibold mb-1.5" style={{ color: dl ? "#474747" : "#c0bad4" }}>{dl || "—"}</p>
                      <p className="text-xs mb-0.5" style={{ color: "#b2b2b2" }}>Notification</p>
                      <p className="text-sm font-semibold" style={{ color: nt ? "#42778c" : "#c0bad4" }}>{nt || "—"}</p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <SectionCard title="FINANCIAL AID & COSTS">
              <FieldRow label="Tuition (In-State)" value={`$${college.tuitionInState.toLocaleString()}`} />
              <FieldRow label="Tuition (Out-of-State)" value={`$${college.tuitionOutOfState.toLocaleString()}`} />
              <FieldRow label="Fees" value={`$${college.fees.toLocaleString()}`} />
              <FieldRow label="Room & Board" value={`$${college.roomBoard.toLocaleString()}`} />
              <FieldRow label="Books & Supplies" value={`$${college.books.toLocaleString()}`} />
              <FieldRow label="Total CoA (Out-of-State)" value={`$${totalCostOOS.toLocaleString()}`} />
              <FieldRow label="Total CoA (In-State)" value={`$${totalCostIS.toLocaleString()}`} />
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid #e5e0f0" }}>
                <FieldRow label="Avg Aid Package" value={`$${college.avgAidPackage.toLocaleString()}`} />
                <FieldRow label="% Receiving Aid" value={`${college.pctReceivingAid}%`} />
                <FieldRow label="% of Need Met" value={`${college.pctNeedMet}%`} />
                <FieldRow label="Financial Aid Website" value={college.finaidWebsite} />
              </div>
            </SectionCard>
            <SectionCard title="RANKINGS">
              <FieldRow label="US News — National" value={`#${college.usNewsNational}`} />
              <FieldRow label="US News — Best Public" value={`#${college.usNewsBestPublic}`} />
              <FieldRow label="US News — Engineering" value={`#${college.usNewsEngineering}`} />
              <FieldRow label="US News — Business" value={`#${college.usNewsBusiness}`} />
              <FieldRow label="US News — CS" value={`#${college.usNewsCS}`} />
              <FieldRow label="US News — Nursing" value={`#${college.usNewsNursing}`} />
              <FieldRow label="Forbes" value={`#${college.forbes}`} />
            </SectionCard>
          </div>

          <SectionCard title="ACCEPTANCE RATES BY MAJOR" className="mb-4">
            <div className="flex flex-wrap gap-2">
              {college.acceptanceByMajor.map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
                  <span className="text-xs font-semibold" style={{ color: "#474747" }}>{m.major}</span>
                  <span className="text-sm font-bold" style={{ color: m.rate <= 10 ? "#ff3467" : m.rate <= 20 ? "#fbbf24" : "#00e6c3" }}>{m.rate}%</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #f0edf5" }}>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff3467" }} /><span className="text-xs" style={{ color: "#b2b2b2" }}>≤10% Very Selective</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fbbf24" }} /><span className="text-xs" style={{ color: "#b2b2b2" }}>11–20% Selective</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#00e6c3" }} /><span className="text-xs" style={{ color: "#b2b2b2" }}>&gt;20% Less Selective</span></div>
            </div>
          </SectionCard>

          <SectionCard title="ADMISSIONS FACTORS" className="mb-4">
            <div className="flex flex-wrap gap-x-1 gap-y-1.5 mb-3">
              {Object.entries(FACTOR_COLORS).map(([key, val]) => (
                <span key={key} className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: val.bg, color: val.text }}>{key} — {val.label}</span>
              ))}
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {college.admissionsFactors.map((factor, i) => {
                const fc = FACTOR_COLORS[factor.rating] || FACTOR_COLORS.NC;
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: fc.bg, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <span className="text-xs font-medium" style={{ color: fc.text }}>{factor.label}</span>
                    <span className="text-xs font-bold opacity-70" style={{ color: fc.text }}>{factor.rating}</span>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="HC INSIGHT" className="mb-4">
            <p className="text-sm leading-relaxed" style={{ color: college.hcInsight ? "#474747" : "#c0bad4" }}>{college.hcInsight || "No insights added."}</p>
          </SectionCard>

          <SectionCard title="BS/MD PROGRAMS" className="mb-4">
            <p className="text-sm leading-relaxed" style={{ color: college.bsMdProgram ? "#474747" : "#c0bad4" }}>{college.bsMdProgram || "No BS/MD programs noted."}</p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ─── Student Dashboard (HOME) ────────────────────────────────

function StudentHome({ student }) {
  const semesters = [...new Set(ACTIVITY_ITEMS.map(i => i.semester))];

  return (
    <div className="flex gap-6">
      {/* Main — Activity Timeline */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#281d51" }}>Activity</h2>
        {semesters.map(sem => (
          <div key={sem} className="mb-6">
            <h3 className="text-sm font-bold mb-3 px-2 py-1 rounded" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{sem}</h3>
            <div className="space-y-1">
              {ACTIVITY_ITEMS.filter(i => i.semester === sem).map((item, idx) => {
                const sc = statusConfig[item.status];
                return (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition-colors" style={{ borderLeft: `4px solid ${sc.color}` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: sc.color }}>
                      {item.status === "completed" ? "✓" : item.status === "in-progress" ? "◐" : "●"}
                    </div>
                    <span className="flex-1 text-sm" style={{ color: "#474747" }}>{item.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                    <span className="text-xs" style={{ color: "#b2b2b2" }}>{item.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Right sidebar */}
      <div className="w-72 space-y-5 flex-shrink-0">
        {/* Team */}
        <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #e5e0f0" }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Team</h4>
          <div className="space-y-2">
            {TEAM_MEMBERS.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <TeamAvatar name={t.name} role={t.role} size={28} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#281d51" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#b2b2b2" }}>{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Colleges */}
        <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #e5e0f0" }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Top Colleges</h4>
          <div className="space-y-1">
            {MY_COLLEGE_LIST.slice(0, 5).map((c, i) => (
              <p key={i} className="text-xs" style={{ color: "#42778c" }}>{c.name.split(",")[0]}</p>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #e5e0f0" }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Services</h4>
          <p className="text-xs" style={{ color: "#474747" }}>HelloCollege 100</p>
          <p className="text-xs" style={{ color: "#b2b2b2" }}>Enrolled 08/26/2025</p>
        </div>

        {/* Work & Goals */}
        <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #e5e0f0" }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Work & Goals</h4>
          <p className="text-xs" style={{ color: "#b2b2b2" }}>Assigned: complete first assessment</p>
        </div>

        {/* Files */}
        <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #e5e0f0" }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Files</h4>
          <p className="text-xs" style={{ color: "#42778c" }}>Report_Card_(BHS).pdf</p>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-4" style={{ border: "1px solid #e5e0f0" }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: "#281d51" }}>Notes</h4>
          <p className="text-xs" style={{ color: "#b2b2b2" }}>August 31, 2025</p>
        </div>
      </div>
    </div>
  );
}

// ─── College Search ──────────────────────────────────────────

function CollegeSearch({ onViewCollege }) {
  const [search, setSearch] = useState("");
  const [include2yr, setInclude2yr] = useState(false);
  const filtered = search.length >= 2
    ? COLLEGE_SEARCH_DATA.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : COLLEGE_SEARCH_DATA;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#55478f" }}>COLLEGES</h2>
      <div className="flex gap-6">
        {/* Filters sidebar */}
        <div className="w-56 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: "#281d51" }}>Filters</span>
            <button className="text-xs" style={{ color: "#42778c" }}>Clear all</button>
          </div>
          <label className="flex items-center gap-2 text-sm" style={{ color: "#474747" }}>
            <input type="checkbox" checked={include2yr} onChange={e => setInclude2yr(e.target.checked)} style={{ accentColor: "#55478f" }} />
            Include 2 Year Colleges
          </label>
          {["State", "Majors", "Size", "Public/Private", "Unweighted GPA", "Acceptance Rate", "1st Year Retention", "% of Need Met", "BS/MD Duration"].map(f => (
            <details key={f} className="text-sm">
              <summary className="font-medium cursor-pointer py-1" style={{ color: "#281d51" }}>{f}</summary>
              <div className="pl-2 pt-1">
                <select className="w-full px-2 py-1 rounded text-xs" style={{ border: "1px solid #c0bad4" }}>
                  <option>All</option>
                </select>
              </div>
            </details>
          ))}
        </div>

        {/* Results */}
        <div className="flex-1">
          <input type="text" placeholder="Enter college name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-2 rounded-lg text-sm mb-4" style={{ border: "1px solid #c0bad4", color: "#474747" }} />
          <p className="text-xs mb-2" style={{ color: "#b2b2b2" }}>{filtered.length} results</p>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#55478f" }}>
                  {["", "College Name", "Undergrad Enrollment", "ACT/SAT 25th%", "In State/Out of State", "Acceptance %"].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" style={{ borderTop: "1px solid #e5e0f0" }} onClick={() => onViewCollege(COLLEGE_DETAIL)}>
                    <td className="px-3 py-2" onClick={e => e.stopPropagation()}><button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#55478f", color: "white", fontSize: 12 }}>+</button></td>
                    <td className="px-3 py-2 font-medium" style={{ color: "#42778c" }}>{c.name}</td>
                    <td className="px-3 py-2" style={{ color: "#474747" }}>{c.enrollment.toLocaleString()}</td>
                    <td className="px-3 py-2" style={{ color: "#474747" }}>{c.act25 || "N/A"}</td>
                    <td className="px-3 py-2" style={{ color: "#474747" }}>{c.inState}</td>
                    <td className="px-3 py-2" style={{ color: "#474747" }}>{c.acceptance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#55478f", color: "white" }}>SHOW MORE RESULTS</button>
        </div>
      </div>
    </div>
  );
}

// ─── College List ────────────────────────────────────────────

const LIST_INITIAL = MY_COLLEGE_LIST.map((c, i) => ({
  ...c,
  uid: i + 1,
  appStatus: c.appStatus || "Haven't Applied",
  category: i < 5 ? "Reach" : i < 10 ? "Target" : "Safety",
  major: c.major === "Search major (opt.)" ? "" : c.major,
  targetDate: "",
  applications: c.applications || "",
  financialAid: c.financialAid || "",
  scholarship: c.scholarship || "",
  notes: "",
}));

const APP_STATUSES = ["Haven't Applied", "Planning to Apply", "Applied", "Accepted", "Waitlisted", "Denied", "Selected"];
const DEADLINE_OPTS = ["Choose Deadline", "Early Decision October 15", "Early Decision November 1", "Early Action November 1", "Early Action November 15", "Rolling Admission", "January 1 Regular", "January 15 Regular", "February 1 Regular", "February 15 Regular"];
const APP_PLATFORMS = ["—", "Common App", "Coalition App", "School Portal", "QuestBridge"];
const CATEGORY_COLOR = { Reach: "#ff3467", Target: "#fbbf24", Safety: "#00e6c3" };
const STATUS_COLOR = {
  "Haven't Applied": "#b2b2b2", "Planning to Apply": "#8e7bb7", "Applied": "#42778c",
  "Accepted": "#00e6c3", "Waitlisted": "#fbbf24", "Denied": "#ff3467", "Selected": "#55478f",
};

function CollegeList({ onViewCollege }) {
  const [list, setList] = useState(LIST_INITIAL);
  const [appMode, setAppMode] = useState(false);
  const [search, setSearch] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const dragNode = useRef(null);

  const rerank = (arr) => arr.map((c, i) => ({ ...c, rank: i + 1 }));

  const moveUp = (idx) => {
    if (idx === 0) return;
    setList(prev => { const n = [...prev]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; return rerank(n); });
  };
  const moveDown = (idx) => {
    if (idx === list.length - 1) return;
    setList(prev => { const n = [...prev]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; return rerank(n); });
  };
  const updateField = (uid, field, value) => {
    setList(prev => prev.map(c => c.uid === uid ? { ...c, [field]: value } : c));
  };

  // HTML5 drag-and-drop
  const onDragStart = (e, idx) => {
    dragNode.current = idx;
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEnter = (e, idx) => {
    e.preventDefault();
    if (dragNode.current !== idx) setDragOverIdx(idx);
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = dragNode.current;
    if (from === null || from === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    setList(prev => {
      const n = [...prev];
      const [moved] = n.splice(from, 1);
      n.splice(idx, 0, moved);
      return rerank(n);
    });
    dragNode.current = null;
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const onDragEnd = () => { dragNode.current = null; setDragIdx(null); setDragOverIdx(null); };

  const filtered = list.filter(c =>
    search === "" || c.name.toLowerCase().includes(search.toLowerCase())
  );

  // summary counts
  const counts = APP_STATUSES.reduce((acc, s) => { acc[s] = list.filter(c => c.appStatus === s).length; return acc; }, {});

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-2xl font-bold" style={{ color: "#55478f" }}>COLLEGE LIST</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: appMode ? "#55478f" : "#b2b2b2" }}>Application Mode</span>
          <button
            onClick={() => setAppMode(m => !m)}
            className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
            style={{ backgroundColor: appMode ? "#55478f" : "#c0bad4" }}
          >
            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow transition-all" style={{ left: appMode ? 24 : 2 }} />
          </button>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "Reach", color: "#ff3467", count: list.filter(c => c.category === "Reach").length },
          { label: "Target", color: "#fbbf24", count: list.filter(c => c.category === "Target").length },
          { label: "Safety", color: "#00e6c3", count: list.filter(c => c.category === "Safety").length },
          null,
          ...["Applied", "Accepted", "Waitlisted", "Selected"].map(s => ({ label: s, color: STATUS_COLOR[s], count: counts[s] })),
        ].map((item, i) => item === null
          ? <div key={i} className="w-px self-stretch" style={{ backgroundColor: "#e5e0f0" }} />
          : (
            <span key={item.label} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: item.color + "18", color: item.color }}>
              {item.label} {item.count}
            </span>
          )
        )}
        <div className="flex-1" />
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm"
          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none", width: 180 }}
        />
      </div>

      {/* Cards */}
      <div className="space-y-2.5">
        {filtered.map((college, idx) => {
          const isDragging = dragIdx === idx;
          const isDragOver = dragOverIdx === idx && dragIdx !== idx;
          const isSelected = college.appStatus === "Selected";
          const isAccepted = college.appStatus === "Accepted";
          const showOffer = isSelected || isAccepted;

          return (
            <div
              key={college.uid}
              draggable
              onDragStart={e => onDragStart(e, idx)}
              onDragEnter={e => onDragEnter(e, idx)}
              onDragOver={onDragOver}
              onDrop={e => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              className="bg-white rounded-xl transition-all"
              style={{
                border: isDragOver ? "2px dashed #55478f" : `1px solid ${showOffer ? STATUS_COLOR[college.appStatus] + "44" : "#e5e0f0"}`,
                opacity: isDragging ? 0.45 : 1,
                boxShadow: isDragging ? "none" : showOffer ? `0 2px 12px ${STATUS_COLOR[college.appStatus]}22` : "0 1px 3px rgba(40,29,81,0.06)",
              }}
            >
              <div className="flex items-stretch gap-0">
                {/* Left gutter: drag handle + rank + arrows */}
                <div className="flex flex-col items-center gap-1 px-2.5 py-3 rounded-l-xl flex-shrink-0 select-none" style={{ backgroundColor: "#f8f7fc", borderRight: "1px solid #e5e0f0", minWidth: 44 }}>
                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing" style={{ color: "#c0bad4" }} title="Drag to reorder">
                    <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
                      <circle cx="3" cy="3" r="1.5"/><circle cx="9" cy="3" r="1.5"/>
                      <circle cx="3" cy="9" r="1.5"/><circle cx="9" cy="9" r="1.5"/>
                      <circle cx="3" cy="15" r="1.5"/><circle cx="9" cy="15" r="1.5"/>
                    </svg>
                  </div>
                  {/* Rank badge */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white my-1" style={{ backgroundColor: "#55478f" }}>
                    {college.rank}
                  </div>
                  {/* Up */}
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-white transition-colors"
                    style={{ color: idx === 0 ? "#e5e0f0" : "#8e7bb7" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
                  </button>
                  {/* Down */}
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === filtered.length - 1}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-white transition-colors"
                    style={{ color: idx === filtered.length - 1 ? "#e5e0f0" : "#8e7bb7" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                </div>

                {/* Card body */}
                <div className="flex-1 min-w-0 p-4">
                  {/* Top row: name + badges + status */}
                  <div className="flex items-start gap-2 flex-wrap">
                    <button
                      onClick={() => onViewCollege(COLLEGE_DETAIL)}
                      className="text-base font-bold text-left hover:underline leading-tight"
                      style={{ color: "#42778c" }}
                    >
                      {college.name}
                    </button>
                    {/* Category badge */}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLOR[college.category] + "20", color: CATEGORY_COLOR[college.category] }}>
                      {college.category}
                    </span>
                    {college.testOptional && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                        Test Optional
                      </span>
                    )}
                    {/* App status badge (right-aligned in list mode) */}
                    {!appMode && (
                      <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLOR[college.appStatus] + "18", color: STATUS_COLOR[college.appStatus] }}>
                        {college.appStatus}
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 mt-1 flex-wrap text-xs" style={{ color: "#b2b2b2" }}>
                    <span>Acceptance: <strong style={{ color: "#474747" }}>{college.acceptance}</strong></span>
                    <span>Deadline: <strong style={{ color: "#474747" }}>{college.deadline === "Choose Deadline" ? "TBD" : college.deadline}</strong></span>
                    <span style={{ color: "#c0bad4" }}>{college.status}</span>
                    {college.major && <span style={{ color: "#8e7bb7" }}>{college.major}</span>}
                  </div>

                  {/* ── APPLICATION MODE FIELDS ── */}
                  {appMode && (
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                      {/* App Status */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>APPLICATION STATUS</p>
                        <select
                          value={college.appStatus}
                          onChange={e => updateField(college.uid, "appStatus", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            border: `1.5px solid ${STATUS_COLOR[college.appStatus]}55`,
                            color: STATUS_COLOR[college.appStatus],
                            backgroundColor: STATUS_COLOR[college.appStatus] + "12",
                            outline: "none",
                          }}
                        >
                          {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Deadline */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>DEADLINE</p>
                        <select
                          defaultValue={college.deadline}
                          className="w-full px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
                        >
                          {DEADLINE_OPTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>

                      {/* Target Date */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>TARGET DATE</p>
                        <input
                          type="date"
                          value={college.targetDate}
                          onChange={e => updateField(college.uid, "targetDate", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
                        />
                      </div>

                      {/* Application Platform */}
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>APPLICATION</p>
                        <select
                          defaultValue={college.applications || "—"}
                          className="w-full px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
                        >
                          {APP_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>

                      {/* Major */}
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>MAJOR</p>
                        <input
                          type="text"
                          placeholder="Search major (opt.)"
                          value={college.major}
                          onChange={e => updateField(college.uid, "major", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
                        />
                      </div>

                      {/* Notes */}
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>NOTES</p>
                        <input
                          type="text"
                          placeholder="Add a note…"
                          value={college.notes}
                          onChange={e => updateField(college.uid, "notes", e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid #c0bad4", color: "#474747", outline: "none" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── OFFER DETAILS — shown when Accepted or Selected ── */}
                  {showOffer && (
                    <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: STATUS_COLOR[college.appStatus] + "0d", border: `1px solid ${STATUS_COLOR[college.appStatus]}33` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke={STATUS_COLOR[college.appStatus]} viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        <p className="text-xs font-bold" style={{ color: STATUS_COLOR[college.appStatus] }}>
                          {isSelected ? "SELECTED — Record Your Offer" : "ACCEPTED — Record Offer Details"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>FINANCIAL AID OFFER</p>
                          <input
                            type="text"
                            placeholder="e.g. $12,000 / yr"
                            value={college.financialAid}
                            onChange={e => updateField(college.uid, "financialAid", e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg text-xs"
                            style={{ border: "1px solid #c0bad4", backgroundColor: "white", outline: "none" }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>MERIT SCHOLARSHIP</p>
                          <input
                            type="text"
                            placeholder="e.g. $5,000 / yr"
                            value={college.scholarship}
                            onChange={e => updateField(college.uid, "scholarship", e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg text-xs"
                            style={{ border: "1px solid #c0bad4", backgroundColor: "white", outline: "none" }}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>TOTAL AID / YR</p>
                          <div className="px-2 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: "white", border: "1px solid #e5e0f0", color: STATUS_COLOR[college.appStatus] }}>
                            {college.financialAid && college.scholarship
                              ? "Calculated on save"
                              : college.financialAid || college.scholarship || "—"}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: "#b2b2b2" }}>DEPOSIT DEADLINE</p>
                          <input
                            type="date"
                            className="w-full px-2 py-1.5 rounded-lg text-xs"
                            style={{ border: "1px solid #c0bad4", backgroundColor: "white", outline: "none" }}
                          />
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#55478f" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <p className="text-xs" style={{ color: "#8e7bb7" }}>Your counselor will be notified of your selection and will help coordinate next steps.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-3" style={{ color: "#b2b2b2" }}>
        {filtered.length} college{filtered.length !== 1 ? "s" : ""} · Drag cards or use ↑↓ arrows to reorder
      </p>
    </div>
  );
}

// ─── Compare Colleges ────────────────────────────────────────

function CompareColleges() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#55478f" }}>Compare Colleges</h2>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search college names..." className="px-4 py-2 rounded-lg text-sm flex-1" style={{ border: "1px solid #c0bad4", color: "#474747" }} />
        <span className="self-center font-bold" style={{ color: "#55478f" }}>OR</span>
        <select className="px-4 py-2 rounded-lg text-sm flex-1" style={{ border: "1px solid #c0bad4", color: "#474747" }}>
          <option>Choose from your list</option>
          {MY_COLLEGE_LIST.map((c, i) => <option key={i}>{c.name}</option>)}
        </select>
      </div>
      <p className="text-sm mb-4" style={{ color: "#b2b2b2" }}>Compare up to 3 colleges</p>
      <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
        <p className="text-lg" style={{ color: "#b2b2b2" }}>Select colleges above to compare them side by side</p>
      </div>
    </div>
  );
}

// ─── Resources ───────────────────────────────────────────────

function Resources() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Workshops */}
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#281d51", borderBottom: "3px solid #42778c", paddingBottom: 8, display: "inline-block" }}>Workshops</h2>
        {Object.entries(WORKSHOPS_ZOOM).map(([title, links]) => (
          <div key={title} className="mb-6">
            <h3 className="text-base font-bold mb-3" style={{ color: "#281d51" }}>{title}</h3>
            <div className="space-y-2">
              {links.map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span style={{ color: "#c0bad4" }}>▶</span>
                  <span className="text-sm" style={{ color: "#ff3467" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Zoom links column — empty spacer like original */}
      <div />

      {/* Recordings */}
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#281d51" }}>Recordings</h2>
        <div className="space-y-3">
          {RECORDINGS.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg" style={{ color: "#281d51" }}>{r.icon}</span>
              <span className="text-sm font-medium" style={{ color: "#ff3467" }}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scheduling ──────────────────────────────────────────────

function Scheduling() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#55478f" }}>HelloCollege Support Team</h2>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {TEAM_MEMBERS.slice(0, 4).map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-6 text-center" style={{ border: "2px solid #281d51" }}>
            <div className="flex justify-center mb-3">
              <TeamAvatar name={t.name} role={t.role} size={72} />
            </div>
            <p className="font-bold" style={{ color: "#281d51" }}>{t.name}</p>
            <p className="text-sm font-semibold mb-4" style={{ color: "#474747" }}>{t.title}</p>
            <button className="px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: "#ff3467" }}>
              Email {t.name.split(" ")[0]}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {TEAM_MEMBERS.slice(4).map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-6 text-center" style={{ border: "2px solid #281d51" }}>
            <div className="flex justify-center mb-3">
              <TeamAvatar name={t.name} role={t.role} size={72} />
            </div>
            <p className="font-bold" style={{ color: "#281d51" }}>{t.name}</p>
            <p className="text-sm font-semibold mb-4" style={{ color: "#474747" }}>{t.title}</p>
            <button className="px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: "#ff3467" }}>
              Email {t.name.split(" ")[0]}
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-center mt-12 mb-6" style={{ color: "#55478f" }}>College Planning Workshops</h2>
      <div className="rounded-xl p-6 text-center" style={{ backgroundColor: "#f8f7fc", border: "1px solid #e5e0f0" }}>
        <p style={{ color: "#b2b2b2" }}>Workshop registration cards appear here — students can register for upcoming events via embedded YCBM links.</p>
      </div>
    </div>
  );
}

// ─── Profile View ────────────────────────────────────────────

function ProfileView({ student }) {
  const fields = [
    { label: "First Name", value: student.firstName },
    { label: "Last Name", value: student.lastName },
    { label: "HelloCollege ID", value: `20${student.gradYear}00${student.id}` },
    { label: "Gender", value: student.id % 2 === 0 ? "Male" : "Female" },
    { label: "High School", value: student.highSchool },
    { label: "Year of Graduation", value: student.gradYear },
    { label: "Preliminary Major", value: "undecided" },
    { label: "Final Major", value: "" },
    { label: "GPA Weighted", value: student.gpa || "" },
    { label: "GPA Unweighted", value: "3.80" },
    { label: "Mobile Phone", value: `+1 (555) ${String(student.id * 137 % 900 + 100)}-${String(student.id * 251 % 9000 + 1000)}` },
    { label: "Home Phone", value: "" },
    { label: "Email", value: `${student.firstName.toLowerCase()}${student.lastName[0].toLowerCase()}@icloud.com` },
    { label: "Address", value: `${100 + student.id * 37} Lancaster Terr., ${student.state}` },
    { label: "Secondary Email", value: "" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#55478f" }}>Student Profile</h2>
      <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #e5e0f0" }}>
        <div className="flex items-start gap-8 mb-8">
          <StudentAvatar student={student} size={100} />
          <div className="grid grid-cols-2 gap-x-16 gap-y-4 flex-1">
            {fields.map((f, i) => (
              <div key={i}>
                <p className="text-base font-bold" style={{ color: "#281d51" }}>{f.label}</p>
                <p className="text-sm" style={{ color: "#474747" }}>{f.value || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3" style={{ color: "#55478f", borderBottom: "3px solid #42778c", display: "inline-block", paddingBottom: 4 }}>SELECTED SERVICES</h3>
          <div className="rounded-lg overflow-hidden mt-3" style={{ border: "1px solid #e5e0f0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#f8f7fc" }}>
                  <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: "#55478f" }}>SERVICE</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold" style={{ color: "#55478f" }}>ENROLLMENT DATE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: "1px solid #e5e0f0" }}>
                  <td className="px-4 py-2" style={{ color: "#42778c" }}>HelloCollege 100</td>
                  <td className="px-4 py-2" style={{ color: "#42778c" }}>08/26/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <button className="px-6 py-2 rounded text-sm font-bold text-white" style={{ backgroundColor: "#2d6a2e" }}>EDIT PROFILE</button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Profile (Multi-step wizard) ────────────────────────

function EditProfile({ student }) {
  const [step, setStep] = useState(0);

  const renderStep = () => {
    switch (step) {
      case 0: // Contact Information
        return (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: "#55478f" }}>Contact Information</div>
              <div className="p-6 space-y-4">
                {[
                  { label: "STUDENT First Name*", value: student.firstName },
                  { label: "STUDENT last Name*", value: student.lastName },
                  { label: "STUDENT Email address*", value: `${student.firstName.toLowerCase()}${student.lastName[0].toLowerCase()}@icloud.com` },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>{f.label}</label>
                    <input type="text" defaultValue={f.value} className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} />
                  </div>
                ))}
                <p className="text-xs italic" style={{ color: "#42778c" }}>Note: Student email is used for login and is the primary email for counselor & essay coach correspondence.</p>
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>STUDENT Secondary email address</label>
                  <input type="text" className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>STUDENT Cell phone number*</label>
                  <div className="flex gap-2">
                    <select className="px-2 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }}><option>US +1</option></select>
                    <input type="text" defaultValue="(555) 361-2388" className="flex-1 px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>STUDENT Address*</label>
                  <input type="text" defaultValue={`${100 + student.id * 37} Lancaster Terr., ${student.state}`} className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>Student Picture</label>
                  <div className="flex items-center gap-4">
                    <StudentAvatar student={student} size={60} />
                    <button className="px-3 py-1.5 rounded text-xs font-bold text-white" style={{ backgroundColor: "#333" }}>CHANGE PICTURE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Academic Information
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: "#55478f" }}>Academic Information</div>
              <div className="p-6">
                <div className="rounded-lg mb-4" style={{ border: "1px solid #55478f" }}>
                  <div className="px-4 py-2 text-white font-semibold text-xs" style={{ backgroundColor: "#55478f" }}>High School Information</div>
                  <div className="p-4">
                    <p className="font-semibold text-sm mb-3" style={{ color: "#281d51" }}>Student Scores and Grades</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {[{ label: "Type", type: "select", options: ["ACT", "SAT"] }, { label: "Math", type: "text" }, { label: "Subtype", type: "select", options: ["Official ACT", "Practice", "PreACT"] }, { label: "Reading", type: "text" }, { label: "Date", type: "date" }, { label: "English", type: "text" }, { label: "Composite Score", type: "text" }, { label: "Science", type: "text" }].map((f, i) => (
                        <div key={i}>
                          <label className="text-xs font-semibold" style={{ color: "#474747" }}>{f.label}:</label>
                          {f.type === "select" ? (
                            <select className="w-full px-2 py-1 rounded text-sm mt-0.5" style={{ border: "1px solid #c0bad4" }}>
                              {f.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input type={f.type} className="w-full px-2 py-1 rounded text-sm mt-0.5" style={{ border: "1px solid #c0bad4" }} />
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="px-4 py-1.5 rounded text-xs font-bold text-white" style={{ backgroundColor: "#2d6a2e" }}>SAVE</button>

                    {/* Score summaries */}
                    <div className="mt-4">
                      <h4 className="text-sm font-bold mb-2" style={{ color: "#281d51" }}>SAT Summary</h4>
                      <div className="rounded overflow-hidden text-xs" style={{ border: "1px solid #e5e0f0" }}>
                        <table className="w-full">
                          <thead><tr style={{ backgroundColor: "#55478f" }}>{["Date", "Composite", "Subtype", "Math", "Reading & Writing", "Notes"].map(h => <th key={h} className="text-left px-2 py-1 text-white">{h}</th>)}</tr></thead>
                          <tbody>
                            <tr style={{ borderTop: "1px solid #e5e0f0", backgroundColor: "#fef3c7" }}>
                              <td className="px-2 py-1">11/04/2025</td><td className="px-2 py-1">1300</td><td className="px-2 py-1">Practice Exam-SAT</td><td className="px-2 py-1">640</td><td className="px-2 py-1">660</td><td className="px-2 py-1">BB #4</td>
                            </tr>
                            <tr style={{ borderTop: "1px solid #e5e0f0", backgroundColor: "#fef3c7" }}>
                              <td className="px-2 py-1">12/06/2025</td><td className="px-2 py-1">1310</td><td className="px-2 py-1">Official SAT</td><td className="px-2 py-1">640</td><td className="px-2 py-1">670</td><td className="px-2 py-1"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold mb-2" style={{ color: "#281d51" }}>ACT Summary</h4>
                      <div className="rounded overflow-hidden text-xs" style={{ border: "1px solid #e5e0f0" }}>
                        <table className="w-full">
                          <thead><tr style={{ backgroundColor: "#55478f" }}>{["Date", "Composite", "Subtype", "English", "Math", "Reading", "Science", "Notes"].map(h => <th key={h} className="text-left px-2 py-1 text-white">{h}</th>)}</tr></thead>
                          <tbody>
                            <tr style={{ borderTop: "1px solid #e5e0f0", backgroundColor: "#fef3c7" }}>
                              <td className="px-2 py-1">04/12/2025</td><td className="px-2 py-1">24</td><td className="px-2 py-1">PreACT</td><td className="px-2 py-1">22</td><td className="px-2 py-1">23</td><td className="px-2 py-1">27</td><td className="px-2 py-1">22</td><td className="px-2 py-1"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold mb-2" style={{ color: "#281d51" }}>GPA Summary</h4>
                      <div className="rounded overflow-hidden text-xs" style={{ border: "1px solid #e5e0f0" }}>
                        <table className="w-full">
                          <thead><tr style={{ backgroundColor: "#55478f" }}>{["Date", "Subtype", "Weighted GPA", "Unweighted GPA", "Notes"].map(h => <th key={h} className="text-left px-2 py-1 text-white">{h}</th>)}</tr></thead>
                          <tbody>
                            <tr style={{ borderTop: "1px solid #e5e0f0", backgroundColor: "#fef3c7" }}>
                              <td className="px-2 py-1">07/02/2025</td><td className="px-2 py-1">Official GPA</td><td className="px-2 py-1">N/A</td><td className="px-2 py-1">3.8 / 4.0</td><td className="px-2 py-1"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg mb-4" style={{ border: "1px solid #55478f" }}>
                  <div className="px-4 py-2 text-white font-semibold text-xs" style={{ backgroundColor: "#ff3467" }}>College Information</div>
                  <div className="p-4 space-y-3">
                    <div><label className="text-sm font-semibold" style={{ color: "#474747" }}>Potential Major(s) (ok to indicate undecided)</label><input type="text" defaultValue="undecided" className="w-full px-3 py-2 rounded text-sm mt-1" style={{ border: "1px solid #c0bad4" }} /></div>
                    <div><label className="text-sm font-semibold" style={{ color: "#474747" }}>How committed are you to this major?</label><select className="w-full px-3 py-2 rounded text-sm mt-1" style={{ border: "1px solid #c0bad4" }}><option>Select level</option><option>Very committed</option><option>Somewhat</option><option>Exploring</option></select></div>
                    <div><label className="text-sm font-semibold" style={{ color: "#474747" }}>What are your College Goals?</label><textarea className="w-full px-3 py-2 rounded text-sm mt-1" style={{ border: "1px solid #c0bad4" }} rows={2} /></div>
                    <div><label className="text-sm font-semibold" style={{ color: "#474747" }}>List colleges you are interested in and/or have visited</label><textarea className="w-full px-3 py-2 rounded text-sm mt-1" style={{ border: "1px solid #c0bad4" }} rows={2} /></div>
                  </div>
                </div>

                <div className="rounded-lg" style={{ border: "1px solid #55478f" }}>
                  <div className="px-4 py-2 text-white font-semibold text-xs" style={{ backgroundColor: "#ff3467" }}>Career Information</div>
                  <div className="p-4 space-y-3">
                    <div><label className="text-sm font-semibold" style={{ color: "#474747" }}>Career interests (ok to indicate undecided)</label><input type="text" defaultValue="undecided" className="w-full px-3 py-2 rounded text-sm mt-1" style={{ border: "1px solid #c0bad4" }} /></div>
                    <div><label className="text-sm font-semibold" style={{ color: "#474747" }}>Dream Job (ok to indicate undecided)</label><input type="text" defaultValue="undecided" className="w-full px-3 py-2 rounded text-sm mt-1" style={{ border: "1px solid #c0bad4" }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Activities and Interests
        return (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: "#55478f" }}>Activities and Interests</div>
              <div className="p-6 space-y-4">
                {["Describe your extracurricular activities", "Hobbies", "Favorite facts about yourself", "Employment history"].map((f, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>{f}</label>
                    <textarea className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} rows={3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // S.A.F.E College Factors
        return (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: "#55478f" }}>S.A.F.E College Factors</div>
              <div className="p-6 space-y-6">
                {[
                  { title: "Location by Region", options: ["West", "Midwest", "Northwest", "South", "Southwest", "Southeast", "Midatlantic", "Northeast", "No preference"] },
                  { title: "Setting", options: ["Urban", "Suburban", "Rural", "No preference"] },
                  { title: "Size", options: ["X-large (25k+)", "Large (15-25k)", "Med (5-15k)", "Small (under 5k)", "No preference"] },
                  { title: "Diversity", options: ["Historically black university", "Diverse campus important", "All male", "All female", "No preference"] },
                  { title: "Political Views", options: ["Conservative", "Moderate", "Liberal", "No preference"] },
                  { title: "Athletic", options: ["Scholarship desired", "D1 desired", "Not a consideration"] },
                ].map((group, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold mb-2" style={{ color: "#281d51" }}>{group.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt, j) => (
                        <label key={j} className="flex items-center gap-1.5 text-xs" style={{ color: "#474747" }}>
                          <input type="checkbox" style={{ accentColor: "#55478f" }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {["Religious Affiliation", "College Athletic Reputation", "Academic Selectivity", "Strength for My Major", "Brand Name Recognition", "Student Faculty Ratio", "Study Abroad", "Affordability", "Financial Need Aid", "Merit-Aid", "Internships", "Alumni Network", "Job Placement", "Health and Other Support Services"].map((f, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>{f}</label>
                    <select className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }}>
                      <option>Select preference</option>
                      <option>Very Important</option>
                      <option>Important</option>
                      <option>Somewhat Important</option>
                      <option>Not Important</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Add Your Transcript
        return (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: "#55478f" }}>Add Your Transcript</div>
              <div className="p-6 text-center">
                <div className="rounded-xl p-8 mb-4" style={{ backgroundColor: "#f8f7fc", border: "2px dashed #c0bad4" }}>
                  <svg className="mx-auto mb-3" style={{ width: 48, height: 48 }} fill="none" stroke="#c0bad4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <p className="text-sm font-medium" style={{ color: "#474747" }}>Drag and drop your transcript here</p>
                  <p className="text-xs mt-1" style={{ color: "#b2b2b2" }}>or click to browse files</p>
                </div>
                <button className="px-6 py-2 rounded text-sm font-bold text-white" style={{ backgroundColor: "#55478f" }}>UPLOAD TRANSCRIPT</button>
              </div>
            </div>
          </div>
        );

      case 5: // Final Survey
        return (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #e5e0f0" }}>
              <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: "#55478f" }}>Final Survey</div>
              <div className="p-6 space-y-4">
                <p className="text-sm" style={{ color: "#b2b2b2" }}>This survey will be available after your college decisions are finalized.</p>
                {["Feel more confident applying?", "Help stay organized and meet deadlines?", "Build more well-rounded college list?", "Recommend to friend/family?", "Accepted at top three?", "How many reach schools accepted?", "Avoid mistakes?", "Made process easier/less stressful?", "Better outcomes than friends?", "Introduced to new colleges?", "Earn private/merit scholarships?", "Willing to be resource for future students?", "Recommend (NPS)?"].map((q, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>{q}</label>
                    <select className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }}>
                      <option>Select response</option>
                      <option>Strongly Agree</option><option>Agree</option><option>Neutral</option><option>Disagree</option><option>Strongly Disagree</option>
                    </select>
                  </div>
                ))}
                {["Strengths", "Improvements", "Additional feedback"].map((f, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>{f}</label>
                    <textarea className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} rows={3} />
                  </div>
                ))}
                {["Exit school", "Major", "Scholarship amount"].map((f, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold block mb-1" style={{ color: "#474747" }}>{f}</label>
                    <input type="text" className="w-full px-3 py-2 rounded text-sm" style={{ border: "1px solid #c0bad4" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#55478f" }}>Student Profile</h2>
      {/* Step breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs">
        {PROFILE_STEPS.map((s, i) => (
          <span key={i}>
            <button onClick={() => setStep(i)} className="font-medium transition-colors" style={{ color: step === i ? "#55478f" : "#b2b2b2", textDecoration: step === i ? "underline" : "none" }}>{s}</button>
            {i < PROFILE_STEPS.length - 1 && <span className="mx-2" style={{ color: "#c0bad4" }}>›</span>}
          </span>
        ))}
      </div>
      {renderStep()}
      <div className="flex justify-end gap-3 mt-6 max-w-2xl mx-auto">
        {step > 0 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 rounded text-sm font-bold" style={{ backgroundColor: "#333", color: "white" }}>BACK</button>}
        <button onClick={() => setStep(Math.min(step + 1, 5))} className="px-4 py-2 rounded text-sm font-bold" style={{ backgroundColor: "#333", color: "white" }}>CONTINUE</button>
      </div>
    </div>
  );
}

// ─── Main Student Portal Shell ───────────────────────────────

export default function StudentPortal({ student, onExit }) {
  const [activePage, setActivePage] = useState("home");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeDropdown, setCollegeDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "home": return <StudentHome student={student} />;
      case "college-search": return <CollegeSearch onViewCollege={setSelectedCollege} />;
      case "college-list": return <CollegeList onViewCollege={setSelectedCollege} />;
      case "compare": return <CompareColleges />;
      case "resources": return <Resources />;
      case "scheduling": return <Scheduling />;
      case "profile": return <ProfileView student={student} />;
      case "edit-profile": return <EditProfile student={student} />;
      default: return <StudentHome student={student} />;
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "#f8f7fc" }}>
      {/* Impersonation banner */}
      <div className="px-6 py-1.5 flex items-center justify-center gap-3 text-sm" style={{ backgroundColor: "#ff3467", color: "white" }}>
        <span>You (<strong>***REMOVED***</strong>) are impersonating <strong>{student.firstName.toLowerCase()}{student.lastName[0].toLowerCase()}@icloud.com</strong></span>
        <button onClick={onExit} className="px-3 py-0.5 rounded text-xs font-bold border border-white bg-white" style={{ color: "#ff3467" }}>REVERT TO ADMIN</button>
      </div>

      {/* Top navigation — matches real portal */}
      <div style={{ background: "linear-gradient(135deg, #55478f 0%, #281d51 100%)" }}>
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center font-bold" style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#ffffff22", color: "#ffffff", fontSize: 11, fontFamily: "Montserrat, sans-serif" }}>HC</div>
            <span className="font-bold text-lg text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>HelloCollege</span>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => { setActivePage("home"); setCollegeDropdown(false); setProfileDropdown(false); }} className="text-sm font-semibold text-white hover:opacity-80 transition-opacity">HOME</button>

            {/* Colleges dropdown */}
            <div className="relative">
              <button onClick={() => { setCollegeDropdown(!collegeDropdown); setProfileDropdown(false); }} className="text-sm font-semibold text-white hover:opacity-80 transition-opacity flex items-center gap-1">
                COLLEGES <span className="text-xs">▾</span>
              </button>
              {collegeDropdown && (
                <div className="absolute top-8 left-0 w-48 bg-white rounded-lg shadow-lg py-1 z-50" style={{ border: "1px solid #e5e0f0" }}>
                  {[{ id: "college-search", label: "College Search" }, { id: "college-list", label: "College List" }, { id: "compare", label: "Compare Colleges" }].map(item => (
                    <button key={item.id} onClick={() => { setActivePage(item.id); setCollegeDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: "#474747" }}>{item.label}</button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => { setActivePage("resources"); setCollegeDropdown(false); setProfileDropdown(false); }} className="text-sm font-semibold text-white hover:opacity-80 transition-opacity" style={{ textDecoration: activePage === "resources" ? "underline" : "none" }}>RESOURCES</button>
            <button onClick={() => { setActivePage("scheduling"); setCollegeDropdown(false); setProfileDropdown(false); }} className="text-sm font-semibold text-white hover:opacity-80 transition-opacity" style={{ textDecoration: activePage === "scheduling" ? "underline" : "none" }}>SCHEDULING</button>
          </div>

          {/* Profile dropdown */}
          <div className="relative flex items-center gap-3">
            <button onClick={() => { setProfileDropdown(!profileDropdown); setCollegeDropdown(false); }} className="text-sm font-semibold text-white hover:opacity-80 transition-opacity flex items-center gap-2">
              PROFILE <span className="text-xs">▾</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#ffffff33", border: "2px solid white" }}>
              {student.photo ? (
                <img src={`${import.meta.env.BASE_URL}${student.photo}`} alt={student.firstName} className="w-full h-full object-cover" />
              ) : (
                <svg style={{ width: 24, height: 24 }} fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              )}
            </div>
            {profileDropdown && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg py-1 z-50" style={{ border: "1px solid #e5e0f0" }}>
                {[{ id: "profile", label: "Profile" }, { id: "edit-profile", label: "Edit Profile" }].map(item => (
                  <button key={item.id} onClick={() => { setActivePage(item.id); setProfileDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: "#474747" }}>{item.label}</button>
                ))}
                <div style={{ borderTop: "1px solid #e5e0f0" }}>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ color: "#474747" }}>Change Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className={`flex-1 overflow-auto${selectedCollege ? "" : " p-8"}`} onClick={() => { setCollegeDropdown(false); setProfileDropdown(false); }}>
        {selectedCollege
          ? <StudentCollegeDetail college={selectedCollege} onBack={() => setSelectedCollege(null)} />
          : renderPage()
        }
      </div>

      {/* Footer */}
      <div className="px-8 py-3 flex items-center justify-between" style={{ backgroundColor: "#281d51" }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center font-bold" style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: "#55478f", color: "#ffffff", fontSize: 7, fontFamily: "Montserrat, sans-serif" }}>HC</div>
          <span className="text-xs text-white font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>HelloCollege</span>
        </div>
        <span className="text-xs" style={{ color: "#c0bad4" }}>©2018 HelloCollege</span>
      </div>
    </div>
  );
}
