// src/app/core/models/auth.models.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenExpiration: Date;
  userId: number;
  username: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId?: number;
  organizationName?: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId?: number;
  organizationName?: string;
}