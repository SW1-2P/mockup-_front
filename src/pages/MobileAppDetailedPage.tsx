import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { mobileAppsApi } from '../services/apiService';

export const MobileAppDetailedPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Por favor, ingresa las especificaciones detalladas de tu app');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await mobileAppsApi.createDetailedApp({
        prompt: prompt.trim(),
        nombre: nombre.trim() || 'App Detallada',
        projectType: 'flutter'
      });

      if (response.success) {
        setResult(response);
      } else {
        setError(response.error || 'Error creando la aplicación detallada');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.app?.id) return;

    try {
      setIsLoading(true);
      const blob = await mobileAppsApi.downloadApp(result.app.id);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${result.app.nombre || 'app-detallada'}.zip`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error descargando:', err);
      setError('Error descargando el proyecto. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/mobile-apps-main')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Apps Móviles
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-orange-600" />
              APARTADO DETALLADO
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Especifica Exactamente Tu App
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Describe con precisión las pantallas, funcionalidades y componentes que quieres. 
            <strong> Sin enriquecimiento automático</strong> - obtienes exactamente lo que solicitas.
          </p>
        </div>

        {!result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del proyecto */}
              <div>
                <label htmlFor="nombre" className="block text-lg font-semibold text-gray-900 mb-2">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Mi App Personalizada"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Prompt detallado */}
              <div>
                <label htmlFor="prompt" className="block text-lg font-semibold text-gray-900 mb-2">
                  Especificaciones Detalladas *
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe exactamente lo que quieres:

Ejemplo:
Crear una aplicación Flutter con las siguientes pantallas:

1. LoginScreen:
   - Campos: email y password
   - Botón de login
   - Link para registro

2. HomeScreen:
   - Dashboard con 4 cards principales
   - Menú de navegación inferior
   - Header con nombre del usuario

3. ProfileScreen:
   - Formulario de edición de perfil
   - Avatar circular
   - Botón guardar cambios

4. SettingsScreen:
   - Lista de configuraciones
   - Toggles para notificaciones
   - Opción de cerrar sesión

Utilizar Material Design 3, colores azul y blanco, navegación con BottomNavigationBar."
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  ⚠️ <strong>Importante:</strong> Sé específico. No se aplicará enriquecimiento automático.
                </p>
              </div>

              {/* Error display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Generando App Detallada...
                  </>
                ) : (
                  <>
                    <Settings className="w-6 h-6 mr-3" />
                    Crear App Detallada
                  </>
                )}
              </button>
            </form>

            {/* Examples Section */}
            <div className="mt-12 bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4">💡 Consejos para Prompts Detallados</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">✅ Buenas Prácticas:</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    <li>• Numera cada pantalla claramente</li>
                    <li>• Especifica componentes exactos</li>
                    <li>• Menciona colores y estilos</li>
                    <li>• Define navegación entre pantallas</li>
                    <li>• Incluye funcionalidades específicas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">❌ Evitar:</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    <li>• Prompts vagos como "app de empresa"</li>
                    <li>• No especificar pantallas</li>
                    <li>• Dejar navegación sin definir</li>
                    <li>• Omitir detalles de UI</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  ¡App Detallada Creada Exitosamente!
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📱 Información del Proyecto</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><strong>Nombre:</strong> {result.app.nombre}</p>
                    <p><strong>Tipo:</strong> {result.type}</p>
                    <p><strong>Páginas:</strong> {result.totalPages || 'N/A'}</p>
                    <p><strong>Estado:</strong> <span className="text-green-600">Completado</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Funcionalidades Especificadas</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-1">
                      {result.specifiedFeatures?.map((feature: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700">• {feature}</li>
                      )) || <li className="text-sm text-gray-700">• Funcionalidades según especificaciones</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-orange-800 mb-2">📋 Prompt Original (Primeros 500 caracteres)</h4>
                <p className="text-sm text-orange-700 font-mono bg-white p-3 rounded border">
                  {result.originalPrompt}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Descargar Proyecto Flutter
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setResult(null);
                    setPrompt('');
                    setNombre('');
                    setError(null);
                  }}
                  className="flex-1 bg-gray-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Crear Nueva App Detallada
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 