import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Zap, Check, AlertCircle, Lightbulb, Smartphone } from 'lucide-react';
import { mobileAppsApi } from '../services/apiService';
import { CreateFromPromptRequest, ProjectType } from '../types/api';

export const MobileAppFromPromptPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdApp, setCreatedApp] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateFromPromptRequest>({
    prompt: '',
    nombre: '',
    project_type: ProjectType.FLUTTER,
  });

  // Ejemplos organizados por dominio
  const dominiosEjemplos = [
    {
      categoria: "🎓 Educación",
      color: "bg-green-50 border-green-200 text-green-800",
      ejemplos: [
        "una app educativa",
        "aplicación escolar para estudiantes",
        "app de gestión académica",
        "plataforma educativa móvil"
      ]
    },
    {
      categoria: "💪 Fitness & Salud",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      ejemplos: [
        "una app de gimnasio",
        "app de fitness y ejercicios",
        "aplicación médica",
        "app de citas médicas"
      ]
    },
    {
      categoria: "🍔 Delivery & Comercio",
      color: "bg-orange-50 border-orange-200 text-orange-800",
      ejemplos: [
        "app de delivery de comida",
        "tienda online móvil",
        "aplicación de e-commerce",
        "app de restaurantes"
      ]
    },
    {
      categoria: "💰 Finanzas",
      color: "bg-purple-50 border-purple-200 text-purple-800",
      ejemplos: [
        "app de finanzas personales",
        "aplicación contable",
        "app de gestión de gastos",
        "control de presupuesto"
      ]
    },
    {
      categoria: "👥 Social",
      color: "bg-pink-50 border-pink-200 text-pink-800",
      ejemplos: [
        "red social simple",
        "app de chat",
        "aplicación de mensajería",
        "red social para mascotas"
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      setError('La descripción de la aplicación es requerida');
      return;
    }

    if (formData.prompt.length < 5) {
      setError('La descripción debe tener al menos 5 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 APARTADO GENERAL - Creando app automática desde prompt:', formData.prompt);
      const result = await mobileAppsApi.createGeneralApp({
        prompt: formData.prompt,
        nombre: formData.nombre
      });
      console.log('✅ Resultado APARTADO GENERAL:', result);
      
      if (result.success && result.app) {
        setCreatedApp(result.app);
        setSuccess(true);
        
        // Auto-generar proyecto después de 2 segundos
        setTimeout(async () => {
          try {
            console.log('🔄 Generando proyecto automáticamente...');
            const blob = await mobileAppsApi.generateProject(result.app.id);
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${result.app.nombre || 'mobile-app'}-flutter.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            console.log('✅ Proyecto descargado exitosamente');
            
            // Redirigir después de la descarga
            setTimeout(() => {
              navigate('/mobile-apps', { 
                state: { 
                  message: `¡App "${result.app.nombre}" creada exitosamente! 🎉`,
                  appId: result.app.id
                }
              });
            }, 2000);
            
          } catch (genError) {
            console.error('Error generando proyecto:', genError);
            setError('Error generando el proyecto. Puedes intentar descargarlo desde "Mis Apps".');
          }
        }, 2000);
      } else {
        setError(result.error || 'Error en la respuesta del servidor');
      }
      
    } catch (error: any) {
      console.error('Error creando app:', error);
      setError(
        error.response?.status === 400 
          ? 'Verifica que la descripción sea válida'
          : error.response?.status === 500
          ? 'Error interno del servidor. Intenta más tarde.'
          : 'Error creando la aplicación. Intenta con una descripción más específica.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (ejemplo: string) => {
    setFormData({ ...formData, prompt: ejemplo });
  };

  if (success && createdApp) {
    const paginasDetectadas = createdApp.prompt?.split('\n')
      .filter((line: string) => line.match(/^\d+\.\s*\w+Screen:/))
      .length || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡App Creada Exitosamente! 🎉
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Resumen de tu app:</h3>
            <p className="text-lg font-medium text-blue-600 mb-2">"{createdApp.nombre}"</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Páginas generadas:</strong> {paginasDetectadas} páginas específicas + 4 base</p>
              <p><strong>Dominio detectado:</strong> Automático con IA</p>
              <p><strong>Tecnología:</strong> Flutter con Material Design 3</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Loader className="animate-spin w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Generando y descargando proyecto...</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            El sistema detectó automáticamente el dominio y generó páginas específicas. 
            El proyecto se descargará automáticamente en unos segundos.
          </p>
          
          <div className="text-xs text-gray-500">
            Redirigiendo a "Mis Apps" después de la descarga...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/mobile-apps-main')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-green-600" />
              Creación GENERAL - Automática
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Smartphone className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Crea tu App con IA Automática
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Describe tu idea en pocas palabras y nuestra IA detectará automáticamente el dominio, 
              generará páginas específicas y creará una app completa.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">7+</div>
              <div className="text-sm text-green-700">Dominios Soportados</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">8-9</div>
              <div className="text-sm text-blue-700">Páginas Generadas</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
              <div className="text-sm text-purple-700">Flutter Completo</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-red-700">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                🎯 Describe tu app en pocas palabras
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Ejemplo: una app educativa"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                required
                minLength={5}
              />
              <p className="text-sm text-gray-500 mt-2">
                La IA detectará automáticamente el dominio y generará páginas específicas.
              </p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                📱 Nombre de la app (opcional)
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Se genera automáticamente si se deja vacío"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                maxLength={50}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.prompt.trim()}
              className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center text-lg"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin w-6 h-6 mr-3" />
                  Creando app con IA...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3" />
                  Crear App Automática
                </>
              )}
            </button>
          </form>

          {/* Examples */}
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">
                Ejemplos por Dominio
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dominiosEjemplos.map((dominio, index) => (
                <div key={index} className={`border-2 rounded-lg p-4 ${dominio.color}`}>
                  <h4 className="font-semibold mb-3">{dominio.categoria}</h4>
                  <div className="space-y-2">
                    {dominio.ejemplos.map((ejemplo, exIndex) => (
                      <button
                        key={exIndex}
                        onClick={() => handleExampleClick(ejemplo)}
                        className="block w-full text-left p-2 bg-white/70 hover:bg-white/90 rounded text-sm transition-colors"
                      >
                        "{ejemplo}"
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 