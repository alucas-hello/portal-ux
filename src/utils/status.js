import { SAMPLE_STUDENTS } from "../data/students";
import { TASK_MILESTONES, WORKSHOPS } from "../data/milestones";

export const generateTaskStatus = (studentIndex, taskIndex) => {
  const student = SAMPLE_STUDENTS[studentIndex];
  const gradYear = student.gradYear;
  const progressPercent = gradYear === 2025 ? 0.9 : gradYear === 2026 ? 0.5 : 0.2;
  const completedTasks = Math.floor(TASK_MILESTONES.length * progressPercent);
  const inProgressTasks = Math.floor(TASK_MILESTONES.length * 0.1);
  if (taskIndex < completedTasks) return "completed";
  if (taskIndex < completedTasks + inProgressTasks) return "in-progress";
  if ((studentIndex * 7 + taskIndex * 13) % 20 === 0) return "opted-out";
  return "not-started";
};

export const generateWorkshopStatus = (studentIndex, workshopIndex) => {
  const student = SAMPLE_STUDENTS[studentIndex];
  const gradYear = student.gradYear;
  const progressPercent = gradYear === 2025 ? 0.85 : gradYear === 2026 ? 0.4 : 0.1;
  const completedWorkshops = Math.floor(WORKSHOPS.length * progressPercent);
  const registeredWorkshops = Math.floor(WORKSHOPS.length * 0.15);
  const inProgressWorkshops = Math.floor(WORKSHOPS.length * 0.05);
  if (workshopIndex < completedWorkshops) return "completed";
  if (workshopIndex < completedWorkshops + registeredWorkshops) return "registered";
  if (workshopIndex < completedWorkshops + registeredWorkshops + inProgressWorkshops) return "in-progress";
  if ((studentIndex * 7 + workshopIndex * 13) % 20 === 0) return "opted-out";
  return "not-started";
};

// Generate due dates based on task index
export const getTaskDueDate = (taskIdx, gradYear) => {
  const monthOffset = Math.floor(taskIdx * 1.2);
  const baseMonth = gradYear === 2025 ? 1 : gradYear === 2026 ? 4 : 8;
  const month = ((baseMonth + monthOffset - 1) % 12) + 1;
  const year = month < baseMonth ? 26 : 25;
  return `${String(month).padStart(2,"0")}/15/${year}`;
};

// Determine if behind schedule (due date passed but not completed)
export const getEffectiveStatus = (rawStatus, dueDate) => {
  if (rawStatus === "completed" || rawStatus === "opted-out") return rawStatus;
  const parts = dueDate.split("/");
  const due = new Date(2000 + parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
  const today = new Date();
  if (due < today && rawStatus === "not-started") return "behind";
  return rawStatus;
};
