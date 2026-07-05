export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}
