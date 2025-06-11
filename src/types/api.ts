export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

export interface Diagrama {
  id: string;
  nombre: string;
  xml: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mockup {
  id: string;
  nombre: string;
  xml: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectType {
  FLUTTER = 'flutter',
  ANGULAR = 'angular'
}

export interface MobileAppConfig {
  package_name?: string;
  version?: string;
  description?: string;
  features?: string[];
  theme?: string;
}

export interface MobileApp {
  id: string;
  nombre: string;
  xml?: string;
  prompt?: string;
  mockup_id?: string;
  project_type: ProjectType;
  config?: MobileAppConfig;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMobileAppRequest {
  nombre?: string;
  xml?: string;
  prompt?: string;
  mockup_id?: string;
  project_type?: ProjectType;
  config?: MobileAppConfig;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol?: "admin" | "editor";
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
