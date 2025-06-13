import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image, Loader, Check, AlertCircle, Eye, Download } from 'lucide-react';
import { 
  fileToBase64, 
  validateImageFile,
  getImageInfo
} from '../services/imageAnalysisService';
import { mobileAppsApi } from '../services/apiService';

interface FormData {
  projectName: string;
  projectType: 'flutter' | 'angular';
  imageFile: File | null;
}

const MobileAppFromImagePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    projectType: 'flutter',
    imageFile: null
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageInfo, setImageInfo] = useState<{ sizeKB: number; format: string } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo no válido');
      return;
    }

    setIsCompressing(true);
    setError('');

    try {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      // Crear preview comprimido
      const compressedBase64 = await fileToBase64(file, true);
      setImagePreview(compressedBase64);
      
      // Mostrar información de la imagen
      const info = getImageInfo(compressedBase64);
      setImageInfo(info);
      
      setSuccess(`Imagen cargada y comprimida: ${info.sizeKB} KB (${info.format.toUpperCase()})`);
      
    } catch (err) {
      setError('Error procesando imagen: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!formData.imageFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult('');

    try {
      const base64Image = await fileToBase64(formData.imageFile, true);
      
      // Usar el servicio de análisis de imágenes
      const { analyzeImageForProject } = await import('../services/imageAnalysisService');
      const result = await analyzeImageForProject(base64Image, formData.projectType);
      
      if (result.success && result.description) {
        setAnalysisResult(result.description);
        setSuccess('¡Imagen analizada correctamente! Revisa la descripción y genera el proyecto.');
      } else {
        setError(result.error || 'Error analizando imagen');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error analizando imagen');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateProject = async () => {
    if (!formData.imageFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    if (!formData.projectName.trim()) {
      setError('Por favor ingresa un nombre para el proyecto');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const base64Image = await fileToBase64(formData.imageFile, true);
      
      // Usar el nuevo endpoint del APARTADO DESDE IMAGEN
      const result = await mobileAppsApi.createFromImageApp({
        image: base64Image,
        nombre: formData.projectName,
        projectType: formData.projectType
      });

      if (result.success && result.app) {
        setSuccess(`¡App "${result.app.nombre}" creada desde imagen! Generando proyecto...`);
        
        // Auto-generar el proyecto
        setTimeout(async () => {
          try {
            const blob = await mobileAppsApi.generateProject(result.app.id);
            
            // Descargar archivo automáticamente
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = `${result.app.nombre}-${formData.projectType}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpiar URL del blob
            URL.revokeObjectURL(url);
            
            setSuccess(`¡Proyecto ${formData.projectType} generado y descargado correctamente!`);
            
            // Limpiar formulario
            setFormData({
              projectName: '',
              projectType: 'flutter',
              imageFile: null
            });
            setImagePreview('');
            setImageInfo(null);
            setAnalysisResult('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
          } catch (genError) {
            console.error('Error generando proyecto:', genError);
            setError('Error generando el proyecto. Puedes intentar descargarlo desde "Mis Apps".');
          }
        }, 2000);
        
      } else {
        setError(result.error || 'Error creando app desde imagen');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando proyecto');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null
    }));
    setImagePreview('');
    setImageInfo(null);
    setAnalysisResult('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/mobile-apps-main')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Image className="w-6 h-6 mr-2 text-blue-600" />
              APARTADO 3: DESDE IMAGEN
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Image className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Crea tu App desde Mockups
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sube tus mockups, wireframes o capturas de pantalla y nuestra IA analizará cada componente 
            para generar una aplicación fiel a tu diseño original.
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start max-w-4xl mx-auto">
            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-green-700">{success}</div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              📁 Configuración del Proyecto
            </h3>

            {/* Project Name */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                📱 Nombre del Proyecto
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Mi App Increíble"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                required
              />
            </div>

            {/* Project Type */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                ⚙️ Tipo de Tecnología
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, projectType: 'flutter' }))}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.projectType === 'flutter'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-2">📱</div>
                    <div className="font-semibold">Flutter</div>
                    <div className="text-sm text-gray-500">App Móvil</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, projectType: 'angular' }))}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.projectType === 'angular'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl mb-2">🌐</div>
                    <div className="font-semibold">Angular</div>
                    <div className="text-sm text-gray-500">App Web</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                🖼️ Subir Imagen de Mockup
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {!imagePreview ? (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Arrastra tu imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      JPG, PNG, GIF, WEBP - Máximo 10MB
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={isCompressing}
                    >
                      {isCompressing ? (
                        <>
                          <Loader className="animate-spin w-4 h-4 mr-2 inline" />
                          Procesando...
                        </>
                      ) : (
                        'Seleccionar Imagen'
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md mb-4"
                    />
                    {imageInfo && (
                      <p className="text-sm text-gray-600 mb-4">
                        {imageInfo.sizeKB} KB • {imageInfo.format.toUpperCase()}
                      </p>
                    )}
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAnalyzeImage}
                disabled={!formData.imageFile || isAnalyzing}
                className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="animate-spin w-5 h-5 mr-3" />
                    Analizando imagen...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-3" />
                    Analizar Imagen
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateProject}
                disabled={!formData.imageFile || !formData.projectName.trim() || isGenerating}
                className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin w-5 h-5 mr-3" />
                    Generando proyecto...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-3" />
                    Generar y Descargar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Analysis Result */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              🔍 Análisis de la Imagen
            </h3>

            {!analysisResult ? (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Sube una imagen y presiona "Analizar Imagen" para ver los componentes detectados
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Componentes Detectados:
                </h4>
                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                  {analysisResult}
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">IA</div>
                <div className="text-sm text-blue-700">Análisis Visual</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                <div className="text-sm text-purple-700">Fidelidad</div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Formatos y Fuentes Soportados
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Formatos de Imagen</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• JPG / JPEG</li>
                <li>• PNG</li>
                <li>• GIF</li>
                <li>• WEBP</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Herramientas de Diseño</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Figma</li>
                <li>• Sketch</li>
                <li>• Adobe XD</li>
                <li>• Wireframes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Tipos de Mockup</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Prototipos Hi-Fi</li>
                <li>• Wireframes</li>
                <li>• Capturas de pantalla</li>
                <li>• Bocetos digitales</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Elementos Detectados</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Botones y formularios</li>
                <li>• Navegación</li>
                <li>• Layouts y grids</li>
                <li>• Componentes UI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppFromImagePage; 