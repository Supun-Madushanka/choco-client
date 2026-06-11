import apiClient from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
};