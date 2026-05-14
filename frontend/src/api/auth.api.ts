import axiosInstance from './axiosInstance';
import type { LoginRequest, SignupRequest, AuthToken, User } from '../types/auth.types';

export const authApi = {
  signup: async (data: SignupRequest): Promise<User> => {
    const res = await axiosInstance.post('/auth/signup', data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthToken> => {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
};