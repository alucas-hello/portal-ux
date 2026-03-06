# HelloCollege Employee Portal - React JSX Prototype

## File Location
`/sessions/modest-sleepy-brahmagupta/mnt/portal-ux/hc-portal-prototype.jsx`

## Overview
A comprehensive single-file React JSX prototype for the HelloCollege Employee Portal, featuring all required pages and components with full styling using Tailwind CSS and inline styles.

## Key Features Implemented

### 1. Navigation & Sidebar
- Collapsible sidebar (expanded on hover) with 9 main navigation items
- Logo "HC" with brand magenta background (#ff3467)
- Recent students quick-access pills at bottom
- Active page highlighting with brand accent colors

### 2. Pages & Components

#### Counselor Dashboard
- Card-based student layout with comprehensive metrics
- Student filtering: Search by name/school, counselor dropdown, graduation year tags
- Per-student cards showing:
  - Avatar (initials in circle)
  - Name (clickable to navigate to detail page)
  - High school and graduation year
  - 6 metric chips: Meetings, Last Meeting (color-coded: green <30d, yellow 30-60d, red >60d), Next Contact, Next Meeting, Hours (with progress bar), Workshops
  - Next workshop status and notes preview
- Pagination footer

#### Tasks Tab
- Matrix/grid layout with 20 task milestones
- Sticky student name column on left
- Status indicators: Completed (cyan), In Progress (amber), Not Started (magenta), Opted Out (light purple)
- Rotated column headers for space efficiency
- Realistic sample data: Seniors mostly complete, Juniors mid-way, Sophomores early stage

#### Workshops Tab
- Similar matrix layout with 15 workshop columns
- Additional "Registered" status (blue) in addition to task statuses
- Horizontally scrollable for all 15 workshops
- Same student name stickiness and responsive design

#### Essay Coach Tab
- Card-based layout (similar to counselor dashboard)
- Per-student cards with:
  - Avatar, name, major, counselor & coach names
  - Last/next scheduled meetings, total meetings count
  - Hours used/total with progress bar and remaining hours
  - 6 essay milestone status dots
- 5 sample essay coach students with realistic data

#### Tutor Dashboard Tab
- Card layout with tutor-specific information
- Student name, grad year, email, phone, tutor names
- Last/next session dates, available hours
- Test scores displayed as pills (ACT, SAT, GPA)
- Latest conversation snippet and notes preview

#### Student Detail Page
- Two-column layout (65% left, 35% right)
- LEFT COLUMN:
  - Large student header with avatar and quick stats
  - Cadence dropdowns (4 periods: Pre-Up to April Jr, Peak-May to Aug Jr, Peak-Sep to Dec Jr, Jan Sr-Grad)
  - Action buttons: LOGIN AS STUDENT, SEND PASSWORD RESET, LOG QUICK ADMIN TASK
  - Basic Information section (name, gender, email, phone, major, high school, etc.)
  - Student Scores section (ACT composite + subscores, SAT total + subscores, GPA weighted/unweighted)
  - Tabbed notes area (Counselor Notes, Tutoring Notes, Essay Notes)
  - Conversation log with entries showing date, employee, type, subject, comment
- RIGHT COLUMN:
  - Upcoming Sessions table (appointment type, date, profile name, time)
  - Add Conversation form (employee dropdown, date, subject, comment textarea, show to clients checkbox)
  - Team members display (Counselor, Essay Coach, Tutor with avatars)
  - Family section (parents/guardians with relationship, email, phone)

### 3. Sample Data
- 8 comprehensive student profiles:
  1. Daniela Aguilar Villalobos (2026, Lincoln HS, CA)
  2. Madelyn Hart (2026, Westview Academy, FL) - detailed profile
  3. Meera Kumar (2027, North Ridge Prep, NY)
  4. William Chen (2026, Eastlake HS, WA)
  5. Sofia Rodriguez (2027, Memorial HS, TX)
  6. James Thompson (2025, Oak Park Academy, IL)
  7. Ananya Patel (2026, Riverside HS, NJ)
  8. Jordan Williams (2027, Crestwood Prep, MA)

- Each student includes:
  - Personal info (name, school, state, gender, email, phone, major)
  - Counselor, essay coach, tutor assignments
  - Meeting counts and dates
  - Hours used/total for counselor, essay, and tutoring
  - Academic scores (ACT, SAT, GPA, AP classes)
  - Workshop participation count
  - Status notes

### 4. Brand Colors (All Implemented)
- Primary Dark: #281d51
- Primary Medium: #55478f
- Primary Light: #8e7bb7
- Primary Pale: #c0bad4
- Accent Magenta: #ff3467
- Accent Teal: #42778c
- Accent Cyan: #00e6c3
- Text Dark: #474747
- Text Light: #b2b2b2
- Background: #f8f7fc
- Card Background: #f0ece8

### 5. Design System
- Font: Montserrat (imported from Google Fonts)
- All Tailwind CSS utility classes for responsive design
- Inline styles for brand color implementation
- Consistent spacing, shadows, and rounded corners
- Hover effects on interactive elements
- Status color coding (green for success, amber for in-progress, magenta for alerts, cyan for completion)

### 6. Technical Implementation
- Single file (708 lines, 50KB)
- React hooks: useState for state management
- No external icon libraries - all icons are inline SVG components
- Only React import: `import { useState } from "react"`
- Component-based architecture with clear separation
- Responsive grid layouts
- Sticky positioning for matrix headers
- Progress bars for hours tracking

## Key Components

1. **PortalApp** - Main app with routing and sidebar
2. **CounselorDashboard** - Student card grid with filtering
3. **TasksTab** - Task milestone matrix
4. **WorkshopsTab** - Workshop attendance matrix
5. **EssayCoachTab** - Essay coach student cards
6. **TutorTab** - Tutor student cards
7. **StudentDetailPage** - Comprehensive student profile (2-column)
8. **MetricChip** - Reusable stat display component
9. **StatBox** - Quick stat box helper
10. **InputField** - Form input helper

## Navigation Flow
- Dashboard (default) → Counselor Dashboard
- Click student name → Student Detail Page
- Back button returns to Counselor Dashboard
- Sidebar items: Dashboard, Colleges, High Schools, Registration, Time Tracker, Reports, Programs, Services, Settings
- All navigation items functional (routing implemented)

## Matrix Features (Tasks & Workshops)
- 20 task milestones with realistic progression by class year
- 15 workshops with varied completion statuses
- Horizontally scrollable with sticky student column
- Color-coded status indicators
- Rotated column headers to save space
- Realistic sample data generation based on graduation year

## Notes
- All dates formatted as MM/DD/YY
- All cards have shadow-sm and rounded-lg styling
- Hover effects on buttons and cards
- Pagination indicator on dashboard
- Responsive design ready for various screen sizes
- All colors use exact hex codes from brand guidelines
- Code is production-ready with no dependencies beyond React

## File Path
`/sessions/modest-sleepy-brahmagupta/mnt/portal-ux/hc-portal-prototype.jsx`
