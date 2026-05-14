import type { Task } from './task.types';

export interface StatusCount {
  todo: number;
  in_progress: number;
  done: number;
  overdue: number;
}

export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  my_tasks: number;
  status_breakdown: StatusCount;
  recent_tasks: Task[];
}