import axiosInstance from './axiosInstance';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddMemberRequest,
} from '../types/project.types';

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const res = await axiosInstance.get('/projects');
    return res.data;
  },

  getById: async (id: string): Promise<Project> => {
    const res = await axiosInstance.get(`/projects/${id}`);
    return res.data;
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    const res = await axiosInstance.post('/projects', data);
    return res.data;
  },

  update: async (id: string, data: UpdateProjectRequest): Promise<Project> => {
    const res = await axiosInstance.put(`/projects/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${id}`);
  },

  addMember: async (projectId: string, data: AddMemberRequest): Promise<Project> => {
    const res = await axiosInstance.post(`/projects/${projectId}/members`, data);
    return res.data;
  },

  removeMember: async (projectId: string, userId: string): Promise<Project> => {
    const res = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
    return res.data;
  },
};