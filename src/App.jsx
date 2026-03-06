import { useState } from "react";

// Logo placeholder — swap with actual shield asset in production
const LogoMark = ({ expanded }) => (
  <div className="flex items-center" style={{ justifyContent: expanded ? "flex-start" : "center" }}>
    <div className="flex items-center justify-center font-bold" style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#55478f", color: "#ffffff", fontSize: 15, fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.5px" }}>HC</div>
    {expanded && <span className="ml-3 font-bold text-lg tracking-tight" style={{ color: "#ffffff", fontFamily: "Montserrat, sans-serif" }}>HelloCollege</span>}
  </div>
);

// Icon SVG Components
const Icons = {
  Dashboard: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
    </svg>
  ),
  Colleges: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
    </svg>
  ),
  HighSchools: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
    </svg>
  ),
  Registration: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TimeTracker: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Reports: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Programs: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  Services: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Email: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Info: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Sample Students Data
const SAMPLE_STUDENTS = [
  {
    id: 1, firstName: "Daniela", lastName: "Aguilar Villalobos", highSchool: "Lincoln HS", state: "CA", gradYear: 2026,
    counselor: "Lucas Austin", essayCoach: "Chris Bench", tutor: "Ian Simon", meetings: 12, lastMeeting: "01/13/26",
    nextContact: "03/08/26", nextMeeting: "03/15/26", counselorHoursUsed: 16.75, counselorHoursTotal: 19,
    essayHoursUsed: 0, essayHoursTotal: 15, tutorHoursUsed: 0, tutorHoursTotal: 10, workshops: 18,
    nextWorkshop: "NOT BOOKED", nextWorkshopDate: null, notes: "Strong student, on track with college process",
    gender: "Female", email: "daniela.aguilar@email.com", phone: "(555)123-4567", major: "Environmental Science",
    gpaUnweighted: 3.72, gpaWeighted: 4.05, actComposite: 31, satTotal: 1380,
    apClasses: ["AP Environmental Science", "AP Spanish"],
  },
  {
    id: 2, firstName: "Madelyn", lastName: "Hart", highSchool: "Westview Academy", state: "FL", gradYear: 2026,
    counselor: "Lucas Austin", essayCoach: "Chris Bench", tutor: "Ian Simon", meetings: 17, lastMeeting: "01/06/26",
    nextContact: "03/10/26", nextMeeting: "03/17/26", counselorHoursUsed: 19, counselorHoursTotal: 20,
    essayHoursUsed: 12, essayHoursTotal: 15, tutorHoursUsed: 5, tutorHoursTotal: 10, workshops: 33,
    nextWorkshop: "NOT BOOKED", nextWorkshopDate: null, notes: "Bought before meetings or hours",
    gender: "Female", email: "madelyn.hart@email.com", phone: "(555)867-5309", major: "Undecided (Psychology/Pre-Med)",
    gpaUnweighted: 3.65, gpaWeighted: 3.89, actComposite: 32, satTotal: 1420,
    apClasses: ["AP Biology", "AP English Language", "AP US History", "AP Calculus AB"],
  },
  {
    id: 3, firstName: "Meera", lastName: "Kumar", highSchool: "North Ridge Prep", state: "NY", gradYear: 2027,
    counselor: "Lucas Austin", essayCoach: "Chen David", tutor: "Ian Simon", meetings: 24, lastMeeting: "02/25/26",
    nextContact: "03/12/26", nextMeeting: "03/19/26", counselorHoursUsed: 26.75, counselorHoursTotal: 60,
    essayHoursUsed: 4, essayHoursTotal: 20, tutorHoursUsed: 15, tutorHoursTotal: 25, workshops: 8,
    nextWorkshop: "NOT BOOKED", nextWorkshopDate: null, notes: "Excellent student, very engaged",
    gender: "Female", email: "meera.kumar@email.com", phone: "(555)123-4567", major: "Computer Science",
    gpaUnweighted: 3.95, gpaWeighted: 4.15, actComposite: 34, satTotal: 1480,
    apClasses: ["AP Computer Science", "AP Calculus BC", "AP Physics"],
  },
  {
    id: 4, firstName: "William", lastName: "Chen", highSchool: "Eastlake HS", state: "WA", gradYear: 2026,
    counselor: "Krebs Kevin", essayCoach: "Bench Chris", tutor: "Lauren Fogg", meetings: 8, lastMeeting: "12/15/25",
    nextContact: "03/05/26", nextMeeting: "03/15/26", counselorHoursUsed: 10, counselorHoursTotal: 15,
    essayHoursUsed: 6, essayHoursTotal: 15, tutorHoursUsed: 5, tutorHoursTotal: 10, workshops: 12,
    nextWorkshop: "College Research WS", nextWorkshopDate: "03/15/26", notes: "",
    gender: "Male", email: "wchen@eastlake.edu", phone: "(555)234-5678", major: "Engineering",
    gpaUnweighted: 3.7, gpaWeighted: 3.85, actComposite: 28, satTotal: 1200,
    apClasses: ["AP Calculus AB", "AP Physics"],
  },
  {
    id: 5, firstName: "Sofia", lastName: "Rodriguez", highSchool: "Memorial HS", state: "TX", gradYear: 2027,
    counselor: "Hall Meg", essayCoach: "Bench Chris", tutor: "Lauren Fogg", meetings: 3, lastMeeting: "03/01/26",
    nextContact: "03/15/26", nextMeeting: "03/20/26", counselorHoursUsed: 4.5, counselorHoursTotal: 20,
    essayHoursUsed: 0, essayHoursTotal: 20, tutorHoursUsed: 8, tutorHoursTotal: 25, workshops: 5,
    nextWorkshop: "FAFSA Workshop", nextWorkshopDate: "03/20/26", notes: "",
    gender: "Female", email: "sofia.rodriguez@email.com", phone: "(555)345-6789", major: "Business",
    gpaUnweighted: 3.55, gpaWeighted: 3.75, actComposite: 29, satTotal: 1320,
    apClasses: ["AP Economics"],
  },
  {
    id: 6, firstName: "James", lastName: "Thompson", highSchool: "Oak Park Academy", state: "IL", gradYear: 2025,
    counselor: "Hall Meg", essayCoach: "Chen David", tutor: "Ian Simon", meetings: 30, lastMeeting: "02/28/26",
    nextContact: "03/10/26", nextMeeting: null, counselorHoursUsed: 28, counselorHoursTotal: 30,
    essayHoursUsed: 18, essayHoursTotal: 20, tutorHoursUsed: 10, tutorHoursTotal: 10, workshops: 25,
    nextWorkshop: "NOT BOOKED", nextWorkshopDate: null, notes: "Completed, awaiting decision",
    gender: "Male", email: "james.thompson@email.com", phone: "(555)456-7890", major: "Finance",
    gpaUnweighted: 3.8, gpaWeighted: 4.0, actComposite: 33, satTotal: 1420,
    apClasses: ["AP Calculus BC", "AP Economics", "AP Statistics"],
  },
  {
    id: 7, firstName: "Ananya", lastName: "Patel", highSchool: "Riverside HS", state: "NJ", gradYear: 2026,
    counselor: "Krebs Kevin", essayCoach: "Bench Chris", tutor: "Lauren Fogg", meetings: 15, lastMeeting: "02/10/26",
    nextContact: "03/08/26", nextMeeting: "03/12/26", counselorHoursUsed: 14, counselorHoursTotal: 18,
    essayHoursUsed: 8, essayHoursTotal: 15, tutorHoursUsed: 0, tutorHoursTotal: 10, workshops: 20,
    nextWorkshop: "Essay Workshop", nextWorkshopDate: "03/12/26", notes: "",
    gender: "Female", email: "ananya.patel@email.com", phone: "(555)567-8901", major: "Medicine/Pre-Med",
    gpaUnweighted: 3.9, gpaWeighted: 4.1, actComposite: 33, satTotal: 1450,
    apClasses: ["AP Chemistry", "AP Biology", "AP Calculus AB"],
  },
  {
    id: 8, firstName: "Jordan", lastName: "Williams", highSchool: "Crestwood Prep", state: "MA", gradYear: 2027,
    counselor: "Hall Meg", essayCoach: "Chen David", tutor: "Ian Simon", meetings: 6, lastMeeting: "01/20/26",
    nextContact: "03/12/26", nextMeeting: "03/19/26", counselorHoursUsed: 8, counselorHoursTotal: 25,
    essayHoursUsed: 0, essayHoursTotal: 20, tutorHoursUsed: 10, tutorHoursTotal: 25, workshops: 3,
    nextWorkshop: "NOT BOOKED", nextWorkshopDate: null, notes: "",
    gender: "Non-binary", email: "jordan.williams@email.com", phone: "(555)678-9012", major: "Computer Science",
    gpaUnweighted: 3.6, gpaWeighted: 3.8, actComposite: 30, satTotal: 1380,
    apClasses: ["AP Computer Science Principles"],
  },
];

