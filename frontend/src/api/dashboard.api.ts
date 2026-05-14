import axiosInstance from './axiosInstance';
import type { DashboardStats } from '../types/dashboard.types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await axiosInstance.get('/dashboard/stats');
    return res.data;
  },
};