import React, { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, Shield, TrendingUp, Users, BookOpen, Info, X } from 'lucide-react';
import { aiTools, categories, userTypes, riskLevels, maturityLevels } from '../../data/aiToolsData';
import { FilterState } from '../../types/aiTool';

const DirectorioIA: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    userType: '',
    riskLevel: '',
    maturityLevel: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showMaturityModal, setShowMaturityModal] = useState(false);

  const filteredTools = useMemo(() => {
    return aiTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                           tool.useCase.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesCategory = !filters.category || tool.category === filters.category;
      const matchesUserType = !filters.userType || tool.targetUsers.includes(filters.userType);
      const matchesRiskLevel = !filters.riskLevel || tool.riskLevel === filters.riskLevel;
      const matchesMaturityLevel = !filters.maturityLevel || tool.maturityLevel === filters.maturityLevel;

      return matchesSearch && matchesCategory && matchesUserType && matchesRiskLevel && matchesMaturityLevel;
    });
  }, [filters]);

  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: '',
      userType: '',
      riskLevel: '',
      maturityLevel: ''
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Bajo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Alto':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMaturityLevelColor = (level: string) => {
    switch (level) {
      case 'Básico':
        return 'bg-blue-50 text-blue-700';
      case 'Intermedio':
        return 'bg-blue-100 text-blue-800';
      case 'Avanzado':
        return 'bg-blue-200 text-blue-900';
      case 'Estratégico':
        return 'bg-blue-300 text-blue-950';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Risk Level Info Modal */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Shield className="mr-3 text-blue-600" size={28} />
                Niveles de Riesgo de Datos
              </h3>
              <button
                onClick={() => setShowRiskModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-600">
                El nivel de riesgo indica qué tan sensible puede ser el uso de la herramienta con datos institucionales o ciudadanos.
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Bajo - Uso con datos públicos
                  </h4>
                  <p className="text-green-800 text-sm mb-2">
                    Estas herramientas son seguras para usar con información pública y no sensible.
                  </p>
                  <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                    <li>Información ya publicada o de dominio público</li>
                    <li>Datos estadísticos agregados sin identificadores personales</li>
                    <li>Contenido educativo y comunicacional público</li>
                    <li>Análisis de datos abiertos gubernamentales</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Medio - Requiere anonimización
                  </h4>
                  <p className="text-yellow-800 text-sm mb-2">
                    Se pueden usar con precaución, asegurando que los datos estén anonimizados.
                  </p>
                  <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                    <li>Requiere eliminar datos personales antes de usarlos</li>
                    <li>Preferir versiones empresariales con acuerdos de privacidad</li>
                    <li>Revisar políticas de retención de datos de la herramienta</li>
                    <li>Usar con datos internos no clasificados</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <h4 className="font-bold text-red-900 mb-2 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Alto - Requiere versión enterprise
                  </h4>
                  <p className="text-red-800 text-sm mb-2">
                    Solo deben usarse versiones empresariales con contratos específicos de protección de datos.
                  </p>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                    <li>NO usar versiones gratuitas con datos institucionales</li>
                    <li>Exigir contratos de procesamiento de datos (DPA)</li>
                    <li>Verificar cumplimiento de normativas locales</li>
                    <li>Implementar solo con aprobación de seguridad institucional</li>
                    <li>Evitar datos personales sensibles sin autorización expresa</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Recomendación:</strong> Siempre consulte con el equipo de seguridad y protección de datos de su institución antes de implementar cualquier herramienta de IA, especialmente si manejará información sensible o datos personales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maturity Level Info Modal */}
      {showMaturityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="mr-3 text-blue-600" size={28} />
                Niveles de Madurez Digital
              </h3>
              <button
                onClick={() => setShowMaturityModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-600">
                El nivel de madurez indica la complejidad técnica y organizacional requerida para implementar exitosamente la herramienta.
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Básico - Adopción inmediata
                  </h4>
                  <p className="text-blue-800 text-sm mb-2">
                    Herramientas listas para usar sin necesidad de infraestructura compleja.
                  </p>
                  <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                    <li>Interfaz intuitiva, fácil de aprender</li>
                    <li>No requiere conocimientos técnicos avanzados</li>
                    <li>Implementación rápida (días o semanas)</li>
                    <li>Ideal para pruebas piloto y casos de uso específicos</li>
                    <li>Capacitación mínima requerida</li>
                  </ul>
                </div>

                <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Intermedio - Requiere coordinación
                  </h4>
                  <p className="text-blue-800 text-sm mb-2">
                    Necesita planificación y coordinación entre áreas para implementación exitosa.
                  </p>
                  <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                    <li>Requiere capacitación formal del personal</li>
                    <li>Integración con sistemas existentes</li>
                    <li>Configuración y personalización necesarias</li>
                    <li>Implementación en fases (1-3 meses)</li>
                    <li>Soporte técnico interno o externo recomendado</li>
                  </ul>
                </div>

                <div className="bg-blue-200 border-l-4 border-blue-600 p-4 rounded">
                  <h4 className="font-bold text-blue-950 mb-2 flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Avanzado - Requiere equipo especializado
                  </h4>
                  <p className="text-blue-900 text-sm mb-2">
                    Implementación compleja que requiere recursos técnicos especializados.
                  </p>
                  <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                    <li>Equipo técnico dedicado necesario</li>
                    <li>Infraestructura tecnológica robusta</li>
                    <li>Integración profunda con sistemas institucionales</li>
                    <li>Proyecto de implementación estructurado (3-6 meses)</li>
                    <li>Gestión del cambio organizacional</li>
                  </ul>
                </div>

                <div className="bg-blue-300 border-l-4 border-blue-700 p-4 rounded">
                  <h4 className="font-bold text-blue-950 mb-2 flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Estratégico - Transformación institucional
                  </h4>
                  <p className="text-blue-900 text-sm mb-2">
                    Soluciones empresariales que requieren decisión de alto nivel y transformación organizacional.
                  </p>
                  <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
                    <li>Aprobación y patrocinio de alta dirección</li>
                    <li>Inversión significativa de recursos</li>
                    <li>Cambios en procesos y estructura organizacional</li>
                    <li>Implementación de largo plazo (6+ meses)</li>
                    <li>Requiere arquitectura empresarial definida</li>
                    <li>Medición de impacto y ROI institucional</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Recomendación:</strong> Comience con herramientas de nivel básico o intermedio para ganar experiencia y generar casos de éxito antes de implementar soluciones más complejas. La madurez digital se construye gradualmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Directorio de Herramientas de Inteligencia Artificial para el Sector Público
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Explora más de 50 herramientas de IA que pueden mejorar la eficiencia, transparencia y calidad de los servicios públicos.
          </p>
          <button
            onClick={scrollToTools}
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
          >
            Explorar herramientas
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Last Update Info */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-800">Última actualización:</span> 16 de febrero de 2026
          </p>
        </div>

        {/* Filters Section */}
        <div id="tools-section" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
              <Filter className="mr-2" size={28} />
              Filtros de Búsqueda
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            </button>
            {(filters.searchQuery || filters.category || filters.userType || filters.riskLevel || filters.maturityLevel) && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por palabra clave..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* User Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                <select
                  value={filters.userType}
                  onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los usuarios</option>
                  {userTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Risk Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Nivel de Riesgo</span>
                  <button
                    onClick={() => setShowRiskModal(true)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Más información sobre niveles de riesgo"
                  >
                    <Info size={18} />
                  </button>
                </label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los niveles</option>
                  {riskLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Maturity Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <span>Nivel de Madurez</span>
                  <button
                    onClick={() => setShowMaturityModal(true)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Más información sobre niveles de madurez"
                  >
                    <Info size={18} />
                  </button>
                </label>
                <select
                  value={filters.maturityLevel}
                  onChange={(e) => setFilters({ ...filters, maturityLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los niveles</option>
                  {maturityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-blue-600">{filteredTools.length}</span> de {aiTools.length} herramientas
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={tool.logoUrl}
                    alt={`${tool.name} logo`}
                    className="w-16 h-16 object-contain rounded-lg border border-gray-200 p-2 bg-white"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.name}</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {tool.category}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-3">{tool.description}</p>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Caso de uso:</p>
                <p className="text-sm text-gray-600">{tool.useCase}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRiskLevelColor(tool.riskLevel)}`}>
                  <Shield size={12} className="mr-1" />
                  {tool.riskLevel}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getMaturityLevelColor(tool.maturityLevel)}`}>
                  <TrendingUp size={12} className="mr-1" />
                  {tool.maturityLevel}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                  <Users size={14} className="mr-1" />
                  Usuarios:
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.targetUsers.map((user, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {user}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Visitar sitio oficial
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron herramientas</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Educational Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-8 mt-12">
          <div className="flex items-center mb-6">
            <BookOpen className="text-blue-700 mr-3" size={32} />
            <h2 className="text-3xl font-bold text-gray-800">
              Recomendaciones para el uso responsable de IA en el sector público
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Protección de Datos Personales</h3>
                  <p className="text-gray-600 text-sm">
                    No ingresar datos personales sensibles sin autorización expresa. Verificar cumplimiento de normativas de protección de datos antes de usar cualquier herramienta.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Versiones Enterprise</h3>
                  <p className="text-gray-600 text-sm">
                    Priorizar versiones empresariales con acuerdos de procesamiento de datos y garantías de seguridad para uso institucional.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Cumplimiento Normativo</h3>
                  <p className="text-gray-600 text-sm">
                    Asegurar que el uso de herramientas de IA cumpla con las regulaciones locales, nacionales e internacionales aplicables al sector público.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Uso Ético y Transparente</h3>
                  <p className="text-gray-600 text-sm">
                    Promover el uso ético de la IA, evitando sesgos y garantizando transparencia en la toma de decisiones asistidas por algoritmos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Capacitación Institucional</h3>
                  <p className="text-gray-600 text-sm">
                    Capacitar a funcionarios antes de implementación institucional. Asegurar que el personal comprenda las capacidades y limitaciones de las herramientas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  6
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Evaluación Continua</h3>
                  <p className="text-gray-600 text-sm">
                    Establecer mecanismos de evaluación y monitoreo continuo del desempeño y impacto de las herramientas de IA implementadas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-600 text-white rounded-lg">
            <p className="text-sm font-medium text-center">
              Este directorio es una guía de referencia. Cada institución debe realizar su propia evaluación de idoneidad, seguridad y cumplimiento normativo antes de implementar cualquier herramienta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorioIA;
