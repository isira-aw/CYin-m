export interface User {
  email: string;
  role: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  employeeName: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  status: boolean;
  role: string;
  token: string;
}

export interface EventRequest {
  status: string;
  location: string;
}

export interface WorkRequest {
  description: string;
}