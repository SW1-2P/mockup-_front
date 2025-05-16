import axios from "axios";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Diagrama,
  Mockup,
} from "../types/api";

// Base API URL
// Asegurarse de que la variable de entorno se capture correctamente
const getApiUrl = () => {
  // Para entornos de desarrollo y producción con Vite
  if (import.meta.env.VITE_API_URL) {
    console.log('Usando URL de API desde variable de entorno:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Valor por defecto
  console.log('Usando URL de API predeterminada: http://localhost:3000');
  return "http://localhost:3000";
};

const API_URL = getApiUrl();

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle unauthorized errors globally
const handleUnauthorized = () => {
  // Check if we're already on the login page to avoid redirect loop
  if (window.location.pathname !== "/login") {
    console.log("Session expired or unauthorized, redirecting to login");
    // Clear auth data
    authApi.logout();
    // Redirect to login
    window.location.href = "/login";
  }
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      // Store user info in localStorage - fixing the key name and property
      localStorage.setItem("user", JSON.stringify(response.data.usuario));
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", userData);
      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      // Store user info in localStorage - fixing the key name and property
      localStorage.setItem("user", JSON.stringify(response.data.usuario));
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem("token"));
  },

  // Get current user
  getCurrentUser: (): any => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      // Remove the invalid user data
      localStorage.removeItem("user");
      return null;
    }
  },
};

// Diagrams API
export const diagramasApi = {
  // Get all diagrams
  getAll: async (): Promise<Diagrama[]> => {
    try {
      const response = await api.get<Diagrama[]>("/diagramas");
      return response.data;
    } catch (error) {
      console.error("Get diagrams error:", error);
      throw error;
    }
  },

  // Get diagram by ID
  getById: async (id: string): Promise<Diagrama> => {
    try {
      const response = await api.get<Diagrama>(`/diagramas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get diagram ${id} error:`, error);
      throw error;
    }
  },

  // Create new diagram
  create: async (diagram: {
    nombre: string;
    xml: string;
  }): Promise<Diagrama> => {
    try {
      // Get current user from localStorage
      const user = authApi.getCurrentUser();

      if (!user || !user.id) {
        throw new Error("User not authenticated or user ID not available");
      }

      // Add user_id to the diagram data
      const diagramWithUserId = {
        ...diagram,
        user_id: user.id,
      };

      const response = await api.post<Diagrama>(
        "/diagramas",
        diagramWithUserId
      );
      return response.data;
    } catch (error) {
      console.error("Create diagram error:", error);
      throw error;
    }
  },

  // Update diagram
  update: async (
    id: string,
    data: { nombre?: string; xml?: string }
  ): Promise<Diagrama> => {
    try {
      const response = await api.patch<Diagrama>(`/diagramas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Update diagram ${id} error:`, error);
      throw error;
    }
  },

  // Delete diagram
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/diagramas/${id}`);
    } catch (error) {
      console.error(`Delete diagram ${id} error:`, error);
      throw error;
    }
  },
};

// Mockups API
export const mockupsApi = {
  // Get all mockups
  getAll: async (): Promise<Mockup[]> => {
    try {
      const response = await api.get<Mockup[]>("/mockups");
      return response.data;
    } catch (error) {
      console.error("Get mockups error:", error);
      throw error;
    }
  },

  // Get mockup by ID
  getById: async (id: string): Promise<Mockup> => {
    try {
      const response = await api.get<Mockup>(`/mockups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get mockup ${id} error:`, error);
      throw error;
    }
  },

  // Create new mockup
  create: async (mockup: { nombre: string; xml: string }): Promise<Mockup> => {
    try {
      // Get current user from localStorage
      const user = authApi.getCurrentUser();

      if (!user || !user.id) {
        throw new Error("User not authenticated or user ID not available");
      }

      // Add user_id to the mockup data
      const mockupWithUserId = {
        ...mockup,
        user_id: user.id,
      };

      const response = await api.post<Mockup>("/mockups", mockupWithUserId);
      return response.data;
    } catch (error) {
      console.error("Create mockup error:", error);
      throw error;
    }
  },

  // Generar código Angular desde mockup
  generateAngular: async (xml: string): Promise<Blob> => {
    try {
      const response = await api.post('/chatgpt/generate-angular', { xml }, {
        responseType: 'blob', // Importante: especificar que esperamos un blob (archivo binario)
      });
      return response.data;
    } catch (error) {
      console.error('Error generando código Angular:', error);
      throw error;
    }
  },

  // Update mockup
  update: async (
    id: string,
    data: { nombre?: string; xml?: string }
  ): Promise<Mockup> => {
    try {
      const response = await api.patch<Mockup>(`/mockups/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Update mockup ${id} error:`, error);
      throw error;
    }
  },

  // Delete mockup
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/mockups/${id}`);
    } catch (error) {
      console.error(`Delete mockup ${id} error:`, error);
      throw error;
    }
  },
};
