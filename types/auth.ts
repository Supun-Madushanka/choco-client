export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  roleDisplayName: string;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type LoginResponse = ApiResponse<LoginResponseData>;