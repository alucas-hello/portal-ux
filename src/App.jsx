import { useState } from "react";

// Data
import { SAMPLE_STUDENTS } from "./data/students";

// Utils
import { getStaffPhoto } from "./utils/staff";

// Components
import Icons from "./components/Icons";
import LogoMark from "./components/LogoMark";
import { StudentAvatar } from "./components/Avatars";
import TaskMilestoneModal from "./components/TaskMilestoneModal";
import CounselorDashboard from "./components/CounselorDashboard";
import TasksTab from "./components/TasksTab";
import EssayCoachTab from "./components/EssayCoachTab";
import TutorTab from "./components/TutorTab";
import StudentDetailPage from "./components/StudentDetailPage";
import CollegesPage, { CollegeDetail, COLLEGE_DETAIL } from "./components/CollegesPage";
import HighSchoolsPage from "./components/HighSchoolsPage";
import TimeTrackerPage from "./components/TimeTrackerPage";
import ReportsPage from "./components/ReportsPage";
import SettingsPage from "./components/SettingsPage";
import RegistrationPage from "./components/RegistrationPage";
import ProgramsPage from "./components/ProgramsPage";
import ServicesPage from "./components/ServicesPage";
import ProductOrderPage from "./components/ProductOrderPage";
import StudentPortal from "./components/StudentPortal";
import LoginPage from "./components/LoginPage";

