import React from 'react';
import { Code, Shield, Smartphone, Zap, CheckCircle, XCircle } from 'lucide-react';

const MobileApi = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          API para Aplicación iOS
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Documentación completa para integrar tu aplicación iOS con nuestra plataforma educativa
        </p>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-center mb-6">
          <Zap className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-semibold">Comenzando</h2>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Para comenzar a utilizar nuestra API, necesitarás obtener tus credenciales de acceso. 
            Contacta a nuestro equipo de soporte para obtener tu API key.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Base URL</h3>
            <code className="block bg-gray-800 text-white p-3 rounded">
              https://api.conectafuturo.org/v1
            </code>
          </div>

          <h3 className="text-lg font-semibold mb-2">Autenticación</h3>
          <p className="mb-4">
            Todas las peticiones deben incluir tu API key en el header:
          </p>
          <code className="block bg-gray-800 text-white p-3 rounded mb-6">
            Authorization: Bearer YOUR_API_KEY
          </code>
        </div>
      </div>

      {/* Endpoints */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-center mb-6">
          <Code className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-semibold">Endpoints</h2>
        </div>

        <div className="space-y-8">
          {/* Courses Endpoint */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Cursos</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-3">GET</span>
                <code>/courses</code>
              </div>
              <p className="text-gray-600 mb-4">Obtiene la lista de cursos disponibles</p>
              <div className="space-y-2">
                <h4 className="font-medium">Parámetros opcionales:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>page: Número de página</li>
                  <li>limit: Resultados por página</li>
                  <li>category: Filtrar por categoría</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Course Details Endpoint */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Detalles del Curso</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-3">GET</span>
                <code>/courses/{'{courseId}'}</code>
              </div>
              <p className="text-gray-600">Obtiene información detallada de un curso específico</p>
            </div>
          </div>

          {/* User Progress Endpoint */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Progreso del Usuario</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-3">GET</span>
                <code>/users/{'{userId}'}/progress/{'{courseId}'}</code>
              </div>
              <p className="text-gray-600">Obtiene el progreso del usuario en un curso específico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Response Examples */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-semibold">Ejemplos de Respuesta</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Respuesta exitosa</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course-123",
        "title": "Protección de Datos Personales",
        "description": "Curso completo sobre protección de datos...",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "duration": "16 horas",
        "modules": [...]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Respuesta de error</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "AUTH_ERROR",
    "message": "Invalid API key provided"
  }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Status Codes */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center mb-6">
          <Smartphone className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-semibold">Códigos de Estado</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold">200 OK</h3>
              <p className="text-gray-600">La petición se completó exitosamente</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold">401 Unauthorized</h3>
              <p className="text-gray-600">API key inválida o no proporcionada</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold">404 Not Found</h3>
              <p className="text-gray-600">El recurso solicitado no existe</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold">500 Server Error</h3>
              <p className="text-gray-600">Error interno del servidor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApi;