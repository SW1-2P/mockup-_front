import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Image, Zap, Settings } from 'lucide-react';

export const MobileAppsMainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al inicio
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Smartphone className="w-8 h-8 mr-3 text-blue-600" />
              Generador de Apps Móviles
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo quieres crear tu app móvil?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el método que mejor se adapte a tus necesidades. Puedes crear una app de manera 
            rápida y automática, o trabajar con análisis detallado de mockups.
          </p>
        </div>

        {/* Three main options */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* APARTADO 1: GENERAL - Automático */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                1. GENERAL
              </h3>
              <p className="text-gray-600">
                Creación automática con IA
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Prompt simple:</strong> Solo describe tu idea básica
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Enriquecimiento automático:</strong> IA detecta dominio y genera páginas
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Resultado:</strong> App completa con 8-9 páginas específicas
                </p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">Ejemplos:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• "una app educativa"</li>
                <li>• "app de gimnasio"</li>
                <li>• "aplicación de delivery"</li>
                <li>• "app de finanzas"</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/mobile-app-from-prompt')}
              className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Crear App General
            </button>
          </div>

          {/* APARTADO 2: DETALLADO - Prompt específico */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                2. DETALLADO
              </h3>
              <p className="text-gray-600">
                Prompt específico sin enriquecimiento
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Control total:</strong> Especificas exactamente qué quieres
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Sin automático:</strong> No hay enriquecimiento de IA
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Precisión:</strong> App exactamente como la describes
                </p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-orange-800 mb-2">Ejemplo:</h4>
              <p className="text-sm text-orange-700">
                "Crear app Flutter con: 1. LoginScreen con email/password, 2. HomeScreen con dashboard, 3. ProfileScreen..."
              </p>
            </div>

            <button
              onClick={() => navigate('/mobile-app-detailed')}
              className="w-full bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              Crear App Detallada
            </button>
          </div>

          {/* APARTADO 3: DESDE IMAGEN - Análisis de mockup */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Image className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                3. DESDE IMAGEN
              </h3>
              <p className="text-gray-600">
                Análisis de mockups/diseños
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Imagen como entrada:</strong> Sube mockups o diseños
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Análisis visual:</strong> IA analiza componentes específicos
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Fidelidad:</strong> App respeta el diseño original
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Formatos:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• JPG, PNG, GIF, WEBP</li>
                <li>• Mockups de Figma/Sketch</li>
                <li>• Wireframes y prototipos</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/mobile-app-from-image')}
              className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Image className="w-5 h-5 mr-2" />
              Crear Desde Imagen
            </button>
          </div>
        </div>

        {/* Quick access to existing apps */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mis Apps Móviles
              </h3>
              <p className="text-gray-600">
                Ver y gestionar todas las aplicaciones móviles que has creado
              </p>
            </div>
            <button
              onClick={() => navigate('/mobile-apps')}
              className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
            >
              <Settings className="w-5 h-5 mr-2" />
              Gestionar Apps
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">7+</div>
              <div className="text-gray-600">Dominios Soportados</div>
              <div className="text-sm text-gray-500 mt-2">
                Fitness, Educación, Delivery, Finanzas, E-commerce, Salud, Social
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">8-9</div>
              <div className="text-gray-600">Páginas Mínimas</div>
              <div className="text-sm text-gray-500 mt-2">
                Páginas específicas del dominio + páginas base automáticas
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Flutter Completo</div>
              <div className="text-sm text-gray-500 mt-2">
                Material Design 3, GoRouter, código limpio y funcional
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 