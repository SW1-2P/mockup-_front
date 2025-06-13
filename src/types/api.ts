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

/**
 * Request para crear aplicación desde prompt (NUEVO)
 */
export interface CreateFromPromptRequest {
  /** Descripción de la aplicación (requerido) */
  prompt: string;
  
  /** Nombre de la aplicación (opcional - se genera automáticamente) */
  nombre?: string;
  
  /** Tipo de proyecto (opcional - default: flutter) */
  project_type?: ProjectType;
  
  /** Configuración adicional (opcional) */
  config?: MobileAppConfig;
}

/**
 * Response de creación desde prompt (LEGACY)
 */
export interface CreateFromPromptResponse {
  /** UUID de la aplicación creada */
  id: string;
  
  /** Nombre de la aplicación */
  nombre: string;
  
  /** Prompt ENRIQUECIDO automáticamente por la IA */
  prompt: string;
  
  /** Tipo de proyecto */
  project_type: ProjectType;
  
  /** Configuración del proyecto */
  config?: MobileAppConfig;
  
  /** ID del usuario propietario */
  user_id: string;
  
  /** Fecha de creación */
  createdAt: string;
  
  /** Fecha de última actualización */
  updatedAt: string;
}

/**
 * Response de los nuevos apartados de creación de apps
 */
export interface CreateAppResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  
  /** Tipo de apartado usado */
  type: 'general_automatic' | 'detailed_from_prompt' | 'from_image_analysis';
  
  /** Datos de la aplicación creada */
  app: MobileApp;
  
  /** Prompt enriquecido (solo APARTADO GENERAL) */
  enrichedPrompt?: string;
  
  /** Dominio detectado (solo APARTADO GENERAL) */
  detectedDomain?: string;
  
  /** Prompt original (solo APARTADO DETALLADO) */
  originalPrompt?: string;
  
  /** Funcionalidades especificadas (solo APARTADO DETALLADO) */
  specifiedFeatures?: string[];
  
  /** Análisis de imagen (solo APARTADO DESDE IMAGEN) */
  imageAnalysis?: string;
  
  /** Componentes detectados (solo APARTADO DESDE IMAGEN) */
  detectedComponents?: string[];
  
  /** Total de páginas generadas */
  totalPages?: number;
  
  /** Mensaje descriptivo */
  message?: string;
  
  /** Error en caso de fallo */
  error?: string;
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