const TASK_MILESTONES = [
  "Complete YouScience & Assessment", "Review S.A.F.E College Preferences", "Create College Research Plan",
  "Review High School Course Selection", "Develop Test Prep Strategy", "Private Budget Meeting",
  "Develop Preliminary College List", "Establish Recommendation Letter Strategy", "Develop Resume",
  "Define Scholarship Plan", "Refine College List", "Common App Personal Statement Topic Identified",
  "Supplemental Essay Strategy", "Complete My Common App Personal Statement", "Set Application Strategy",
  "1-1 Application Review", "All Essays Reviewed", "Mock College Interview Meeting",
  "Award Assessment & Decision Meeting", "Additional Milestone",
];

const WORKSHOPS = [
  "Major and Career Exploration Workshop", "Stand Out Factor Workshop", "College Admissions 101 Workshop",
  "Mastering Academic Success Workshop", "Standing Out as an Underclassman Workshop", "Paying for College Workshop",
  "Take a Practice ACT or SAT", "Junior Scholarship Workshop", "Activities & Honors Workshop",
  "Common App Personal Statement Workshop", "Common Application Workshop", "Supplemental Essay Workshop",
  "FAFSA/CSS Profile Workshop", "Senior Scholarship Bootcamp", "College & Career Transition Workshop",
];

const generateTaskStatus = (studentIndex, taskIndex) => {
  const student = SAMPLE_STUDENTS[studentIndex];
  const gradYear = student.gradYear;
  const progressPercent = gradYear === 2025 ? 0.9 : gradYear === 2026 ? 0.5 : 0.2;
  const completedTasks = Math.floor(TASK_MILESTONES.length * progressPercent);
  const inProgressTasks = Math.floor(TASK_MILESTONES.length * 0.1);
  if (taskIndex < completedTasks) return "completed";
  if (taskIndex < completedTasks + inProgressTasks) return "in-progress";
  if (Math.random() < 0.05) return "opted-out";
  return "not-started";
};

const generateWorkshopStatus = (studentIndex, workshopIndex) => {
  const student = SAMPLE_STUDENTS[studentIndex];
  const gradYear = student.gradYear;
  const progressPercent = gradYear === 2025 ? 0.85 : gradYear === 2026 ? 0.4 : 0.1;
  const completedWorkshops = Math.floor(WORKSHOPS.length * progressPercent);
  const registeredWorkshops = Math.floor(WORKSHOPS.length * 0.15);
  const inProgressWorkshops = Math.floor(WORKSHOPS.length * 0.05);
  if (workshopIndex < completedWorkshops) return "completed";
  if (workshopIndex < completedWorkshops + registeredWorkshops) return "registered";
  if (workshopIndex < completedWorkshops + registeredWorkshops + inProgressWorkshops) return "in-progress";
  if (Math.random() < 0.05) return "opted-out";
  return "not-started";
};

// Status colors (brand)
const STATUS_COLORS = { completed: "#00e6c3", "in-progress": "#fbbf24", "not-started": "#c0bad4", behind: "#ff3467", "opted-out": "#e5e0f0", registered: "#42788c" };
const STATUS_LABELS = { completed: "Completed", "in-progress": "In Progress", "not-started": "Not Started", behind: "Behind Schedule", "opted-out": "Opted Out", registered: "Registered" };

// Mini SVG icons for tasks (by index)
const TASK_ICONS = [
  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", // clipboard - YouScience
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", // heart - SAFE Prefs
  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", // search - Research Plan
  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", // book - Course Selection
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", // pencil - Test Prep
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // dollar - Budget
  "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", // box - College List
  "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", // mail - Rec Letters
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", // doc - Resume
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // dollar - Scholarship
  "M4 6h16M4 10h16M4 14h16M4 18h16", // list - Refine List
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", // pencil - PS Topic
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", // pencil - Supp Essay
  "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // check - Complete PS
  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", // clipboard - App Strategy
  "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", // eye - App Review
  "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // check - Essays Reviewed
  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", // people - Mock Interview
  "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", // badge - Award
  "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3", // star - Additional
];

// Mini SVG icons for workshops (by index)
const WORKSHOP_ICONS = [
  "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", // briefcase - Career
  "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3", // star - Stand Out
  "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", // grad cap - Admissions 101
  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", // book - Academic
  "M13 10V3L4 14h7v7l9-11h-7z", // bolt - Underclassman
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // dollar - Paying
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", // pencil - Practice Test
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // dollar - Jr Scholarship
  "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3", // star - Activities
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", // pencil - PS Workshop
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", // doc - Common App
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", // pencil - Supp Essay
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // dollar - FAFSA
  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // dollar - Sr Scholarship
  "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", // trending - Transition
];

// Generate due dates based on task index
const getTaskDueDate = (taskIdx, gradYear) => {
  const monthOffset = Math.floor(taskIdx * 1.2);
  const baseMonth = gradYear === 2025 ? 1 : gradYear === 2026 ? 4 : 8;
  const month = ((baseMonth + monthOffset - 1) % 12) + 1;
  const year = month < baseMonth ? 26 : 25;
  return `${String(month).padStart(2,"0")}/15/${year}`;
};

