import React, { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, Shield, TrendingUp, Users, BookOpen } from 'lucide-react';
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Riesgo</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Madurez</label>
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
              <div className="flex items-start justify-between mb-4">
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
