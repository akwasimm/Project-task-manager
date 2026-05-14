import axiosInstance from './axiosInstance';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '../types/task.types';

export const tasksApi = {
  getByProject: async (projectId: string): Promise<Task[]> => {
    const res = await axiosInstance.get(`/projects/${projectId}/tasks`);
    return res.data;
  },

  getMyTasks: async (): Promise<Task[]> => {
    const res = await axiosInstance.get('/tasks');
    return res.data;
  },

  getById: async (id: string): Promise<Task> => {
    const res = await axiosInstance.get(`/tasks/${id}`);
    return res.data;
  },

  create: async (projectId: string, data: CreateTaskRequest): Promise<Task> => {
    const res = await axiosInstance.post(`/projects/${projectId}/tasks`, data);
    return res.data;
  },

  update: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const res = await axiosInstance.put(`/tasks/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: string, data: UpdateTaskStatusRequest): Promise<Task> => {
    const res = await axiosInstance.patch(`/tasks/${id}/status`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}`);
  },
};