// Determine if behind schedule (due date passed but not completed)
const getEffectiveStatus = (rawStatus, dueDate) => {
  if (rawStatus === "completed" || rawStatus === "opted-out") return rawStatus;
  const parts = dueDate.split("/");
  const due = new Date(2000 + parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
  const today = new Date();
  if (due < today && rawStatus === "not-started") return "behind";
  return rawStatus;
};

// Timeline dot component with tooltip
function TimelineDot({ icon, status, name, dueDate }) {
  const [showTip, setShowTip] = useState(false);
  const color = STATUS_COLORS[status] || "#c0bad4";
  return (
    <div className="relative" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125" style={{ backgroundColor: color }}>
        <svg className="w-3.5 h-3.5" fill="none" stroke={status === "not-started" || status === "opted-out" ? "#8e7bb7" : "#ffffff"} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
      </div>
      {showTip && (
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap z-50" style={{ backgroundColor: "#281d51", color: "#ffffff" }}>
          <p className="font-semibold">{name}</p>
          <p style={{ color: "#c0bad4" }}>{STATUS_LABELS[status]} • Due {dueDate}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #281d51" }} />
        </div>
      )}
    </div>
  );
}

export default function PortalApp() {
  const [activeRole, setActiveRole] = useState("admin");
  const [currentPage, setCurrentPage] = useState("counselor");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Nav items filtered by role
  const allNavItems = [
    { id: "counselor", label: "Dashboard", icon: Icons.Dashboard, roles: ["admin", "counselor", "essay-coach", "tutor"] },
    { id: "colleges", label: "Colleges", icon: Icons.Colleges, roles: ["admin", "counselor"] },
    { id: "highschools", label: "High Schools", icon: Icons.HighSchools, roles: ["admin", "counselor"] },
    { id: "registration", label: "Registration", icon: Icons.Registration, roles: ["admin", "counselor"] },
    { id: "timetracker", label: "Time Tracker", icon: Icons.TimeTracker, roles: ["admin", "counselor", "essay-coach", "tutor"] },
    { id: "reports", label: "Reports", icon: Icons.Reports, roles: ["admin"] },
    { id: "programs", label: "Programs", icon: Icons.Programs, roles: ["admin"] },
    { id: "services", label: "Services", icon: Icons.Services, roles: ["admin"] },
    { id: "settings", label: "Settings", icon: Icons.Settings, roles: ["admin"] },
  ];
  const navItems = allNavItems.filter((item) => item.roles.includes(activeRole));

  // Dashboard sub-tabs filtered by role
  const allDashTabs = [
    { id: "counselor", label: "Counselor", roles: ["admin", "counselor"] },
    { id: "tasks", label: "Tasks", roles: ["admin", "counselor"] },
    { id: "workshops", label: "Workshops", roles: ["admin", "counselor"] },
    { id: "essay-coach", label: "Essay Coach", roles: ["admin", "essay-coach"] },
    { id: "tutor", label: "Tutor", roles: ["admin", "tutor"] },
  ];
  const dashTabs = allDashTabs.filter((tab) => tab.roles.includes(activeRole));

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
      return <StudentDetailPage student={selectedStudent} onBack={() => setCurrentPage("counselor")} />;
    }
    switch (currentPage) {
      case "counselor": return <CounselorDashboard students={SAMPLE_STUDENTS} onStudentClick={handleStudentClick} />;
      case "tasks": return <TasksTab students={SAMPLE_STUDENTS} />;
      case "workshops": return <WorkshopsTab students={SAMPLE_STUDENTS} />;
      case "essay-coach": return <EssayCoachTab />;
      case "tutor": return <TutorTab />;
      case "colleges": return <PlaceholderPage title="Colleges" description="College database with admissions data, deadlines, and student match tracking." />;
      case "highschools": return <PlaceholderPage title="High Schools" description="High school directory with partnership details, student counts, and counselor assignments." />;
      case "registration": return <PlaceholderPage title="Registration & Attendance" description="Student registration management, attendance tracking, and enrollment status." />;
      case "timetracker": return <TimeTrackerPage />;
      case "reports": return <ReportsPage />;
      case "programs": return <PlaceholderPage title="Programs" description="Program configuration, pricing tiers, and enrollment management." />;
      case "services": return <PlaceholderPage title="Services" description="Service catalog with hours packages, add-ons, and availability settings." />;
      case "settings": return <SettingsPage />;
      default: return <CounselorDashboard students={SAMPLE_STUDENTS} onStudentClick={handleStudentClick} />;
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#f8f7fc" }}>
        <div className="transition-all duration-300" style={{ width: sidebarExpanded ? "14rem" : "4rem", backgroundColor: "#281d51", color: "white", overflowY: "auto" }} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)}>
          <div className="p-3" style={{ borderBottom: "1px solid #55478f" }}>
            <LogoMark expanded={sidebarExpanded} />
          </div>
          <nav className="mt-4">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`w-full px-4 py-3 flex items-center transition-all ${currentPage === item.id ? "border-r-4" : ""}`} style={{ backgroundColor: currentPage === item.id ? "#55478f" : "transparent", borderRightColor: currentPage === item.id ? "#ff3467" : "transparent" }}>
                <item.icon />
                {sidebarExpanded && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
          {sidebarExpanded && (
            <div className="mt-8 p-4" style={{ borderTop: "1px solid #55478f" }}>
              <p className="text-xs font-semibold text-gray-300 mb-3">RECENT</p>
              {recentStudents.map((student) => (
                <button key={student.id} onClick={() => handleStudentClick(SAMPLE_STUDENTS.find((s) => s.id === student.id))} className="w-full text-left px-3 py-2 rounded-full text-xs font-medium mb-2 transition-all" style={{ backgroundColor: "#42778c", color: "white" }}>
                  {student.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Global top bar — persistent across all pages */}
          <div className="px-6 py-2 flex items-center justify-between" style={{ backgroundColor: "#55478f" }}>
            <div className="flex items-center gap-1">
              {roles.map((role) => (
                <button key={role.id} onClick={() => handleRoleSwitch(role.id)} className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all" style={{ backgroundColor: activeRole === role.id ? "#ffffff" : "transparent", color: activeRole === role.id ? "#281d51" : "#c0bad4", border: activeRole === role.id ? "none" : "1px solid transparent" }}>{role.label}</button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input type="text" placeholder="Search for a student..." value={globalSearch} onChange={(e) => { setGlobalSearch(e.target.value); setShowSearchResults(true); }} onFocus={() => setShowSearchResults(true)} onBlur={() => setTimeout(() => setShowSearchResults(false), 200)} className="px-4 py-2 rounded-lg text-sm w-72" style={{ backgroundColor: "#ffffff", border: "1px solid #c0bad4", color: "#474747", outline: "none" }} />
                {showSearchResults && globalSearchResults.length > 0 && (
                  <div className="absolute top-11 left-0 w-72 rounded-lg shadow-lg py-1 z-50" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    {globalSearchResults.map((s) => (
                      <button key={s.id} onClick={() => { handleStudentClick(s); setGlobalSearch(""); setShowSearchResults(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#8e7bb7" }}>{s.firstName[0]}{s.lastName[0]}</div>
                        <div><p className="text-sm font-medium" style={{ color: "#281d51" }}>{s.lastName}, {s.firstName}</p><p className="text-xs" style={{ color: "#b2b2b2" }}>{s.highSchool} • {s.gradYear}</p></div>
                      </button>
                    ))}
                  </div>
                )}
                {showSearchResults && globalSearch.length >= 2 && globalSearchResults.length === 0 && (
                  <div className="absolute top-11 left-0 w-72 rounded-lg shadow-lg py-3 px-4 z-50" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    <p className="text-sm" style={{ color: "#b2b2b2" }}>No students found</p>
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-opacity hover:opacity-80" style={{ backgroundColor: "#ff3467", color: "#ffffff", border: "2px solid #ffffff" }}>AL</button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-lg shadow-lg py-2 z-50" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    <div className="px-4 py-2" style={{ borderBottom: "1px solid #e5e0f0" }}>
                      <p className="text-sm font-semibold" style={{ color: "#281d51" }}>Austin Lucas</p>
                      <p className="text-xs" style={{ color: "#b2b2b2" }}>***REMOVED***</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: "#474747" }}>Profile Settings</button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors" style={{ color: "#ff3467" }}>Log Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Page-specific header */}
          <div className="border-b" style={{ backgroundColor: "white", borderBottomColor: "#e5e0f0" }}>
            <div className="px-6 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold" style={{ color: "#281d51" }}>
                {currentPage === "student-detail" && selectedStudent
                  ? `${selectedStudent.lastName}, ${selectedStudent.firstName}`
                  : { colleges: "Colleges", highschools: "High Schools", registration: "Registration & Attendance", timetracker: "Time Tracker", reports: "Reports", programs: "Programs", services: "Services", settings: "Settings" }[currentPage] || "Dashboard"}
              </h1>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg" style={{ color: "#55478f" }}><Icons.Email /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" style={{ color: "#55478f" }}><Icons.Info /></button>
              </div>
            </div>
            {!["student-detail", "colleges", "highschools", "registration", "timetracker", "reports", "programs", "services", "settings"].includes(currentPage) && (
              <div className="px-6 flex gap-1">
                {dashTabs.map((tab) => (
                  <button key={tab.id} onClick={() => setCurrentPage(tab.id)} className="px-5 py-3 text-sm font-semibold transition-all" style={{ color: currentPage === tab.id ? "#281d51" : "#b2b2b2", borderBottom: currentPage === tab.id ? "3px solid #ff3467" : "3px solid transparent" }}>{tab.label}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto">{renderPage()}</div>
        </div>
      </div>
  );
}

function CounselorDashboard({ students, onStudentClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");

  const filteredStudents = students.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.highSchool.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounselor = counselorFilter === "all" || s.counselor === counselorFilter;
    const matchesGradYear = gradYearFilter === "all" || s.gradYear === parseInt(gradYearFilter);
    return matchesSearch && matchesCounselor && matchesGradYear;
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
      <div className="flex gap-4 mb-6 items-center">
        <input type="text" placeholder="Search by name or school..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" style={{ borderColor: "#c0bad4" }} />
        <select value={counselorFilter} onChange={(e) => setCounselorFilter(e.target.value)} className="px-4 py-2 border rounded-lg" style={{ borderColor: "#c0bad4" }}>
          <option value="all">All Counselors</option>
          {uniqueCounselors.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <div className="flex gap-2">
          {[2025, 2026, 2027].map((year) => (
            <button key={year} onClick={() => setGradYearFilter(gradYearFilter === year.toString() ? "all" : year.toString())} className="px-3 py-2 rounded-full text-sm font-medium transition-all" style={{ backgroundColor: gradYearFilter === year.toString() ? "#55478f" : "#e5e0f0", color: gradYearFilter === year.toString() ? "white" : "#474747" }}>{year}</button>
          ))}
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
            {/* Row 1: Student info + email/info icons */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#8e7bb7", flexShrink: 0 }}>{student.firstName[0]}{student.lastName[0]}</div>
              <div className="flex-1 min-w-0">
                <button onClick={() => onStudentClick(student)} className="font-bold text-base hover:opacity-80 transition-opacity text-left" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</button>
                <div className="flex items-center gap-2">
                  <p className="text-xs" style={{ color: "#b2b2b2" }}>{student.highSchool} • Class of {student.gradYear}</p>
                  <button className="p-1 hover:bg-gray-100 rounded" style={{ color: "#8e7bb7" }}><Icons.Email /></button>
                  <button className="p-1 hover:bg-gray-100 rounded" style={{ color: "#8e7bb7" }}><Icons.Info /></button>
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
            {/* Row 2: Tasks timeline */}
            <div className="mb-2">
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#b2b2b2" }}>TASKS</p>
              <div className="flex gap-1 flex-wrap">
                {TASK_MILESTONES.map((task, tIdx) => {
                  const sIdx = SAMPLE_STUDENTS.indexOf(student);
                  const raw = generateTaskStatus(sIdx, tIdx);
                  const due = getTaskDueDate(tIdx, student.gradYear);
                  const status = getEffectiveStatus(raw, due);
                  return <TimelineDot key={tIdx} icon={TASK_ICONS[tIdx]} status={status} name={task} dueDate={due} />;
                })}
              </div>
            </div>
            {/* Row 3: Metric items */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2">
              <MetricItem label="Meetings" value={student.meetings} />
              <MetricItem label="Last Meeting" value={student.lastMeeting} color={getStatusColor(daysSince(student.lastMeeting))} />
              <MetricItem label="Next Contact" value={student.nextContact} />
              <MetricItem label="Next Meeting" value={student.nextMeeting || "TBD"} />
              <MetricItem label="Next Workshop" value={student.nextWorkshop === "NOT BOOKED" ? "NOT BOOKED" : student.nextWorkshop} color={student.nextWorkshop === "NOT BOOKED" ? "#ff3467" : undefined} />
            </div>
            {/* Row 4: Workshops timeline */}
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#b2b2b2" }}>WORKSHOPS</p>
              <div className="flex gap-1 flex-wrap">
                {WORKSHOPS.map((ws, wIdx) => {
                  const sIdx = SAMPLE_STUDENTS.indexOf(student);
                  const raw = generateWorkshopStatus(sIdx, wIdx);
                  const due = getTaskDueDate(wIdx, student.gradYear);
                  const status = getEffectiveStatus(raw, due);
                  return <TimelineDot key={wIdx} icon={WORKSHOP_ICONS[wIdx]} status={status} name={ws} dueDate={due} />;
                })}
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

function MetricItem({ label, value, color }) {
  return (
    <span className="text-sm">
      <span className="font-semibold" style={{ color: "#b2b2b2" }}>{label}:&nbsp;</span>
      <span className="max-[640px]:block font-bold" style={{ color: color || "#281d51" }}>{value}</span>
    </span>
  );
}

function TasksTab({ students }) {
  return (
    <div className="p-6">
      <div className="flex gap-6 mb-6 pb-4" style={{ borderBottom: "1px solid #e5e0f0" }}>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#00e6c3" }} /><span className="text-sm font-medium">Completed</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#fbbf24" }} /><span className="text-sm font-medium">In Progress</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#ff3467" }} /><span className="text-sm font-medium">Not Started</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#e5e0f0" }} /><span className="text-sm font-medium">Opted Out</span></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#f0ece8" }}>
              <th className="sticky left-0 p-4 text-left text-sm font-semibold z-10" style={{ backgroundColor: "#f0ece8", color: "#281d51", minWidth: "200px" }}>Student</th>
              {TASK_MILESTONES.map((milestone, idx) => (
                <th key={idx} className="p-4 text-center text-xs font-semibold" style={{ color: "#474747", minWidth: "80px" }}>
                  <div style={{ transform: "rotate(-45deg)", transformOrigin: "center", whiteSpace: "nowrap", fontSize: "11px" }}>{idx + 1}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, studentIdx) => (
              <tr key={student.id} style={{ borderBottom: "1px solid #e5e0f0" }}>
                <td className="sticky left-0 p-4 text-sm font-medium z-10" style={{ backgroundColor: "white", color: "#281d51" }}>{student.lastName}, {student.firstName}</td>
                {TASK_MILESTONES.map((milestone, taskIdx) => {
                  const status = generateTaskStatus(studentIdx, taskIdx);
                  const colors = { completed: "#00e6c3", "in-progress": "#fbbf24", "not-started": "#ff3467", "opted-out": "#e5e0f0" };
                  return (
                    <td key={`${student.id}-${taskIdx}`} className="p-4 text-center">
                      <div className="w-5 h-5 rounded-full mx-auto" style={{ backgroundColor: colors[status] }} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkshopsTab({ students }) {
  return (
    <div className="p-6">
      <div className="flex gap-6 mb-6 pb-4" style={{ borderBottom: "1px solid #e5e0f0" }}>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#00e6c3" }} /><span className="text-sm font-medium">Completed</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#3b82f6" }} /><span className="text-sm font-medium">Registered</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#fbbf24" }} /><span className="text-sm font-medium">In Progress</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#ff3467" }} /><span className="text-sm font-medium">Not Started</span></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: "#f0ece8" }}>
              <th className="sticky left-0 p-4 text-left text-sm font-semibold z-10" style={{ backgroundColor: "#f0ece8", color: "#281d51", minWidth: "200px" }}>Student</th>
              {WORKSHOPS.map((workshop, idx) => (
                <th key={idx} className="p-4 text-center text-xs font-semibold" style={{ color: "#474747", minWidth: "80px" }}>
                  <div style={{ transform: "rotate(-45deg)", transformOrigin: "center", whiteSpace: "nowrap", fontSize: "11px" }}>{idx + 1}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, studentIdx) => (
              <tr key={student.id} style={{ borderBottom: "1px solid #e5e0f0" }}>
                <td className="sticky left-0 p-4 text-sm font-medium z-10" style={{ backgroundColor: "white", color: "#281d51" }}>{student.lastName}, {student.firstName}</td>
                {WORKSHOPS.map((workshop, workshopIdx) => {
                  const status = generateWorkshopStatus(studentIdx, workshopIdx);
                  const colors = { completed: "#00e6c3", registered: "#3b82f6", "in-progress": "#fbbf24", "not-started": "#ff3467", "opted-out": "#e5e0f0" };
                  return (
                    <td key={`${student.id}-${workshopIdx}`} className="p-4 text-center">
                      <div className="w-5 h-5 rounded-full mx-auto" style={{ backgroundColor: colors[status] }} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EssayCoachTab() {
  const essayStudents = [
    { id: 1, firstName: "Michael", lastName: "Charles", major: "Business Marketing", counselor: "Hall Meg", coach: "Bench Chris", lastMeeting: "06/18/25", nextScheduled: "03/12/26", totalMeetings: 5, hoursUsed: 6.5, hoursTotal: 10 },
    { id: 2, firstName: "Callie", lastName: "Flanagan", major: "Pre-Med", counselor: "Krebs Kevin", coach: "Bench Chris", lastMeeting: "07/14/25", nextScheduled: "03/15/26", totalMeetings: 5, hoursUsed: 15.5, hoursTotal: 21 },
    { id: 3, firstName: "Logan", lastName: "Hong", major: "Biomedical Engineering", counselor: "—", coach: "Bench Chris", lastMeeting: "10/18/25", nextScheduled: "03/18/26", totalMeetings: 13, hoursUsed: 22.5, hoursTotal: 24 },
    { id: 4, firstName: "Madelyn", lastName: "Hart", major: "Undecided", counselor: "Lucas Austin", coach: "Bench Chris", lastMeeting: "01/06/26", nextScheduled: "03/12/26", totalMeetings: 8, hoursUsed: 12, hoursTotal: 15 },
    { id: 5, firstName: "Meera", lastName: "Kumar", major: "Computer Science", counselor: "Lucas Austin", coach: "Chen David", lastMeeting: "02/15/26", nextScheduled: "03/20/26", totalMeetings: 3, hoursUsed: 4, hoursTotal: 20 },
  ];
  const essayMilestones = ["Common App PS Workshop", "PS Topic Identified", "Complete PS", "Supplemental Essay WS", "Supplemental Essay Strategy", "All Essays Reviewed"];

  return (
    <div className="p-6">
      <div className="grid gap-4">
        {essayStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-start gap-4 mb-4 pb-4" style={{ borderBottom: "1px solid #e5e0f0" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#8e7bb7", flexShrink: 0 }}>{student.firstName[0]}{student.lastName[0]}</div>
              <div className="flex-1">
                <p className="font-bold" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</p>
                <p className="text-sm" style={{ color: "#b2b2b2" }}>{student.major}</p>
                <div className="flex gap-4 mt-2 text-xs"><span style={{ color: "#474747" }}>Counselor: {student.counselor}</span><span style={{ color: "#474747" }}>Coach: {student.coach}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>LAST MEETING</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.lastMeeting}</p></div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>NEXT SCHEDULED</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.nextScheduled}</p></div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>TOTAL MEETINGS</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.totalMeetings}</p></div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>HOURS</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.hoursUsed}/{student.hoursTotal}</p><div className="w-full h-1 rounded-full mt-1" style={{ backgroundColor: "#e5e0f0" }}><div className="h-full rounded-full" style={{ width: `${(student.hoursUsed / student.hoursTotal) * 100}%`, backgroundColor: "#00e6c3" }} /></div></div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>REMAINING</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{(student.hoursTotal - student.hoursUsed).toFixed(1)}</p></div>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {essayMilestones.map((milestone, idx) => (
                <div key={idx} className="text-center"><p className="text-xs font-semibold mb-2" style={{ color: "#474747" }}>{milestone}</p><div className="w-5 h-5 rounded-full mx-auto" style={{ backgroundColor: (student.id + idx) % 3 === 0 ? "#fbbf24" : "#00e6c3" }} /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TutorTab() {
  const tutorStudents = [
    { id: 1, firstName: "Quincy", lastName: "Ayscue", gradYear: 2027, email: "quayscue@shorecrest.org", phone: "(571)453-1373", tutors: "Ian Simon", lastSession: "12/18/25", nextSession: "—", availableHours: 8.25, scores: { gpa: 4.0 }, latestConversation: "Still meeting occasionally for EF...", notes: "Good progress, consistent" },
    { id: 2, firstName: "Tara", lastName: "Victor", gradYear: 2026, email: "taravictor@gmail.com", phone: "(312)852-2607", tutors: "Ian Simon, Lauren Fogg", lastSession: "01/16/26", nextSession: "03/13/26", availableHours: 3.5, scores: { act: 35, sat: 1460, gpa: 4.6 }, latestConversation: "Excellent test scores", notes: "Top student, focused" },
    { id: 3, firstName: "Meera", lastName: "Kumar", gradYear: 2027, email: "meera.kumar@email.com", phone: "(555)123-4567", tutors: "Ian Simon", lastSession: "02/20/26", nextSession: "03/10/26", availableHours: 15, scores: { sat: 1380, gpa: 3.9 }, latestConversation: "Working on SAT math prep...", notes: "Engaged learner" },
    { id: 4, firstName: "William", lastName: "Chen", gradYear: 2026, email: "wchen@eastlake.edu", phone: "(555)234-5678", tutors: "Lauren Fogg", lastSession: "02/25/26", nextSession: "03/08/26", availableHours: 5, scores: { act: 28, gpa: 3.7 }, latestConversation: "Focusing on ACT science section", notes: "Needs consistent support" },
  ];

  return (
    <div className="p-6">
      <div className="grid gap-4">
        {tutorStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-start gap-4 mb-4 pb-4" style={{ borderBottom: "1px solid #e5e0f0" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: "#8e7bb7", flexShrink: 0 }}>{student.firstName[0]}{student.lastName[0]}</div>
              <div className="flex-1">
                <p className="font-bold" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</p>
                <p className="text-sm" style={{ color: "#b2b2b2" }}>Class of {student.gradYear}</p>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: "#474747" }}><span>{student.email}</span><span>{student.phone}</span></div>
                <p className="text-xs font-medium mt-1" style={{ color: "#55478f" }}>Tutors: {student.tutors}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>LAST SESSION</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.lastSession}</p></div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>NEXT SESSION</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.nextSession}</p></div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>AVAILABLE HOURS</p><p className="text-sm font-bold" style={{ color: "#281d51" }}>{student.availableHours}</p></div>
              <div className="flex flex-wrap gap-2">{student.scores.act && <div className="px-3 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>ACT {student.scores.act}</div>}{student.scores.sat && <div className="px-3 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>SAT {student.scores.sat}</div>}{student.scores.gpa && <div className="px-3 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>GPA {student.scores.gpa}</div>}</div>
            </div>
            <div><p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>LATEST CONVERSATION</p><p className="text-sm mt-1" style={{ color: "#474747" }}>{student.latestConversation}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentDetailPage({ student, onBack }) {
  const [activeTab, setActiveTab] = useState("counselor");

  const conversationLog = [
    { date: "03/01/26", employee: "Lucas Austin", type: "In-Person Meeting", subject: "College List Review", comment: "Discussed safety schools and reach schools. Student interested in engineering programs." },
    { date: "02/25/26", employee: "Chris Bench", type: "Essay Session", subject: "Personal Statement Draft", comment: "Reviewed first draft of common app essay. Excellent narrative voice." },
    { date: "02/15/26", employee: "Ian Simon", type: "Tutoring Session", subject: "ACT Prep - Reading", comment: "Worked on time management strategies for reading section." },
  ];

  const ycbmEvents = [
    { type: "Counselor Meeting", date: "03/15/26", profile: "Lucas Austin", time: "2:00 PM" },
    { type: "Essay Session", date: "03/12/26", profile: "Chris Bench", time: "3:30 PM" },
    { type: "Tutoring Session", date: "03/10/26", profile: "Ian Simon", time: "4:00 PM" },
  ];

  const familyMembers = [
    { name: "Sarah Hart", relationship: "Mother", email: "sarah.hart@email.com", phone: "(555)867-5308" },
    { name: "Michael Hart", relationship: "Father", email: "mhart@email.com", phone: "(555)867-5310" },
  ];

  return (
    <div className="p-6">
      <button onClick={onBack} className="mb-4 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-80" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>← Back to Dashboard</button>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6" style={{ borderTop: "4px solid #55478f" }}>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl" style={{ backgroundColor: "#8e7bb7", flexShrink: 0 }}>{student.firstName[0]}{student.lastName[0]}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold" style={{ color: "#281d51" }}>{student.lastName}, {student.firstName}</h2>
                <p className="text-lg mt-1" style={{ color: "#b2b2b2" }}>{student.highSchool} • {student.state} • Class of {student.gradYear}</p>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <StatBox label="Counselor Hours" value={`${student.counselorHoursUsed}/${student.counselorHoursTotal}`} />
                  <StatBox label="Essay Hours" value={`${student.essayHoursUsed}/${student.essayHoursTotal}`} />
                  <StatBox label="Tutoring Hours" value={`${student.tutorHoursUsed}/${student.tutorHoursTotal}`} />
                  <select className="px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4", color: "#281d51" }}><option>Very Selective</option><option>Selective</option><option>Moderately Selective</option></select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: "#281d51" }}>LOGIN AS STUDENT</button>
              <button className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>SEND PASSWORD RESET</button>
              <button className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>LOG QUICK ADMIN TASK</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Contact Cadence</h3>
            <div className="grid grid-cols-4 gap-4">
              {["Pre-Up to April Jr", "Peak-May to Aug Jr", "Peak-Sep to Dec Jr", "Jan Sr-Grad"].map((period, idx) => (
                <div key={idx}><label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{period}</label><select className="w-full px-3 py-2 border rounded-lg text-sm mt-1" style={{ borderColor: "#c0bad4", color: "#281d51" }}><option>Monthly</option><option>Bi-weekly</option><option>Weekly</option></select></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Basic Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="First Name" value={student.firstName} />
              <InputField label="Last Name" value={student.lastName} />
              <InputField label="Gender" value={student.gender} />
              <InputField label="Email" value={student.email} />
              <InputField label="Secondary Email" value="madelyn.h@school.edu" />
              <InputField label="Mobile Phone" value={student.phone} />
              <InputField label="Home Phone" value="(555)867-5300" />
              <InputField label="Birth Date" value="04/15/08" />
              <InputField label="High School" value={student.highSchool} />
              <InputField label="Year of Graduation" value={student.gradYear} />
              <InputField label="Enrollment Date" value="09/01/24" />
              <InputField label="Country" value="United States" />
              <InputField label="State" value={student.state} />
              <InputField label="City" value="Tampa" />
              <InputField label="Zip Code" value="33602" />
              <InputField label="Address" value="1234 Oak Street" />
              <InputField label="Citizenship" value="U.S. Citizen" />
              <InputField label="Ethnicity" value="Not Hispanic" />
              <InputField label="Race" value="White" />
              <InputField label="ID" value="HC-2026-0847" />
              <InputField label="Major" value={student.major} />
              <InputField label="Account Balance" value="$0.00" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /><span style={{color:"#474747"}}>Active</span></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /><span style={{color:"#474747"}}>Suspended</span></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /><span style={{color:"#474747"}}>Reference</span></label>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>HS Questions</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Favorite HS Subject" value="AP Biology" />
              <InputField label="Why This Major?" value="Fascinated by how the mind works" />
              <InputField label="What Sets You Apart?" value="Founded mental health awareness club" />
              <InputField label="HS Activities" value="Varsity swim, debate team, NHS, mental health club president" />
              <InputField label="Test Prep Experience" value="Completed PrepScholar SAT program" />
              <InputField label="Other Relevant Info" value="Summer research at USF neuroscience lab" />
              <InputField label="Parent Involvement Level" value="High - both parents actively involved" />
              <InputField label="Paid Internships/Jobs" value="Part-time lab assistant at USF" />
              <InputField label="Special Circumstances" value="None" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Financial Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Household Income" value="$120,000-$150,000" />
              <InputField label="Tax Filing Status" value="Married Filing Jointly" />
              <InputField label="Additional Financial Info" value="Two siblings in college" />
            </div>
            <label className="flex items-center gap-2 text-sm mt-3"><input type="checkbox" /><span style={{color:"#474747"}}>First Generation College Student</span></label>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Student Preferences</h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Communication Style" value="Text preferred" />
              <InputField label="Student Personality" value="Driven, curious, collaborative" />
              <InputField label="Risk Tolerance" value="Moderate" />
              <InputField label="Preferred College Setting" value="Suburban/Urban" />
              <InputField label="Geographic Preference" value="Southeast, Northeast" />
              <InputField label="Weather Preference" value="Warm climate preferred" />
              <InputField label="Religious Preference" value="No preference" />
              <InputField label="Greek Life Interest" value="Maybe" />
              <InputField label="ROTC Interest" value="No" />
              <InputField label="Diversity Importance" value="Very important" />
              <InputField label="Campus Visit Plans" value="Visited 4, planning 3 more" />
              <InputField label="Special Needs" value="None" />
              <InputField label="NCAA Eligibility" value="Division III Swimming" />
              <InputField label="Legacy Status" value="No legacy" />
              <InputField label="Desired Outcomes" value="Strong pre-med program with research opportunities" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Student Scores & Grades</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="rounded-lg p-4" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>ACT Composite</label>
                <p className="text-2xl font-bold mt-1" style={{ color: "#281d51" }}>{student.actComposite}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs" style={{ color: "#474747" }}>
                  <span>English: <b>33</b></span><span>Math: <b>31</b></span>
                  <span>Reading: <b>34</b></span><span>Science: <b>30</b></span>
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>SAT Total</label>
                <p className="text-2xl font-bold mt-1" style={{ color: "#281d51" }}>{student.satTotal}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs" style={{ color: "#474747" }}>
                  <span>ERW: <b>720</b></span><span>Math: <b>700</b></span>
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>GPA</label>
                <p className="text-2xl font-bold mt-1" style={{ color: "#281d51" }}>{student.gpaWeighted}W / {student.gpaUnweighted}UW</p>
                <div className="mt-3 text-xs" style={{ color: "#474747" }}>
                  <p className="font-semibold mb-1">{student.apClasses.length} AP Classes:</p>
                  {student.apClasses.map((c, i) => <span key={i} className="inline-block mr-2 mb-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>{c}</span>)}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Program Statuses</h3>
            <div className="flex gap-3 flex-wrap">
              {[{name:"Counseling",status:"active"},{name:"Essay Coaching",status:"active"},{name:"Tutoring",status:"active"},{name:"Test Prep",status:"completed"},{name:"College Research",status:"in-progress"},{name:"Application Review",status:"not-started"},{name:"Scholarship Strategy",status:"in-progress"},{name:"FAFSA Assistance",status:"not-started"}].map((p,i)=>(
                <div key={i} className="px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: p.status==="active"?"#e6fff9":p.status==="completed"?"#f0f9ff":p.status==="in-progress"?"#fff7ed":"#fef2f2", color: p.status==="active"?"#42778c":p.status==="completed"?"#281d51":p.status==="in-progress"?"#92400e":"#dc2626", border: `1px solid ${p.status==="active"?"#00e6c3":p.status==="completed"?"#c0bad4":p.status==="in-progress"?"#fbbf24":"#fca5a5"}` }}>
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.status==="active"?"#00e6c3":p.status==="completed"?"#55478f":p.status==="in-progress"?"#fbbf24":"#ff3467" }}></span>
                  {p.name}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Selected Services</h3>
            <div className="space-y-2">
              {[{name:"Premium Counseling Package",status:"Active",hours:"20 hrs"},{name:"Essay Coaching - Extended",status:"Active",hours:"15 hrs"},{name:"Tutoring - ACT Prep",status:"Completed",hours:"10 hrs"},{name:"College Visit Planning",status:"Active",hours:"—"}].map((s,i)=>(
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #e5e0f0" }}>
                  <div><p className="text-sm font-medium" style={{ color: "#281d51" }}>{s.name}</p></div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs" style={{ color: "#b2b2b2" }}>{s.hours}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: s.status==="Active"?"#e6fff9":"#f0ece8", color: s.status==="Active"?"#42778c":"#55478f" }}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Documents</h3>
            <div className="space-y-2">
              {[{name:"Transcript - Westview Academy.pdf",date:"01/15/26"},{name:"SAT Score Report.pdf",date:"12/01/25"},{name:"Resume_Hart_Madelyn.docx",date:"02/10/26"},{name:"Recommendation_Letter_AP_Bio.pdf",date:"02/20/26"}].map((d,i)=>(
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #e5e0f0" }}>
                  <p className="text-sm font-medium" style={{ color: "#42778c" }}>{d.name}</p>
                  <span className="text-xs" style={{ color: "#b2b2b2" }}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4">
              <button className="flex-1 px-4 py-3 rounded-lg font-medium text-sm" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>View Transaction Log</button>
              <button className="flex-1 px-4 py-3 rounded-lg font-medium text-sm" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>View Login History</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 mb-4" style={{ borderBottom: "2px solid #e5e0f0" }}>
              {["Counselor Notes", "Tutoring Notes", "Essay Notes"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 font-medium text-sm transition-all" style={{ color: activeTab === tab ? "#281d51" : "#b2b2b2", borderBottom: activeTab === tab ? "2px solid #ff3467" : "none", marginBottom: "-2px" }}>{tab}</button>
              ))}
            </div>
            <textarea className="w-full px-4 py-3 border rounded-lg" style={{ borderColor: "#c0bad4", minHeight: "120px" }} placeholder={`Add ${activeTab.toLowerCase()}...`} />
            <button className="mt-3 px-4 py-2 rounded-lg font-medium text-white" style={{ backgroundColor: "#55478f" }}>Save Notes</button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Conversation Log</h3>
            <div className="space-y-3">
              {conversationLog.map((conv, idx) => (
                <div key={idx} className="pb-3" style={{ borderBottom: "1px solid #e5e0f0" }}>
                  <div className="flex justify-between items-start"><div><p className="font-semibold text-sm" style={{ color: "#281d51" }}>{conv.employee} • {conv.type}</p><p className="text-xs" style={{ color: "#b2b2b2" }}>{conv.date} • {conv.subject}</p></div></div>
                  <p className="text-sm mt-2" style={{ color: "#474747" }}>{conv.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Upcoming Sessions</h3>
            <table className="w-full text-sm">
              <tbody>
                {ycbmEvents.map((event, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e0f0" }}>
                    <td className="py-2" style={{ color: "#281d51" }}><p className="font-medium text-xs">{event.type}</p><p style={{ color: "#b2b2b2" }}>{event.profile}</p></td>
                    <td className="py-2 text-right" style={{ color: "#b2b2b2" }}><p className="text-xs">{event.date}</p><p className="font-medium">{event.time}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Add Conversation</h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }}><option>Select Employee</option><option>{student.counselor}</option><option>{student.essayCoach}</option><option>{student.tutor}</option></select>
              <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }} />
              <select className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }}><option>Note Type</option><option>Admin/Communications</option><option>Counselor Session</option><option>Essay Session</option><option>Tutor Session</option></select>
              <select className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }}><option>Hours</option><option>0.25</option><option>0.5</option><option>0.75</option><option>1.0</option><option>1.5</option><option>2.0</option></select>
              <input type="text" placeholder="Subject" className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }} />
              <textarea className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4", minHeight: "80px" }} placeholder="Comment..." />
              <div className="flex items-center gap-2"><input type="checkbox" id="show-to-clients" /><label htmlFor="show-to-clients" className="text-sm" style={{color:"#474747"}}>Show subject and comment to clients</label></div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg font-medium text-white text-sm" style={{ backgroundColor: "#55478f" }}>Save</button>
                <button className="flex-1 px-3 py-2 rounded-lg font-medium text-white text-sm" style={{ backgroundColor: "#ff3467" }}>Save & Notify</button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Team</h3>
            <div className="space-y-3">
              {[{ name: student.counselor, role: "Counselor" }, { name: student.essayCoach, role: "Essay Coach" }, { name: student.tutor, role: "Tutor" }].map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "#8e7bb7" }}>{member.name[0]}</div>
                  <div className="text-sm"><p className="font-medium" style={{ color: "#281d51" }}>{member.name}</p><p style={{ color: "#b2b2b2" }}>{member.role}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#281d51" }}>Family</h3>
            <div className="space-y-4">
              {familyMembers.map((member, idx) => (
                <div key={idx}><p className="font-medium text-sm" style={{ color: "#281d51" }}>{member.name}</p><p className="text-xs" style={{ color: "#b2b2b2" }}>{member.relationship}</p><p className="text-xs mt-1" style={{ color: "#474747" }}>{member.email}</p><p className="text-xs" style={{ color: "#474747" }}>{member.phone}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg p-3" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
      <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{label}</p>
      <p className="text-sm font-bold mt-1" style={{ color: "#281d51" }}>{value}</p>
    </div>
  );
}

function InputField({ label, value }) {
  return (
    <div>
      <label className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{label}</label>
      <input type="text" defaultValue={value} className="w-full px-3 py-2 border rounded-lg text-sm mt-1" style={{ borderColor: "#c0bad4" }} />
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#e5e0f0" }}>
          <svg className="w-8 h-8" fill="none" stroke="#8e7bb7" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#281d51" }}>{title}</h2>
        <p className="text-sm mb-6" style={{ color: "#b2b2b2", maxWidth: 400, margin: "0 auto" }}>{description}</p>
        <span className="px-4 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e5e0f0", color: "#55478f" }}>Coming Soon</span>
      </div>
    </div>
  );
}

function TimeTrackerPage() {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("03/02/26");
  const employees = ["Lucas Austin", "Chris Bench", "Ian Simon", "Lauren Fogg", "Kevin Krebs", "Meg Hall", "David Chen"];
  const timeEntries = [
    { date: "03/02/26", student: "Aguilar Villalobos, Daniela", type: "Counselor Session", hours: 1.0, employee: "Lucas Austin", notes: "College list review" },
    { date: "03/02/26", student: "Hart, Madelyn", type: "Counselor Session", hours: 1.5, employee: "Lucas Austin", notes: "Application strategy" },
    { date: "03/03/26", student: "Kumar, Meera", type: "Counselor Session", hours: 1.0, employee: "Lucas Austin", notes: "Course selection review" },
    { date: "03/03/26", student: "Hart, Madelyn", type: "Essay Session", hours: 1.0, employee: "Chris Bench", notes: "Personal statement draft 2" },
    { date: "03/04/26", student: "Patel, Ananya", type: "Counselor Session", hours: 0.75, employee: "Kevin Krebs", notes: "Scholarship planning" },
    { date: "03/04/26", student: "Chen, William", type: "Tutoring Session", hours: 1.5, employee: "Lauren Fogg", notes: "ACT science prep" },
    { date: "03/05/26", student: "Williams, Jordan", type: "Tutoring Session", hours: 1.0, employee: "Ian Simon", notes: "SAT math review" },
    { date: "03/05/26", student: "Thompson, James", type: "Admin/Communications", hours: 0.25, employee: "Meg Hall", notes: "Decision follow-up email" },
    { date: "03/05/26", student: "Rodriguez, Sofia", type: "Counselor Session", hours: 1.0, employee: "Meg Hall", notes: "FAFSA walkthrough" },
  ];
  const filtered = timeEntries.filter((e) => selectedEmployee === "all" || e.employee === selectedEmployee);
  const totalHours = filtered.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6 items-center">
        <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="px-4 py-2 border rounded-lg" style={{ borderColor: "#c0bad4" }}>
          <option value="all">All Employees</option>
          {employees.map((emp) => <option key={emp} value={emp}>{emp}</option>)}
        </select>
        <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} className="px-4 py-2 border rounded-lg" style={{ borderColor: "#c0bad4" }}>
          <option value="03/02/26">Week of 03/02/26</option>
          <option value="02/23/26">Week of 02/23/26</option>
          <option value="02/16/26">Week of 02/16/26</option>
        </select>
        <div className="ml-auto rounded-lg px-5 py-3" style={{ backgroundColor: "#e5e0f0" }}>
          <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>TOTAL HOURS</p>
          <p className="text-xl font-bold" style={{ color: "#281d51" }}>{totalHours.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#f0ece8" }}>
              <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Date</th>
              <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Student</th>
              <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Type</th>
              <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Employee</th>
              <th className="p-4 text-right text-xs font-semibold" style={{ color: "#281d51" }}>Hours</th>
              <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50" style={{ borderBottom: "1px solid #e5e0f0" }}>
                <td className="p-4 text-sm" style={{ color: "#474747" }}>{entry.date}</td>
                <td className="p-4 text-sm font-medium" style={{ color: "#281d51" }}>{entry.student}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: entry.type === "Counselor Session" ? "#e5e0f0" : entry.type === "Essay Session" ? "#e6fff9" : entry.type === "Tutoring Session" ? "#fff7ed" : "#f0f9ff", color: entry.type === "Counselor Session" ? "#55478f" : entry.type === "Essay Session" ? "#42778c" : entry.type === "Tutoring Session" ? "#92400e" : "#281d51" }}>{entry.type}</span></td>
                <td className="p-4 text-sm" style={{ color: "#474747" }}>{entry.employee}</td>
                <td className="p-4 text-sm text-right font-bold" style={{ color: "#281d51" }}>{entry.hours.toFixed(2)}</td>
                <td className="p-4 text-sm" style={{ color: "#b2b2b2" }}>{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsPage() {
  const [activeReport, setActiveReport] = useState("decisions");
  const reportTabs = [
    { id: "decisions", label: "College Decisions" },
    { id: "hours", label: "Hours" },
    { id: "scores", label: "Student Scores" },
    { id: "evidence", label: "Evidence (BI)" },
  ];

  const decisionData = [
    { student: "Thompson, James", college: "University of Michigan", status: "Accepted", type: "Early Action", date: "02/15/26" },
    { student: "Thompson, James", college: "Northwestern University", status: "Waitlisted", type: "Regular Decision", date: "03/01/26" },
    { student: "Hart, Madelyn", college: "University of Florida", status: "Accepted", type: "Early Action", date: "01/20/26" },
    { student: "Hart, Madelyn", college: "Emory University", status: "Pending", type: "Regular Decision", date: "—" },
    { student: "Patel, Ananya", college: "Johns Hopkins", status: "Accepted", type: "Early Decision", date: "12/15/25" },
    { student: "Chen, William", college: "University of Washington", status: "Accepted", type: "Regular Decision", date: "02/28/26" },
  ];

  return (
    <div className="p-6">
      <div className="flex gap-1 mb-6 pb-4" style={{ borderBottom: "1px solid #e5e0f0" }}>
        {reportTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveReport(tab.id)} className="px-5 py-2 rounded-lg text-sm font-semibold transition-all" style={{ backgroundColor: activeReport === tab.id ? "#55478f" : "transparent", color: activeReport === tab.id ? "white" : "#b2b2b2" }}>{tab.label}</button>
        ))}
      </div>
      {activeReport === "decisions" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f0ece8" }}>
                <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Student</th>
                <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>College</th>
                <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Status</th>
                <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Type</th>
                <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {decisionData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50" style={{ borderBottom: "1px solid #e5e0f0" }}>
                  <td className="p-4 text-sm font-medium" style={{ color: "#281d51" }}>{row.student}</td>
                  <td className="p-4 text-sm" style={{ color: "#474747" }}>{row.college}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: row.status === "Accepted" ? "#e6fff9" : row.status === "Waitlisted" ? "#fff7ed" : row.status === "Pending" ? "#e5e0f0" : "#fef2f2", color: row.status === "Accepted" ? "#42778c" : row.status === "Waitlisted" ? "#92400e" : row.status === "Pending" ? "#55478f" : "#dc2626" }}>{row.status}</span></td>
                  <td className="p-4 text-sm" style={{ color: "#474747" }}>{row.type}</td>
                  <td className="p-4 text-sm" style={{ color: "#b2b2b2" }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeReport === "hours" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[{ label: "Total Counselor Hours", value: "127.5", max: "180" }, { label: "Total Essay Hours", value: "89.0", max: "140" }, { label: "Total Tutoring Hours", value: "53.0", max: "120" }, { label: "Total Admin Hours", value: "34.25", max: "—" }].map((stat, idx) => (
              <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: "#f0ece8", border: "1px solid #e5e0f0" }}>
                <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>{stat.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "#281d51" }}>{stat.value}<span className="text-sm font-normal" style={{ color: "#b2b2b2" }}>/{stat.max}</span></p>
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "#b2b2b2" }}>Detailed hours breakdown by employee and student available for export.</p>
        </div>
      )}
      {activeReport === "scores" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#f0ece8" }}>
                <th className="p-4 text-left text-xs font-semibold" style={{ color: "#281d51" }}>Student</th>
                <th className="p-4 text-center text-xs font-semibold" style={{ color: "#281d51" }}>GPA (W)</th>
                <th className="p-4 text-center text-xs font-semibold" style={{ color: "#281d51" }}>GPA (UW)</th>
                <th className="p-4 text-center text-xs font-semibold" style={{ color: "#281d51" }}>ACT</th>
                <th className="p-4 text-center text-xs font-semibold" style={{ color: "#281d51" }}>SAT</th>
                <th className="p-4 text-center text-xs font-semibold" style={{ color: "#281d51" }}>AP Classes</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_STUDENTS.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50" style={{ borderBottom: "1px solid #e5e0f0" }}>
                  <td className="p-4 text-sm font-medium" style={{ color: "#281d51" }}>{s.lastName}, {s.firstName}</td>
                  <td className="p-4 text-sm text-center font-bold" style={{ color: "#281d51" }}>{s.gpaWeighted}</td>
                  <td className="p-4 text-sm text-center" style={{ color: "#474747" }}>{s.gpaUnweighted}</td>
                  <td className="p-4 text-sm text-center" style={{ color: "#474747" }}>{s.actComposite}</td>
                  <td className="p-4 text-sm text-center" style={{ color: "#474747" }}>{s.satTotal}</td>
                  <td className="p-4 text-sm text-center" style={{ color: "#474747" }}>{s.apClasses.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeReport === "evidence" && (
        <PlaceholderPage title="Evidence (BI Dashboard)" description="Business intelligence dashboard with enrollment trends, outcome metrics, and program effectiveness data." />
      )}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {[
          { title: "Students", description: "Manage student accounts, bulk import, and deactivation.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          { title: "Employees", description: "Employee accounts, roles, permissions, and caseload assignments.", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
          { title: "Emails", description: "Email templates, notification rules, and communication preferences.", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { title: "Portal Settings", description: "System configuration, branding, feature toggles, and integrations.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
        ].map((card, idx) => (
          <button key={idx} className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e5e0f0" }}>
                <svg className="w-5 h-5" fill="none" stroke="#55478f" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={card.icon} /></svg>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "#281d51" }}>{card.title}</h3>
            </div>
            <p className="text-sm" style={{ color: "#b2b2b2" }}>{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
