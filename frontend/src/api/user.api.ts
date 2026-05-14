import axiosInstance from './axiosInstance';
import type { User } from '../types/auth.types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await axiosInstance.get('/users');
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await axiosInstance.get(`/users/${id}`);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};