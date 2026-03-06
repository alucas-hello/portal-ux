import { useState } from "react";
import { StudentAvatar } from "./Avatars";
import { STATUS_COLORS, STATUS_LABELS } from "../data/constants";
import { TASK_MILESTONES, WORKSHOPS } from "../data/milestones";
import { getStaffPhoto, photoToName } from "../utils/staff";

function TaskMilestoneModal({ modal, onClose }) {
  const { student, items, activeIndex, type } = modal;
  const [openIndices, setOpenIndices] = useState(new Set([activeIndex]));

  const toggleIndex = (idx) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Dynamic fields per milestone — all 20 tasks and 15 workshops
  const MILESTONE_FIELDS = {
    // === TASK MILESTONES ===
    "Complete YouScience & Assessment": {
      title: "YouScience Assessment",
      description: "Track completion of the YouScience aptitude and interest assessment, and record results.",
      fields: [
        { id: "assessmentDate", label: "Assessment Date", type: "date" },
        { id: "assessmentStatus", label: "Completion Status", type: "select", options: ["Not Started", "Link Sent", "In Progress", "Completed", "Needs Retake"] },
        { id: "topAptitudes", label: "Top Aptitudes (from YouScience)", type: "text", placeholder: "e.g., Spatial Reasoning, Numerical Computation" },
        { id: "topCareers", label: "Top Career Matches", type: "text", placeholder: "e.g., Biomedical Engineer, Data Scientist" },
        { id: "interestAreas", label: "Interest Areas", type: "text", placeholder: "e.g., STEM, Healthcare, Business" },
        { id: "studentReaction", label: "Student Reaction", type: "select", options: ["Very Aligned", "Somewhat Aligned", "Surprised", "Disagrees", "Needs Discussion"] },
        { id: "counselorNotes", label: "Counselor Notes", type: "textarea", placeholder: "Notes on assessment results, alignment with stated interests, next steps..." },
      ],
    },
    "Review S.A.F.E College Preferences": {
      title: "S.A.F.E. College Preferences",
      description: "Review the student's Size, Affordability, Fit, and Environment preferences to guide college list development.",
      fields: [
        { id: "sizePreference", label: "Size Preference", type: "select", options: ["Small (<5,000)", "Medium (5,000–15,000)", "Large (15,000–30,000)", "Very Large (30,000+)", "No Preference"] },
        { id: "affordability", label: "Affordability Target", type: "select", options: ["Under $15K/yr", "$15K–$30K/yr", "$30K–$50K/yr", "No Budget Constraint", "Need Full Scholarship"] },
        { id: "efc", label: "Estimated Family Contribution (EFC)", type: "text", placeholder: "$0 – $99,999" },
        { id: "fitAcademic", label: "Academic Fit — Selectivity", type: "select", options: ["Most Selective (Ivy+)", "Highly Selective", "Very Selective", "Selective", "Moderately Selective", "Open Admission"] },
        { id: "fitMajor", label: "Desired Major / Program", type: "text", placeholder: "e.g., Computer Science, Pre-Med, Business" },
        { id: "fitExtracurriculars", label: "Must-Have Activities / Clubs", type: "text", placeholder: "e.g., D3 Swimming, Greek Life, Research Labs" },
        { id: "environmentSetting", label: "Environment — Setting", type: "select", options: ["Urban", "Suburban", "College Town", "Rural", "No Preference"] },
        { id: "environmentRegion", label: "Geographic Region", type: "text", placeholder: "e.g., Southeast, Northeast, West Coast" },
        { id: "environmentWeather", label: "Weather Preference", type: "select", options: ["Warm Year-Round", "Four Seasons", "Mild Winters", "No Preference"] },
        { id: "environmentDiversity", label: "Diversity Importance", type: "select", options: ["Very Important", "Somewhat Important", "Not a Factor"] },
        { id: "religiousAffiliation", label: "Religious Affiliation", type: "select", options: ["No Preference", "Catholic", "Christian (Non-Denom)", "Jewish", "Other", "Secular Only"] },
        { id: "safeNotes", label: "Counselor Notes", type: "textarea", placeholder: "Notes on preference patterns, conflicts between student and parent preferences, red flags..." },
      ],
    },
    "Create College Research Plan": {
      title: "College Research Plan",
      description: "Establish a structured plan for researching and evaluating potential colleges.",
      fields: [
        { id: "researchStartDate", label: "Research Start Date", type: "date" },
        { id: "targetSchoolCount", label: "Target # of Schools to Research", type: "select", options: ["5–10", "10–15", "15–20", "20+"] },
        { id: "researchMethod", label: "Primary Research Method", type: "select", options: ["Campus Visits", "Virtual Tours", "College Fairs", "Online Research", "Combination"] },
        { id: "campusVisitsPlanned", label: "Campus Visits Planned", type: "text", placeholder: "e.g., 3 spring, 2 summer" },
        { id: "virtualToursCompleted", label: "Virtual Tours Completed", type: "text", placeholder: "List schools toured virtually" },
        { id: "collegeFairsAttended", label: "College Fairs Attended", type: "text", placeholder: "List fairs and dates" },
        { id: "researchDeadline", label: "Research Completion Deadline", type: "date" },
        { id: "researchNotes", label: "Notes", type: "textarea", placeholder: "Key findings, standout schools, and next steps..." },
      ],
    },
    "Review High School Course Selection": {
      title: "High School Course Selection",
      description: "Review current and planned coursework to ensure alignment with college admissions expectations.",
      fields: [
        { id: "currentCourseload", label: "Current Course Load", type: "text", placeholder: "e.g., 6 courses, 3 AP" },
        { id: "gpaWeighted", label: "Weighted GPA", type: "text", placeholder: "e.g., 4.05" },
        { id: "gpaUnweighted", label: "Unweighted GPA", type: "text", placeholder: "e.g., 3.72" },
        { id: "apIbCourses", label: "AP/IB Courses Taken", type: "textarea", placeholder: "List all AP/IB courses completed or in progress" },
        { id: "plannedCourses", label: "Planned Senior Year Courses", type: "textarea", placeholder: "List planned courses for remaining semesters" },
        { id: "rigorAssessment", label: "Course Rigor Assessment", type: "select", options: ["Most Demanding Available", "Very Demanding", "Demanding", "Average", "Below Average"] },
        { id: "classRank", label: "Class Rank (if available)", type: "text", placeholder: "e.g., 15/450 or Top 5%" },
        { id: "courseNotes", label: "Notes", type: "textarea", placeholder: "Recommendations for schedule changes, summer courses, etc." },
      ],
    },
    "Develop Test Prep Strategy": {
      title: "Test Prep Strategy",
      description: "Establish a standardized testing plan including test selection, prep resources, and target scores.",
      fields: [
        { id: "primaryTest", label: "Primary Test", type: "select", options: ["ACT", "SAT", "Both", "Test Optional", "Undecided"] },
        { id: "diagnosticActScore", label: "Diagnostic ACT Score", type: "text", placeholder: "e.g., 28" },
        { id: "diagnosticSatScore", label: "Diagnostic SAT Score", type: "text", placeholder: "e.g., 1280" },
        { id: "targetActScore", label: "Target ACT Score", type: "text", placeholder: "e.g., 32+" },
        { id: "targetSatScore", label: "Target SAT Score", type: "text", placeholder: "e.g., 1400+" },
        { id: "prepMethod", label: "Prep Method", type: "select", options: ["HC Tutoring", "Self-Study", "External Course", "Private Tutor", "Combination"] },
        { id: "testDates", label: "Planned Test Dates", type: "text", placeholder: "e.g., June 2026 ACT, Oct 2026 SAT" },
        { id: "weakAreas", label: "Weak Areas to Target", type: "text", placeholder: "e.g., ACT Science, SAT Math" },
        { id: "testPrepNotes", label: "Notes", type: "textarea", placeholder: "Prep schedule, resource recommendations, score improvement tracking..." },
      ],
    },
    "Private Budget Meeting": {
      title: "Private Budget Meeting",
      description: "Confidential meeting with family to discuss college affordability, EFC, and financial aid expectations.",
      fields: [
        { id: "meetingDate", label: "Meeting Date", type: "date" },
        { id: "meetingAttendees", label: "Attendees", type: "text", placeholder: "e.g., Student, Both Parents" },
        { id: "householdIncome", label: "Household Gross Annual Income", type: "select", options: ["Under $50K", "$50K–$100K", "$100K–$150K", "$150K–$200K", "$200K–$300K", "$300K+", "Prefer Not to Say"] },
        { id: "efc", label: "Federal Student Aid Estimate (SAI)", type: "text", placeholder: "$0 – $99,999" },
        { id: "collegeSavings", label: "Total College Savings (529, etc.)", type: "text", placeholder: "$0 – $250,000+" },
        { id: "outOfPocket", label: "Max Willingness to Pay / Year", type: "text", placeholder: "e.g., $25,000/year" },
        { id: "consideringLoans", label: "Open to Student Loans?", type: "select", options: ["Yes", "No", "Only Federal", "Undecided"] },
        { id: "needBasedAid", label: "Expect Need-Based Aid?", type: "select", options: ["Yes — Significant", "Yes — Some", "Unlikely", "Unknown"] },
        { id: "meritScholarships", label: "Merit Scholarship Target", type: "text", placeholder: "e.g., $10K+/year or Full Tuition" },
        { id: "comfortLevel", label: "Family Comfort Discussing Finances", type: "select", options: ["Very Comfortable", "Somewhat Comfortable", "Uncomfortable", "Prefer Written Only"] },
        { id: "budgetNotes", label: "Notes", type: "textarea", placeholder: "Key takeaways, parent vs. student expectations, red flags..." },
      ],
    },
    "Develop Preliminary College List": {
      title: "Preliminary College List",
      description: "Build the initial college list with reach, match, and safety schools based on S.A.F.E. preferences and academic profile.",
      fields: [
        { id: "reachSchools", label: "Reach Schools", type: "textarea", placeholder: "List reach schools (acceptance rate significantly below student profile)" },
        { id: "matchSchools", label: "Match Schools", type: "textarea", placeholder: "List match/target schools (good chance of admission)" },
        { id: "safetySchools", label: "Safety Schools", type: "textarea", placeholder: "List safety schools (high probability of admission + affordability)" },
        { id: "totalSchoolCount", label: "Total Schools on List", type: "text", placeholder: "e.g., 12" },
        { id: "listBalance", label: "List Balance", type: "select", options: ["Well Balanced", "Too Many Reaches", "Too Few Safeties", "Needs More Options", "Too Large"] },
        { id: "parentFeedback", label: "Parent Feedback on List", type: "select", options: ["Fully Aligned", "Mostly Aligned", "Some Disagreement", "Major Disagreement"] },
        { id: "listNotes", label: "Notes", type: "textarea", placeholder: "Rationale for selections, schools to revisit, schools removed and why..." },
      ],
    },
    "Establish Recommendation Letter Strategy": {
      title: "Recommendation Letter Strategy",
      description: "Plan who will write recommendation letters, timelines, and communication strategy.",
      fields: [
        { id: "counselorRec", label: "School Counselor Rec", type: "select", options: ["Confirmed", "Requested", "Not Yet Requested", "N/A"] },
        { id: "teacherRec1", label: "Teacher Rec #1", type: "text", placeholder: "Teacher name, subject (e.g., Ms. Johnson, AP Chemistry)" },
        { id: "teacherRec1Status", label: "Teacher Rec #1 Status", type: "select", options: ["Confirmed", "Requested", "Not Yet Requested"] },
        { id: "teacherRec2", label: "Teacher Rec #2", type: "text", placeholder: "Teacher name, subject" },
        { id: "teacherRec2Status", label: "Teacher Rec #2 Status", type: "select", options: ["Confirmed", "Requested", "Not Yet Requested"] },
        { id: "additionalRec", label: "Additional Recommender", type: "text", placeholder: "e.g., Coach, Employer, Mentor" },
        { id: "requestDeadline", label: "Request Deadline", type: "date" },
        { id: "braggSheet", label: "Brag Sheet / Resume Provided?", type: "select", options: ["Yes", "No", "In Progress"] },
        { id: "recNotes", label: "Notes", type: "textarea", placeholder: "Notes on recommender selection, talking points shared, follow-up reminders..." },
      ],
    },
    "Develop Resume": {
      title: "Resume / Activities List",
      description: "Build and refine the student's activities resume for college applications.",
      fields: [
        { id: "resumeStatus", label: "Resume Status", type: "select", options: ["Not Started", "Draft", "In Review", "Finalized"] },
        { id: "extracurriculars", label: "Key Extracurriculars", type: "textarea", placeholder: "List top activities with roles and time commitment" },
        { id: "leadershipRoles", label: "Leadership Roles", type: "textarea", placeholder: "Club president, team captain, etc." },
        { id: "communityService", label: "Community Service / Volunteering", type: "textarea", placeholder: "Organizations, hours, impact" },
        { id: "workExperience", label: "Work Experience", type: "textarea", placeholder: "Jobs, internships, entrepreneurial work" },
        { id: "honors", label: "Honors & Awards", type: "textarea", placeholder: "Academic, athletic, or extracurricular awards" },
        { id: "summerPrograms", label: "Summer Programs / Camps", type: "text", placeholder: "e.g., STEM camp, study abroad, research" },
        { id: "resumeNotes", label: "Notes", type: "textarea", placeholder: "Areas to strengthen, missing categories, narrative themes..." },
      ],
    },
    "Define Scholarship Plan": {
      title: "Scholarship Plan",
      description: "Identify and track external and institutional scholarship opportunities.",
      fields: [
        { id: "scholarshipGoal", label: "Total Scholarship Goal", type: "text", placeholder: "e.g., $20,000+/year" },
        { id: "meritScholarships", label: "Merit Scholarship Targets", type: "textarea", placeholder: "List institutional merit scholarships being targeted" },
        { id: "externalScholarships", label: "External Scholarships Applied", type: "textarea", placeholder: "Scholarship name, deadline, amount" },
        { id: "essaysRequired", label: "Scholarship Essays Required", type: "text", placeholder: "e.g., 5 essays across 3 scholarships" },
        { id: "applicationDeadlines", label: "Key Deadlines", type: "text", placeholder: "e.g., Nov 1 — XYZ Foundation, Dec 15 — State Merit" },
        { id: "fafsa", label: "FAFSA Status", type: "select", options: ["Not Started", "In Progress", "Submitted", "Verified", "N/A"] },
        { id: "cssProfile", label: "CSS Profile Status", type: "select", options: ["Not Started", "In Progress", "Submitted", "N/A"] },
        { id: "scholarshipNotes", label: "Notes", type: "textarea", placeholder: "Strategy notes, eligibility concerns, family action items..." },
      ],
    },
    "Refine College List": {
      title: "Refine College List",
      description: "Narrow and finalize the college list after campus visits, research, and family discussions.",
      fields: [
        { id: "schoolsAdded", label: "Schools Added Since Preliminary", type: "textarea", placeholder: "New schools and why they were added" },
        { id: "schoolsRemoved", label: "Schools Removed", type: "textarea", placeholder: "Schools removed and rationale" },
        { id: "finalReachCount", label: "Final Reach Schools", type: "text", placeholder: "e.g., 4" },
        { id: "finalMatchCount", label: "Final Match Schools", type: "text", placeholder: "e.g., 5" },
        { id: "finalSafetyCount", label: "Final Safety Schools", type: "text", placeholder: "e.g., 3" },
        { id: "earlyDecision", label: "Early Decision School", type: "text", placeholder: "School name (if applicable)" },
        { id: "earlyAction", label: "Early Action Schools", type: "text", placeholder: "List EA schools" },
        { id: "refineNotes", label: "Notes", type: "textarea", placeholder: "Final rationale, student/parent alignment, outstanding concerns..." },
      ],
    },
    "Common App Personal Statement Topic Identified": {
      title: "Personal Statement Topic",
      description: "Brainstorm and select the Common App personal statement essay topic.",
      fields: [
        { id: "promptSelected", label: "Common App Prompt", type: "select", options: ["Prompt 1 — Background/Identity", "Prompt 2 — Setback/Failure", "Prompt 3 — Challenged a Belief", "Prompt 4 — Gratitude", "Prompt 5 — Personal Growth", "Prompt 6 — Topic of Fascination", "Prompt 7 — Topic of Choice"] },
        { id: "topicSummary", label: "Topic Summary", type: "text", placeholder: "One-sentence description of the topic/angle" },
        { id: "brainstormTopics", label: "Other Topics Considered", type: "textarea", placeholder: "List of brainstormed alternatives and why they were set aside" },
        { id: "narrativeStrength", label: "Narrative Strength", type: "select", options: ["Very Strong — Unique Story", "Strong — Good Angle", "Moderate — Needs Development", "Weak — Consider Alternatives"] },
        { id: "topicApproved", label: "Topic Approved by Counselor?", type: "select", options: ["Yes", "No — Needs Revision", "Pending Review"] },
        { id: "topicNotes", label: "Notes", type: "textarea", placeholder: "Coaching notes, angles to emphasize, things to avoid..." },
      ],
    },
    "Supplemental Essay Strategy": {
      title: "Supplemental Essay Strategy",
      description: "Plan the approach for school-specific supplemental essays.",
      fields: [
        { id: "totalSupplementals", label: "Total Supplemental Essays Required", type: "text", placeholder: "e.g., 18 across 12 schools" },
        { id: "reusableEssays", label: "Reusable / Overlapping Prompts", type: "textarea", placeholder: "Identify prompts that can share content (e.g., Why Major, Community, Diversity)" },
        { id: "priorityEssays", label: "Priority Essays (ED/EA schools)", type: "textarea", placeholder: "List essays due first with deadlines" },
        { id: "whyUsStrategy", label: "'Why Us' Essay Approach", type: "textarea", placeholder: "Key themes: specific programs, professors, campus culture" },
        { id: "essayTimeline", label: "Essay Completion Timeline", type: "text", placeholder: "e.g., 4 by Oct 1, 8 by Nov 1, all by Dec 15" },
        { id: "supplementalNotes", label: "Notes", type: "textarea", placeholder: "Schools with unique prompts, tone adjustments per school..." },
      ],
    },
    "Complete My Common App Personal Statement": {
      title: "Common App Personal Statement",
      description: "Track the drafting, revision, and finalization of the 650-word personal statement.",
      fields: [
        { id: "draftCount", label: "Current Draft #", type: "select", options: ["No Draft", "Draft 1", "Draft 2", "Draft 3", "Draft 4+", "Final"] },
        { id: "wordCount", label: "Current Word Count", type: "text", placeholder: "e.g., 620 / 650" },
        { id: "lastReviewDate", label: "Last Review Date", type: "date" },
        { id: "reviewedBy", label: "Reviewed By", type: "text", placeholder: "e.g., Taylor Reed (Essay Coach)" },
        { id: "essayStrengths", label: "Strengths", type: "textarea", placeholder: "What's working well in the current draft" },
        { id: "areasToImprove", label: "Areas to Improve", type: "textarea", placeholder: "Specific feedback for next revision" },
        { id: "finalApproval", label: "Final Approval", type: "select", options: ["Not Ready", "Ready for Final Review", "Approved — Ready to Submit"] },
        { id: "personalStatementNotes", label: "Notes", type: "textarea", placeholder: "Revision history, student receptiveness to feedback, timeline concerns..." },
      ],
    },
    "Set Application Strategy": {
      title: "Application Strategy",
      description: "Finalize the application strategy including decision types, deadlines, and submission plan.",
      fields: [
        { id: "edSchool", label: "Early Decision (ED) School", type: "text", placeholder: "School name" },
        { id: "edDeadline", label: "ED Deadline", type: "date" },
        { id: "eaSchools", label: "Early Action (EA) Schools", type: "textarea", placeholder: "List EA schools and deadlines" },
        { id: "rdSchools", label: "Regular Decision (RD) Schools", type: "textarea", placeholder: "List RD schools and deadlines" },
        { id: "rollingSchools", label: "Rolling Admission Schools", type: "text", placeholder: "List schools with rolling deadlines" },
        { id: "applicationPlatforms", label: "Application Platforms", type: "select", options: ["Common App Only", "Common App + Coalition", "Common App + School-Specific", "Multiple Platforms"] },
        { id: "feeWaivers", label: "Fee Waivers Needed?", type: "select", options: ["Yes — All Schools", "Yes — Some Schools", "No", "Applied For"] },
        { id: "strategyNotes", label: "Notes", type: "textarea", placeholder: "Submission order priority, last-minute changes, parent alignment..." },
      ],
    },
    "1-1 Application Review": {
      title: "1-on-1 Application Review",
      description: "Individual review of each application for completeness, accuracy, and presentation.",
      fields: [
        { id: "reviewDate", label: "Review Session Date", type: "date" },
        { id: "schoolsReviewed", label: "Schools Reviewed", type: "textarea", placeholder: "List each school reviewed in this session" },
        { id: "commonAppComplete", label: "Common App Sections Complete?", type: "select", options: ["Yes — All Sections", "Nearly Complete", "Missing Key Sections", "Not Started"] },
        { id: "activitySection", label: "Activities Section", type: "select", options: ["Finalized", "Needs Edits", "In Progress", "Not Started"] },
        { id: "additionalInfo", label: "Additional Info Section Used?", type: "select", options: ["Yes — Submitted", "Yes — In Draft", "No — Not Needed"] },
        { id: "schoolSpecificItems", label: "School-Specific Requirements", type: "textarea", placeholder: "Portfolios, audition tapes, research abstracts, etc." },
        { id: "submissionReady", label: "Ready to Submit?", type: "select", options: ["Yes — Submit Now", "Almost — Minor Edits", "No — Significant Work Needed"] },
        { id: "reviewNotes", label: "Notes", type: "textarea", placeholder: "Errors found, sections to strengthen, submission timing..." },
      ],
    },
    "All Essays Reviewed": {
      title: "All Essays Reviewed",
      description: "Final review checkpoint ensuring all personal and supplemental essays are complete.",
      fields: [
        { id: "personalStatementFinal", label: "Personal Statement Status", type: "select", options: ["Final — Approved", "Final Draft — Pending Approval", "Still In Revision"] },
        { id: "supplementalsDone", label: "Supplementals Completed", type: "text", placeholder: "e.g., 16/18 complete" },
        { id: "supplementalsPending", label: "Supplementals Still Pending", type: "textarea", placeholder: "List school + prompt for incomplete essays" },
        { id: "essayCoachSignoff", label: "Essay Coach Sign-Off", type: "select", options: ["All Approved", "Most Approved", "Several Need Work", "Not Reviewed"] },
        { id: "proofreadComplete", label: "Proofreading Complete?", type: "select", options: ["Yes — All Essays", "Partially", "Not Yet"] },
        { id: "essayReviewNotes", label: "Notes", type: "textarea", placeholder: "Outstanding issues, quality assessment, last-minute changes..." },
      ],
    },
    "Mock College Interview Meeting": {
      title: "Mock College Interview",
      description: "Conduct a practice interview to prepare the student for alumni or admissions interviews.",
      fields: [
        { id: "mockDate", label: "Mock Interview Date", type: "date" },
        { id: "interviewSchools", label: "Schools With Interviews", type: "text", placeholder: "e.g., Georgetown, Duke, Emory" },
        { id: "interviewFormat", label: "Format Practiced", type: "select", options: ["In-Person", "Video Call", "Phone", "Group"] },
        { id: "strengthAreas", label: "Strong Areas", type: "textarea", placeholder: "e.g., Enthusiasm, specific examples, articulate" },
        { id: "improvementAreas", label: "Areas for Improvement", type: "textarea", placeholder: "e.g., Eye contact, 'Why Us' answer, conciseness" },
        { id: "questionsToPrep", label: "Questions to Practice", type: "textarea", placeholder: "Specific questions the student struggled with" },
        { id: "confidenceLevel", label: "Student Confidence Level", type: "select", options: ["Very Confident", "Somewhat Confident", "Nervous", "Very Anxious", "Needs More Practice"] },
        { id: "mockNotes", label: "Notes", type: "textarea", placeholder: "Overall impression, coaching tips, scheduled real interviews..." },
      ],
    },
    "Award Assessment & Decision Meeting": {
      title: "Award Assessment & Decision",
      description: "Review all admission decisions, financial aid packages, and guide the student toward a final enrollment decision.",
      fields: [
        { id: "totalAcceptances", label: "Total Acceptances", type: "text", placeholder: "e.g., 8 of 12" },
        { id: "totalDenials", label: "Denials", type: "text", placeholder: "e.g., 2" },
        { id: "waitlisted", label: "Waitlisted", type: "text", placeholder: "e.g., 2 — pursuing 1" },
        { id: "topChoice", label: "Student's Top Choice", type: "text", placeholder: "School name" },
        { id: "bestAidPackage", label: "Best Financial Aid Package", type: "text", placeholder: "School — $XX,XXX/year" },
        { id: "netCostComparison", label: "Net Cost Comparison", type: "textarea", placeholder: "School 1: $XX,XXX\nSchool 2: $XX,XXX\nSchool 3: $XX,XXX" },
        { id: "appealFiled", label: "Aid Appeal Filed?", type: "select", options: ["Yes", "No", "In Progress", "N/A"] },
        { id: "depositDeadline", label: "Deposit Deadline", type: "date" },
        { id: "finalDecision", label: "Final Decision", type: "text", placeholder: "School name (once committed)" },
        { id: "decisionNotes", label: "Notes", type: "textarea", placeholder: "Decision factors, family discussions, appeal results, next steps..." },
      ],
    },
    "Additional Milestone": {
      title: "Additional Milestone",
      description: "Custom milestone for tracking additional tasks specific to this student.",
      fields: [
        { id: "milestoneName", label: "Custom Milestone Name", type: "text", placeholder: "Describe this milestone" },
        { id: "milestoneStatus", label: "Status", type: "select", options: ["Not Started", "In Progress", "Completed", "Opted Out"] },
        { id: "milestoneDate", label: "Target Date", type: "date" },
        { id: "milestoneNotes", label: "Notes", type: "textarea", placeholder: "Details, action items, follow-up..." },
      ],
    },
    // === WORKSHOP MILESTONES ===
    "Major and Career Exploration Workshop": {
      title: "Major & Career Exploration",
      description: "Workshop introducing students to major/career pathways using YouScience results and interest inventories.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "topMajors", label: "Top 3 Majors of Interest", type: "text", placeholder: "e.g., Biology, Psychology, Public Health" },
        { id: "careerPaths", label: "Career Paths Explored", type: "text", placeholder: "e.g., Healthcare, Research, Education" },
        { id: "nextSteps", label: "Follow-Up Action Items", type: "textarea", placeholder: "Additional research, informational interviews, etc." },
      ],
    },
    "Stand Out Factor Workshop": {
      title: "Stand Out Factor Workshop",
      description: "Identifying what makes the student unique and how to articulate their personal brand.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "standOutFactor", label: "Identified Stand Out Factor", type: "text", placeholder: "e.g., Bilingual community organizer, competitive robotics" },
        { id: "personalBrand", label: "Personal Brand / Theme", type: "text", placeholder: "e.g., Bridge-builder between cultures" },
        { id: "actionItems", label: "Action Items to Strengthen Brand", type: "textarea", placeholder: "Activities to start, stories to develop, etc." },
      ],
    },
    "College Admissions 101 Workshop": {
      title: "College Admissions 101",
      description: "Overview of the college admissions process, timeline, and key terminology.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "parentAttended", label: "Parent/Guardian Attended?", type: "select", options: ["Yes", "No"] },
        { id: "keyTakeaways", label: "Key Takeaways", type: "textarea", placeholder: "What the student found most helpful" },
        { id: "questionsRaised", label: "Questions Raised", type: "textarea", placeholder: "Unanswered questions for follow-up" },
      ],
    },
    "Mastering Academic Success Workshop": {
      title: "Mastering Academic Success",
      description: "Study skills, time management, and GPA improvement strategies.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "currentGpa", label: "Current GPA at Workshop", type: "text", placeholder: "e.g., 3.72" },
        { id: "targetGpa", label: "Target GPA", type: "text", placeholder: "e.g., 3.9+" },
        { id: "studyStrategies", label: "Strategies Adopted", type: "textarea", placeholder: "Time blocking, Pomodoro, active recall, etc." },
        { id: "challengeCourses", label: "Courses Needing Support", type: "text", placeholder: "e.g., AP Chemistry, Pre-Calc" },
      ],
    },
    "Standing Out as an Underclassman Workshop": {
      title: "Standing Out as an Underclassman",
      description: "Guidance for 9th–10th graders on building a strong foundation for college admissions.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "activitiesToStart", label: "Activities to Start", type: "textarea", placeholder: "Clubs, volunteering, leadership opportunities" },
        { id: "summerPlans", label: "Summer Plans Discussed", type: "text", placeholder: "Programs, internships, camps" },
        { id: "goalsSetting", label: "Goals Set", type: "textarea", placeholder: "Academic and extracurricular goals for the year" },
      ],
    },
    "Paying for College Workshop": {
      title: "Paying for College",
      description: "Financial aid overview including FAFSA, CSS Profile, scholarships, and affordability strategies.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "parentAttended", label: "Parent/Guardian Attended?", type: "select", options: ["Yes", "No"] },
        { id: "fafsaAwareness", label: "FAFSA Understanding", type: "select", options: ["Clear", "Some Questions", "Confused", "N/A (Non-Citizen)"] },
        { id: "cssRequired", label: "CSS Profile Needed?", type: "select", options: ["Yes", "No", "Unsure"] },
        { id: "scholarshipInterest", label: "Scholarship Search Interest", type: "select", options: ["Very Interested", "Somewhat", "Not a Priority"] },
        { id: "finaidNotes", label: "Notes", type: "textarea", placeholder: "Family concerns, next steps for FAFSA completion..." },
      ],
    },
    "Take a Practice ACT or SAT": {
      title: "Practice ACT / SAT",
      description: "Administer a full-length practice test and review results to inform test prep strategy.",
      fields: [
        { id: "workshopDate", label: "Test Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "testType", label: "Test Type", type: "select", options: ["Practice ACT", "Practice SAT"] },
        { id: "compositeScore", label: "Composite Score", type: "text", placeholder: "e.g., 28 or 1320" },
        { id: "englishReading", label: "English / Reading", type: "text", placeholder: "e.g., 30 / 680" },
        { id: "mathScore", label: "Math", type: "text", placeholder: "e.g., 26 / 640" },
        { id: "scienceScore", label: "Science (ACT only)", type: "text", placeholder: "e.g., 27" },
        { id: "scoreAnalysis", label: "Score Analysis", type: "textarea", placeholder: "Strengths, weaknesses, recommended prep focus areas" },
      ],
    },
    "Junior Scholarship Workshop": {
      title: "Junior Scholarship Workshop",
      description: "Introduction to scholarship search, applications, and essay strategies for juniors.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "scholarshipsIdentified", label: "Scholarships Identified", type: "textarea", placeholder: "List scholarships the student plans to pursue" },
        { id: "eligibility", label: "Key Eligibility Factors", type: "text", placeholder: "e.g., 1st gen, STEM, community service" },
        { id: "essayTopics", label: "Scholarship Essay Topics to Prep", type: "textarea", placeholder: "Common themes: leadership, overcoming adversity, community impact" },
      ],
    },
    "Activities & Honors Workshop": {
      title: "Activities & Honors Workshop",
      description: "Guide students in organizing and presenting extracurriculars and honors for applications.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "totalActivities", label: "Total Activities Listed", type: "text", placeholder: "e.g., 8 of 10 slots" },
        { id: "totalHonors", label: "Total Honors Listed", type: "text", placeholder: "e.g., 3 of 5 slots" },
        { id: "activityDescriptions", label: "Descriptions Quality", type: "select", options: ["Strong — Action-Oriented", "Adequate", "Needs Improvement", "Not Started"] },
        { id: "orderOptimized", label: "Activity Order Optimized?", type: "select", options: ["Yes", "No — Needs Reordering"] },
      ],
    },
    "Common App Personal Statement Workshop": {
      title: "Personal Statement Workshop",
      description: "Group workshop on brainstorming, drafting, and structuring the Common App personal statement.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "topicBrainstormed", label: "Topic Brainstormed?", type: "select", options: ["Yes — Strong Topic", "Yes — Needs Refinement", "No — Stuck"] },
        { id: "draftStarted", label: "Draft Started in Workshop?", type: "select", options: ["Yes", "No — Outline Only", "No"] },
        { id: "peerFeedback", label: "Peer Feedback Received?", type: "select", options: ["Yes", "No"] },
        { id: "workshopNotes", label: "Notes", type: "textarea", placeholder: "Topic direction, coaching feedback, next writing deadline..." },
      ],
    },
    "Common Application Workshop": {
      title: "Common Application Workshop",
      description: "Hands-on session for completing the Common App profile, education, and activities sections.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "profileComplete", label: "Profile Section", type: "select", options: ["Complete", "In Progress", "Not Started"] },
        { id: "educationComplete", label: "Education Section", type: "select", options: ["Complete", "In Progress", "Not Started"] },
        { id: "testingComplete", label: "Testing Section", type: "select", options: ["Complete", "In Progress", "Not Started", "Test Optional"] },
        { id: "activitiesComplete", label: "Activities Section", type: "select", options: ["Complete", "In Progress", "Not Started"] },
        { id: "schoolsAdded", label: "Schools Added to Common App", type: "text", placeholder: "e.g., 8 of 12 schools added" },
      ],
    },
    "Supplemental Essay Workshop": {
      title: "Supplemental Essay Workshop",
      description: "Workshop on approaching school-specific supplemental essays efficiently.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "essaysStarted", label: "Supplementals Started in Workshop", type: "text", placeholder: "e.g., 3 outlines drafted" },
        { id: "whyUsApproach", label: "'Why Us' Strategy Clear?", type: "select", options: ["Yes", "Needs More Research", "No"] },
        { id: "overlapIdentified", label: "Overlapping Prompts Identified?", type: "select", options: ["Yes", "Partially", "No"] },
        { id: "workshopNotes", label: "Notes", type: "textarea", placeholder: "Essays needing most work, research needed for 'Why Us' answers..." },
      ],
    },
    "FAFSA/CSS Profile Workshop": {
      title: "FAFSA / CSS Profile Workshop",
      description: "Hands-on session for completing FAFSA and CSS Profile applications.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "parentAttended", label: "Parent/Guardian Attended?", type: "select", options: ["Yes", "No"] },
        { id: "fsaIdCreated", label: "FSA ID Created?", type: "select", options: ["Yes — Student & Parent", "Yes — Student Only", "No"] },
        { id: "fafsaProgress", label: "FAFSA Progress", type: "select", options: ["Submitted", "In Progress", "Started — Needs Tax Info", "Not Started"] },
        { id: "cssProgress", label: "CSS Profile Progress", type: "select", options: ["Submitted", "In Progress", "Not Started", "N/A"] },
        { id: "blockers", label: "Blockers / Issues", type: "textarea", placeholder: "Missing documents, parent concerns, technical issues..." },
      ],
    },
    "Senior Scholarship Bootcamp": {
      title: "Senior Scholarship Bootcamp",
      description: "Intensive session for seniors to identify, apply for, and track scholarship applications.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "applicationsSubmitted", label: "Applications Submitted in Bootcamp", type: "text", placeholder: "e.g., 3 submitted, 2 in progress" },
        { id: "totalAmountApplied", label: "Total Scholarship $ Applied For", type: "text", placeholder: "e.g., $45,000" },
        { id: "essaysWritten", label: "Scholarship Essays Written", type: "text", placeholder: "e.g., 2 new essays drafted" },
        { id: "upcomingDeadlines", label: "Upcoming Deadlines", type: "textarea", placeholder: "Scholarship name + deadline for next 30 days" },
      ],
    },
    "College & Career Transition Workshop": {
      title: "College & Career Transition",
      description: "Preparing students for life after high school: orientation, roommates, registration, and career readiness.",
      fields: [
        { id: "workshopDate", label: "Workshop Date", type: "date" },
        { id: "attendance", label: "Attendance", type: "select", options: ["Attended", "No-Show", "Rescheduled", "Opted Out"] },
        { id: "committedSchool", label: "Committed School", type: "text", placeholder: "e.g., University of Florida" },
        { id: "orientationDate", label: "Orientation Date", type: "date" },
        { id: "housingStatus", label: "Housing Status", type: "select", options: ["Deposit Paid", "Application Submitted", "Researching", "N/A — Commuter"] },
        { id: "registrationStatus", label: "Course Registration Status", type: "select", options: ["Registered", "Scheduled — Not Yet Open", "Needs Advising", "N/A"] },
        { id: "transitionNotes", label: "Notes", type: "textarea", placeholder: "Summer plans, student concerns about transition, final to-dos..." },
      ],
    },
  };

  const getFieldsForMilestone = (milestoneName) => {
    const found = MILESTONE_FIELDS[milestoneName];
    if (found) return found;
    return {
      title: milestoneName,
      description: `Track progress and notes for this ${type === "task" ? "milestone" : "workshop"}.`,
      fields: [
        { id: "status", label: "Status", type: "select", options: ["Not Started", "In Progress", "Completed", "Opted Out"] },
        { id: "completedDate", label: "Completed Date", type: "date" },
        { id: "notes", label: "Notes", type: "textarea", placeholder: "Add notes about this milestone..." },
      ],
    };
  };

  const renderField = (field) => (
    <div key={field.id} className={field.type === "textarea" ? "col-span-2" : ""}>
      <label className="text-xs font-semibold block mb-1" style={{ color: "#b2b2b2" }}>{field.label}</label>
      {field.type === "text" && <input type="text" placeholder={field.placeholder || ""} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }} />}
      {field.type === "date" && <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }} />}
      {field.type === "select" && <select className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4" }}><option value="">Select...</option>{field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>}
      {field.type === "textarea" && <textarea placeholder={field.placeholder || ""} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ borderColor: "#c0bad4", minHeight: 100 }} />}
    </div>
  );

  // Sample history entries for this student
  const historyEntries = [
    { date: "03/01/26", employee: student.counselor || "Alex Morgan", type: "Counselor Session", subject: "College List Review", comment: "Discussed safety schools and reach schools." },
    { date: "02/25/26", employee: student.essayCoach || "Taylor Reed", type: "Essay Session", subject: "Personal Statement Draft", comment: "Reviewed first draft of common app essay." },
    { date: "02/15/26", employee: student.tutor || "Jamie Park", type: "Tutoring Session", subject: "ACT Prep — Reading", comment: "Worked on time management strategies." },
    { date: "02/01/26", employee: student.counselor || "Alex Morgan", type: "Counselor Session", subject: "S.A.F.E. Preferences", comment: "Reviewed size and affordability preferences." },
    { date: "01/20/26", employee: student.essayCoach || "Taylor Reed", type: "Essay Session", subject: "Supplemental Essays", comment: "Brainstormed topics for top 3 schools." },
  ];

  const typeColors = {
    "Counselor Session": { bg: "#e5e0f0", text: "#55478f" },
    "Essay Session": { bg: "#e6fff9", text: "#42778c" },
    "Tutoring Session": { bg: "#fff7ed", text: "#92400e" },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: "rgba(40,29,81,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: "min(1200px, 95vw)", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        {/* Top Bar — Student Contact Info */}
        <div className="flex-shrink-0 px-6 py-4" style={{ backgroundColor: "#281d51", borderRadius: "12px 12px 0 0" }}>
          <div className="flex items-center gap-5">
            <StudentAvatar student={student} size={56} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{student.lastName}, {student.firstName}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#55478f", color: "#c0bad4" }}>Class of {student.gradYear}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs" style={{ color: "#c0bad4" }}>
                <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{student.email}</span>
                <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>{student.phone}</span>
                <span>{student.highSchool} — {student.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center px-3">
                <p className="text-xs" style={{ color: "#8e7bb7" }}>Counselor</p>
                <p className="text-xs font-semibold text-white">{student.counselor}</p>
                <p className="text-xs font-bold" style={{ color: "#00e6c3" }}>{student.counselorHoursUsed}/{student.counselorHoursTotal} hrs</p>
              </div>
              <div style={{ width: 1, height: 36, backgroundColor: "#55478f" }} />
              <div className="text-center px-3">
                <p className="text-xs" style={{ color: "#8e7bb7" }}>Essay Coach</p>
                <p className="text-xs font-semibold text-white">{student.essayCoach}</p>
                <p className="text-xs font-bold" style={{ color: "#00e6c3" }}>{student.essayHoursUsed}/{student.essayHoursTotal} hrs</p>
              </div>
              <div style={{ width: 1, height: 36, backgroundColor: "#55478f" }} />
              <div className="text-center px-3">
                <p className="text-xs" style={{ color: "#8e7bb7" }}>Tutor</p>
                <p className="text-xs font-semibold text-white">{student.tutor}</p>
                <p className="text-xs font-bold" style={{ color: "#00e6c3" }}>{student.tutorHoursUsed}/{student.tutorHoursTotal} hrs</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0" style={{ color: "#c0bad4" }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Middle — Timeline + Fields + History */}
        <div className="flex flex-1 min-h-0">
          {/* Left: Vertical Timeline (no line) */}
          <div className="flex-shrink-0 py-4 px-3 overflow-y-auto" style={{ width: 200, backgroundColor: "#f8f7fc", borderRight: "1px solid #e5e0f0" }}>
            <p className="text-xs font-semibold mb-3 px-2" style={{ color: "#b2b2b2" }}>{type === "task" ? "TASK MILESTONES" : "WORKSHOPS"}</p>
            {items.map((item, idx) => {
              const isOpen = openIndices.has(idx);
              const color = STATUS_COLORS[item.status] || "#c0bad4";
              const strokeColor = item.status === "not-started" || item.status === "opted-out" ? "#8e7bb7" : "#ffffff";
              return (
                <button key={idx} onClick={() => toggleIndex(idx)} className="flex items-center gap-2.5 w-full text-left py-2 px-2 rounded-lg transition-all" style={{ backgroundColor: isOpen ? "#e5e0f0" : "transparent" }}>
                  <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{
                    width: 26, height: 26, backgroundColor: color,
                    opacity: isOpen ? 1 : 0.7,
                    transform: isOpen ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s ease-out",
                    boxShadow: isOpen ? "0 2px 8px rgba(40,29,81,0.25)" : "none",
                  }}>
                    <svg className="w-3 h-3" fill="none" stroke={strokeColor} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight truncate" style={{ color: isOpen ? "#281d51" : "#474747", fontSize: 10 }}>{item.name}</p>
                    <p style={{ color: isOpen ? STATUS_COLORS[item.status] : "#b2b2b2", fontSize: 9 }}>{item.dueDate}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center: Toggled Field Cards */}
          <div className="flex-1 overflow-y-auto p-5 min-w-0">
            <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>Click milestones to open or close their fields.</p>
            {openIndices.size === 0 && (
              <div className="text-center py-16">
                <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="#c0bad4" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                <p className="text-sm" style={{ color: "#b2b2b2" }}>Select a milestone from the timeline.</p>
              </div>
            )}
            <div className="space-y-4">
              {items.map((item, idx) => {
                if (!openIndices.has(idx)) return null;
                const milestoneFields = getFieldsForMilestone(item.name);
                const color = STATUS_COLORS[item.status] || "#c0bad4";
                return (
                  <div key={idx} className="rounded-lg shadow-sm" style={{ border: "1px solid #e5e0f0", overflow: "hidden" }}>
                    <div className="flex items-center gap-3 px-4 py-2.5" style={{ backgroundColor: "#f8f7fc", borderBottom: "1px solid #e5e0f0" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                        <svg className="w-3 h-3" fill="none" stroke={item.status === "not-started" || item.status === "opted-out" ? "#8e7bb7" : "#ffffff"} viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color: "#281d51" }}>{milestoneFields.title}</p>
                        <p className="truncate" style={{ color: "#b2b2b2", fontSize: 11 }}>{milestoneFields.description}</p>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>{STATUS_LABELS[item.status]}</span>
                      <span className="text-xs flex-shrink-0" style={{ color: "#b2b2b2" }}>Due {item.dueDate}</span>
                      <button onClick={() => toggleIndex(idx)} className="p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0" style={{ color: "#b2b2b2" }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {milestoneFields.fields.map(renderField)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: History Pane */}
          <div className="flex-shrink-0 overflow-y-auto py-4 px-4" style={{ width: 280, backgroundColor: "#faf9fd", borderLeft: "1px solid #e5e0f0" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#b2b2b2" }}>HISTORY</p>
            <div className="space-y-3">
              {historyEntries.map((entry, idx) => {
                const tc = typeColors[entry.type] || { bg: "#e5e0f0", text: "#55478f" };
                return (
                  <div key={idx} className="rounded-lg p-3" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e0f0" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: tc.bg, color: tc.text }}>{entry.type}</span>
                      <span className="text-xs" style={{ color: "#b2b2b2" }}>{entry.date}</span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "#281d51" }}>{entry.subject}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#474747" }}>{entry.comment}</p>
                    <p className="text-xs mt-1" style={{ color: "#8e7bb7" }}>{entry.employee}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Notes + Billing & Actions */}
        <div className="flex-shrink-0" style={{ backgroundColor: "#f8f7fc", borderTop: "1px solid #e5e0f0", borderRadius: "0 0 12px 12px" }}>
          {/* Notes — rich text */}
          <div className="px-6 pt-4 pb-3">
            <p className="text-xs font-semibold mb-2" style={{ color: "#b2b2b2" }}>SESSION NOTES</p>
            <div className="rounded-lg" style={{ border: "1px solid #c0bad4", backgroundColor: "#ffffff", overflow: "hidden" }}>
              {/* Mini toolbar */}
              <div className="flex items-center gap-1 px-2 py-1.5" style={{ borderBottom: "1px solid #e5e0f0", backgroundColor: "#faf9fd" }}>
                <button className="p-1 rounded hover:bg-gray-200 transition-colors" style={{ color: "#474747" }} title="Bold"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg></button>
                <button className="p-1 rounded hover:bg-gray-200 transition-colors" style={{ color: "#474747" }} title="Italic"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg></button>
                <button className="p-1 rounded hover:bg-gray-200 transition-colors" style={{ color: "#474747" }} title="Underline"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg></button>
                <div style={{ width: 1, height: 16, backgroundColor: "#e5e0f0", margin: "0 4px" }} />
                <button className="p-1 rounded hover:bg-gray-200 transition-colors" style={{ color: "#474747" }} title="Bulleted List"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg></button>
                <button className="p-1 rounded hover:bg-gray-200 transition-colors" style={{ color: "#474747" }} title="Link"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></button>
              </div>
              <div contentEditable className="px-3 py-2 text-sm min-h-[60px] outline-none" style={{ color: "#474747" }} suppressContentEditableWarning />
            </div>
          </div>
          {/* Billing row */}
          <div className="px-6 pb-4 flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div>
                <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>SESSION TYPE</p>
                <select className="mt-1 px-3 py-1.5 border rounded-lg text-sm" style={{ borderColor: "#c0bad4", color: "#281d51" }}>
                  <option>Counselor Session</option>
                  <option>Essay Session</option>
                  <option>Tutoring Session</option>
                  <option>Admin/Communications</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>HOURS</p>
                <select className="mt-1 px-3 py-1.5 border rounded-lg text-sm" style={{ borderColor: "#c0bad4", color: "#281d51" }}>
                  <option>0.25</option><option>0.5</option><option>0.75</option><option defaultValue>1.0</option><option>1.25</option><option>1.5</option><option>2.0</option>
                </select>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#b2b2b2" }}>DATE</p>
                <input type="date" className="mt-1 px-3 py-1.5 border rounded-lg text-sm" style={{ borderColor: "#c0bad4", color: "#281d51" }} defaultValue="2026-03-05" />
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-lg font-medium text-white text-sm" style={{ backgroundColor: "#55478f" }}>Save</button>
              <button className="px-5 py-2 rounded-lg font-medium text-white text-sm" style={{ backgroundColor: "#ff3467" }}>Save & Notify</button>
              <button onClick={onClose} className="px-5 py-2 rounded-lg font-medium text-sm" style={{ backgroundColor: "#e5e0f0", color: "#281d51" }}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskMilestoneModal;