export default function PortalApp() {
  const [activeRole, setActiveRole] = useState("admin");
  const [currentPage, setCurrentPage] = useState("counselor");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [milestoneModal, setMilestoneModal] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [studentPortalStudent, setStudentPortalStudent] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [viewingCollege, setViewingCollege] = useState(null);
  const [collegeEditing, setCollegeEditing] = useState(false);
  const [studentEditing, setStudentEditing] = useState(false);

  const globalSearchResults = globalSearch.length >= 2
    ? SAMPLE_STUDENTS.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(globalSearch.toLowerCase()) || s.highSchool.toLowerCase().includes(globalSearch.toLowerCase()))
    : [];

  const roles = [
    { id: "admin", label: "Admin" },
    { id: "counselor", label: "Counselor" },
    { id: "essay-coach", label: "Essay Coach" },
    { id: "tutor", label: "Tutor" },
  ];

  const handleRoleSwitch = (roleId) => {
    setActiveRole(roleId);
    setSelectedStudent(null);
    if (roleId === "admin") setCurrentPage("counselor");
    else if (roleId === "counselor") setCurrentPage("counselor");
    else if (roleId === "essay-coach") setCurrentPage("essay-coach");
    else if (roleId === "tutor") setCurrentPage("tutor");
  };

  const allNavItems = [
    { id: "counselor", label: "Dashboard", icon: Icons.Dashboard, roles: ["admin", "counselor", "essay-coach", "tutor"] },
    { id: "registration", label: "Attendance", icon: Icons.Registration, roles: ["admin", "counselor"] },
    { id: "timetracker", label: "Time Tracker", icon: Icons.TimeTracker, roles: ["admin", "counselor", "essay-coach", "tutor"] },
    { id: "reports", label: "Reports", icon: Icons.Reports, roles: ["admin"] },
    { id: "colleges", label: "Colleges", icon: Icons.Colleges, roles: ["admin", "counselor"] },
    { id: "highschools", label: "High Schools", icon: Icons.HighSchools, roles: ["admin", "counselor"] },
    { id: "programs", label: "Programs", icon: Icons.Programs, roles: ["admin"] },
    { id: "services", label: "Services", icon: Icons.Services, roles: ["admin"] },
    { id: "productorder", label: "Product Order", icon: Icons.ProductOrder, roles: ["admin"] },
    { id: "settings", label: "Settings", icon: Icons.Settings, roles: ["admin"] },
  ];
  const navItems = allNavItems.filter((item) => item.roles.includes(activeRole));

  const allDashTabs = [
    { id: "counselor", label: "Counselor", roles: ["admin", "counselor"] },
    { id: "tasks", label: "Tasks & Workshops", roles: ["admin", "counselor", "essay-coach"] },
    { id: "essay-coach", label: "Essay Coach", roles: ["admin", "essay-coach"] },
    { id: "tutor", label: "Tutor", roles: ["admin", "tutor"] },
  ];
  const dashTabs = allDashTabs.filter((tab) => tab.roles.includes(activeRole)).sort((a, b) => {
    if (activeRole === "essay-coach") {
      if (a.id === "essay-coach") return -1;
      if (b.id === "essay-coach") return 1;
    }
    return 0;
  });

  const recentStudents = [
    { name: "Aguilar Villalobos, D.", id: 1 },
    { name: "Hart, M.", id: 2 },
    { name: "Kumar, M.", id: 3 },
    { name: "Chen, W.", id: 4 },
    { name: "Rodriguez, S.", id: 5 },
    { name: "Thompson, J.", id: 6 },
    { name: "Patel, A.", id: 7 },
    { name: "Williams, J.", id: 8 },
    { name: "Flanagan, C.", id: 2 },
    { name: "Hong, L.", id: 3 },
  ];

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setCurrentPage("student-detail");
  };

  const renderPage = () => {
    if (selectedStudent && currentPage === "student-detail") {
      return <StudentDetailPage student={selectedStudent} editing={studentEditing} onBack={() => setCurrentPage("counselor")} onLoginAsStudent={() => setStudentPortalStudent(selectedStudent)} onDotClick={(s, items, idx, type) => setMilestoneModal({ student: s, items, activeIndex: idx, type })} />;
    }
    switch (currentPage) {
      case "counselor": return <CounselorDashboard students={SAMPLE_STUDENTS} onStudentClick={handleStudentClick} onDotClick={(student, items, idx, type) => setMilestoneModal({ student, items, activeIndex: idx, type })} />;
      case "tasks": return <TasksTab students={SAMPLE_STUDENTS} activeRole={activeRole} onDotClick={(student, items, idx, type) => setMilestoneModal({ student, items, activeIndex: idx, type: type || "task" })} onStudentClick={handleStudentClick} />;
      case "essay-coach": return <EssayCoachTab onStudentClick={handleStudentClick} />;
      case "tutor": return <TutorTab onStudentClick={handleStudentClick} />;
      case "colleges": return viewingCollege
        ? <CollegeDetail college={COLLEGE_DETAIL} editing={collegeEditing} onEdit={() => setCollegeEditing(true)} onSave={() => setCollegeEditing(false)} onCancel={() => setCollegeEditing(false)} />
        : <CollegesPage onViewCollege={(c) => { setViewingCollege(c); setCollegeEditing(false); }} />;
      case "highschools": return <HighSchoolsPage />;
      case "registration": return <RegistrationPage />;
      case "timetracker": return <TimeTrackerPage />;
      case "reports": return <ReportsPage />;
      case "programs": return <ProgramsPage />;
      case "services": return <ServicesPage />;
      case "productorder": return <ProductOrderPage />;
      case "settings": return <SettingsPage />;
      default: return <CounselorDashboard students={SAMPLE_STUDENTS} onStudentClick={handleStudentClick} />;
    }
  };

  if (showLogin) {
    return <LoginPage onLogin={() => setShowLogin(false)} />;
  }

  if (studentPortalStudent) {
    return <StudentPortal student={studentPortalStudent} onExit={() => setStudentPortalStudent(null)} />;
  }

  return (
    <>
    <div className="flex h-screen" style={{ backgroundColor: "#f8f7fc" }}>
        <div className="transition-all duration-300 flex flex-col" style={{ width: sidebarExpanded ? "14rem" : "3rem", backgroundColor: "#281d51", color: "white" }}>
          <div className="px-3 py-2.5" style={{ borderBottom: "1px solid #55478f" }}>
            <LogoMark expanded={sidebarExpanded} />
          </div>
          <nav className="mt-4">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button onClick={() => setCurrentPage(item.id)} className={`w-full py-3 flex items-center transition-all ${currentPage === item.id ? "border-r-4" : ""}`} style={{ backgroundColor: currentPage === item.id ? "#55478f" : "transparent", borderRightColor: currentPage === item.id ? "#ff3467" : "transparent", paddingLeft: sidebarExpanded ? 16 : 0, justifyContent: sidebarExpanded ? "flex-start" : "center" }}>
                  <item.icon />
                  {sidebarExpanded && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                </button>
                {!sidebarExpanded && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50" style={{ backgroundColor: "#281d51", color: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "5px solid #281d51" }} />
                  </div>
                )}
              </div>
            ))}
          </nav>
          {/* Recent students */}
          <div className="flex-1" style={{ overflow: sidebarExpanded ? "auto" : "visible" }}>
            <div className="p-3 mt-4" style={{ borderTop: "1px solid #55478f" }}>
              {sidebarExpanded ? (
                <>
                  <p className="text-xs font-semibold text-gray-300 mb-3 px-1">RECENT</p>
                  {recentStudents.map((student) => (
                    <button key={student.id} onClick={() => handleStudentClick(SAMPLE_STUDENTS.find((s) => s.id === student.id))} className="w-full text-left px-3 py-2 rounded-full text-xs font-medium mb-2 transition-all" style={{ backgroundColor: "#42778c", color: "white" }}>
                      {student.name}
                    </button>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {recentStudents.map((student) => {
                    const s = SAMPLE_STUDENTS.find((s) => s.id === student.id);
                    return (
                      <div key={student.id} className="relative group">
                        <button onClick={() => handleStudentClick(s)} className="transition-all hover:scale-110">
                          {s ? <StudentAvatar student={s} size={24} style={{ backgroundColor: "#42778c" }} /> : <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "#42778c" }} />}
                        </button>
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50" style={{ backgroundColor: "#281d51", color: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                          {student.name}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "5px solid #281d51" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* Toggle arrow */}
          <button onClick={() => setSidebarExpanded(prev => !prev)} className="w-full py-3 flex items-center justify-center transition-all hover:bg-white/10" style={{ borderTop: "1px solid #55478f" }}>
            <svg style={{ width: 16, height: 16, transform: sidebarExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} fill="none" stroke="#c0bad4" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Global top bar */}
          <div className="px-4 py-1 flex items-center justify-between" style={{ backgroundColor: "#55478f" }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest" style={{ color: "#8e7bb7", letterSpacing: "0.12em" }}>ROLE</span>
              <div className="flex items-center gap-0.5">
                {roles.map((role) => (
                  <button key={role.id} onClick={() => handleRoleSwitch(role.id)} className="px-3 py-1 rounded-full text-xs font-semibold transition-all" style={{ backgroundColor: activeRole === role.id ? "#ffffff" : "transparent", color: activeRole === role.id ? "#281d51" : "#c0bad4", border: activeRole === role.id ? "none" : "1px solid transparent" }}>{role.label}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input type="text" placeholder="Search for a student..." value={globalSearch} onChange={(e) => { setGlobalSearch(e.target.value); setShowSearchResults(true); }} onFocus={() => setShowSearchResults(true)} onBlur={() => setTimeout(() => setShowSearchResults(false), 200)} className="px-3 py-1 rounded-md text-xs w-60" style={{ backgroundColor: "#ffffff", border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
                {showSearchResults && globalSearchResults.length > 0 && (
                  <div className="absolute top-9 left-0 w-60 rounded-lg shadow-lg py-1 z-50" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    {globalSearchResults.map((s) => (
                      <button key={s.id} onClick={() => { handleStudentClick(s); setGlobalSearch(""); setShowSearchResults(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                        <StudentAvatar student={s} size={24} />
                        <div><p className="text-xs font-medium" style={{ color: "#281d51" }}>{s.lastName}, {s.firstName}</p><p className="text-xs" style={{ color: "#b2b2b2" }}>{s.highSchool} • {s.gradYear}</p></div>
                      </button>
                    ))}
                  </div>
                )}
                {showSearchResults && globalSearch.length >= 2 && globalSearchResults.length === 0 && (
                  <div className="absolute top-9 left-0 w-60 rounded-lg shadow-lg py-2 px-3 z-50" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    <p className="text-xs" style={{ color: "#b2b2b2" }}>No students found</p>
                  </div>
                )}
              </div>
              <div className="relative">
                <button className="relative p-1 hover:bg-white/10 rounded-md transition-colors" title="Notifications">
                  <svg style={{ width: 18, height: 18 }} fill="none" stroke="#ffffff" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#ff3467" }} />
                </button>
              </div>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="w-7 h-7 rounded-full overflow-hidden transition-opacity hover:opacity-80" style={{ border: "2px solid #ffffff", flexShrink: 0 }} title="Profile">
                  <img src={`${import.meta.env.BASE_URL}${getStaffPhoto("Alex Morgan")}`} alt="Alex Morgan" className="w-full h-full object-cover" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-10 w-48 rounded-lg shadow-lg py-2 z-50" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    <div className="px-4 py-2" style={{ borderBottom: "1px solid #e5e0f0" }}>
                      <p className="text-sm font-semibold" style={{ color: "#281d51" }}>Alex Morgan</p>
                      <p className="text-xs" style={{ color: "#b2b2b2" }}>amorgan@example.com</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: "#474747" }}>Profile Settings</button>
                    <button onClick={() => { setProfileOpen(false); setShowLogin(true); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: "#ff3467" }}>Log Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Action bar — page-level controls, only shown when there are actions */}
          {(currentPage === "student-detail" || (currentPage === "colleges" && viewingCollege)) && (
            <div className="px-6 py-3 flex items-center gap-3" style={{ backgroundColor: "white", borderBottom: "1px solid #e5e0f0" }}>
              {currentPage === "student-detail" && (
                <>
                  <button onClick={() => { setCurrentPage("counselor"); setStudentEditing(false); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Dashboard
                  </button>
                  {studentEditing ? (
                    <>
                      <button onClick={() => setStudentEditing(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "#f0edf5", color: "#474747" }}>Cancel</button>
                      <button onClick={() => setStudentEditing(false)} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>Save Changes</button>
                    </>
                  ) : (
                    <button onClick={() => setStudentEditing(true)} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>Edit</button>
                  )}
                </>
              )}
              {currentPage === "colleges" && viewingCollege && (
                <>
                  <button onClick={() => { setViewingCollege(null); setCollegeEditing(false); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Colleges
                  </button>
                  {collegeEditing ? (
                    <>
                      <button onClick={() => setCollegeEditing(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "#f0edf5", color: "#474747" }}>Cancel</button>
                      <button onClick={() => setCollegeEditing(false)} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>Save Changes</button>
                    </>
                  ) : (
                    <button onClick={() => setCollegeEditing(true)} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#55478f" }}>Edit</button>
                  )}
                </>
              )}
            </div>
          )}
          {/* Dashboard tabs */}
          {!["student-detail", "colleges", "highschools", "registration", "timetracker", "reports", "programs", "services", "settings", "productorder"].includes(currentPage) && (
            <div className="px-6 flex gap-1" style={{ backgroundColor: "white", borderBottom: "1px solid #e5e0f0" }}>
              {dashTabs.map((tab) => (
                <button key={tab.id} onClick={() => setCurrentPage(tab.id)} className="px-5 py-3 text-sm font-semibold transition-all" style={{ color: currentPage === tab.id ? "#281d51" : "#b2b2b2", borderBottom: currentPage === tab.id ? "3px solid #ff3467" : "3px solid transparent" }}>{tab.label}</button>
              ))}
            </div>
          )}
          <div className="flex-1 overflow-auto">{renderPage()}</div>
        </div>
      </div>
      {milestoneModal && <TaskMilestoneModal modal={milestoneModal} onClose={() => setMilestoneModal(null)} />}
    </>
  );
}
