import { useState, useMemo } from 'react';
import { Search, X, Copy, Check, AlertTriangle, BookOpen, Lightbulb, Shield, Filter } from 'lucide-react';
import { promptsData, categories, levels, risks } from '../../data/promptsData';
import { Prompt, RiskLevel, PromptLevel } from '../../types/prompt';

const BancoPrompts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<PromptLevel | ''>('');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | ''>('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const filteredPrompts = useMemo(() => {
    return promptsData.filter(prompt => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
      const matchesLevel = !selectedLevel || prompt.level === selectedLevel;
      const matchesRisk = !selectedRisk || prompt.risk === selectedRisk;

      return matchesSearch && matchesCategory && matchesLevel && matchesRisk;
    });
  }, [searchTerm, selectedCategory, selectedLevel, selectedRisk]);

  const handleCopyPrompt = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'Verde':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Amarillo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Rojo':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getLevelColor = (level: PromptLevel) => {
    switch (level) {
      case 'Basico':
        return 'bg-blue-100 text-blue-800';
      case 'Intermedio':
        return 'bg-purple-100 text-purple-800';
      case 'Avanzado':
        return 'bg-orange-100 text-orange-800';
    }
  };

  const scrollToPrompts = () => {
    document.getElementById('prompts-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Banco de Prompts para Funcionarios Públicos
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Prompts prácticos y estructurados para mejorar la redacción, análisis, automatización y toma de decisiones en el sector público.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToPrompts}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Explorar Prompts
              </button>
              <button
                onClick={() => setShowGuide(true)}
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors border-2 border-white"
              >
                Guía de Uso Responsable
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">¿Qué es un prompt y por qué es importante?</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <BookOpen className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">¿Qué es un prompt?</h3>
                  <p className="text-gray-600 text-sm">
                    Es una instrucción estructurada que le das a una herramienta de IA para obtener resultados específicos y útiles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">¿Por qué estructurarlo bien?</h3>
                  <p className="text-gray-600 text-sm">
                    Un prompt bien redactado te ahorra tiempo, mejora la calidad del resultado y te ayuda a trabajar de forma más eficiente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">¿Cómo ayuda en tu trabajo?</h3>
                  <p className="text-gray-600 text-sm">
                    Facilita tareas cotidianas como redactar oficios, resumir informes, planificar reuniones y analizar datos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Antes de usar IA: no ingresar datos personales sensibles</h3>
                  <p className="text-red-700 text-sm">
                    No ingreses DPI, expedientes, datos médicos, información confidencial o cualquier dato personal protegido.
                    Siempre anonimiza la información antes de usar herramientas de IA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div id="prompts-section" className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Filtros de Búsqueda</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por palabra clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as PromptLevel | '')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los niveles</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Riesgo</label>
                  <select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | '')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los riesgos</option>
                    {risks.map(risk => (
                      <option key={risk} value={risk}>{risk}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(searchTerm || selectedCategory || selectedLevel || selectedRisk) && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-gray-600">
                    Mostrando {filteredPrompts.length} de {promptsData.length} prompts
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedLevel('');
                      setSelectedRisk('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg pr-2">{prompt.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium border flex-shrink-0 ${getRiskColor(prompt.risk)}`}>
                    {prompt.risk}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prompt.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {prompt.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(prompt.level)}`}>
                    {prompt.level}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrompt(prompt);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ver Prompt
                </button>
              </div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron prompts con los filtros seleccionados.</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cómo usar estos prompts correctamente</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Check className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Siempre revisar el resultado</h3>
                    <p className="text-gray-600 text-sm">La IA es una herramienta de apoyo. Revisa y ajusta el contenido generado antes de usarlo.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <AlertTriangle className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">No confiar ciegamente en cifras</h3>
                    <p className="text-gray-600 text-sm">Verifica siempre los datos numéricos y estadísticas con fuentes oficiales.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Shield className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">No usar con datos sensibles</h3>
                    <p className="text-gray-600 text-sm">Nunca ingreses información personal, confidencial o protegida por ley.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <BookOpen className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Adaptar al contexto institucional</h3>
                    <p className="text-gray-600 text-sm">Personaliza el texto según el tono y formato de tu institución.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Check className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Verificar coherencia legal</h3>
                    <p className="text-gray-600 text-sm">Asegúrate que el contenido cumpla con las normativas y leyes aplicables.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Lightbulb className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Usar como punto de partida</h3>
                    <p className="text-gray-600 text-sm">Los prompts son plantillas. Ajústalas según tus necesidades específicas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPrompt.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {selectedPrompt.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedPrompt.level)}`}>
                    {selectedPrompt.level}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(selectedPrompt.risk)}`}>
                    {selectedPrompt.risk}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-600">{selectedPrompt.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Prompt Completo</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPrompt.prompt_text}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Inputs Requeridos</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedPrompt.inputs.map((input, idx) => (
                    <li key={idx} className="text-gray-600">{input}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Formato de Salida</h3>
                <p className="text-gray-600">{selectedPrompt.output_format}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Ejemplo de Caso de Uso</h3>
                <p className="text-gray-600">{selectedPrompt.example_use_case}</p>
              </div>

              <button
                onClick={() => handleCopyPrompt(selectedPrompt.prompt_text, selectedPrompt.id)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                {copiedId === selectedPrompt.id ? (
                  <>
                    <Check size={20} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Copiar Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-800">Guía de Uso Responsable de IA</h2>
              <button
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h3 className="font-semibold text-red-800 mb-2">Protección de Datos Personales</h3>
                <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                  <li>NUNCA ingreses DPI, nombres completos o datos de identificación personal</li>
                  <li>NUNCA ingreses expedientes, casos legales o información confidencial</li>
                  <li>NUNCA ingreses datos médicos, financieros o información sensible</li>
                  <li>SIEMPRE anonimiza la información antes de usar IA</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Principios de Uso Responsable</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">1. Transparencia</h4>
                    <p className="text-gray-600 text-sm">Indica cuando un contenido ha sido generado con apoyo de IA.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">2. Verificación</h4>
                    <p className="text-gray-600 text-sm">Siempre verifica datos, cifras y referencias antes de usar el contenido.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">3. Responsabilidad</h4>
                    <p className="text-gray-600 text-sm">Eres responsable del contenido final que publiques o compartas.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">4. Contexto Institucional</h4>
                    <p className="text-gray-600 text-sm">Adapta el contenido al tono, formato y normativas de tu institución.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">5. Mejora Continua</h4>
                    <p className="text-gray-600 text-sm">Aprende de los resultados y ajusta los prompts según tu experiencia.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Entiende los Niveles de Riesgo</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                    <div className="bg-green-500 rounded-full w-3 h-3 mt-1"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Verde - Uso Seguro</h4>
                      <p className="text-gray-600 text-sm">Puedes usar con datos públicos y generales sin riesgo.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded">
                    <div className="bg-yellow-500 rounded-full w-3 h-3 mt-1"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Amarillo - Requiere Anonimización</h4>
                      <p className="text-gray-600 text-sm">Debes anonimizar datos antes de usar este prompt.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded">
                    <div className="bg-red-500 rounded-full w-3 h-3 mt-1"></div>
                    <div>
                      <h4 className="font-medium text-gray-800">Rojo - No Usar con Datos Sensibles</h4>
                      <p className="text-gray-600 text-sm">Nunca uses este prompt con información confidencial o protegida.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold text-gray-800 mb-2">Recuerda</h3>
                <p className="text-gray-600 text-sm">
                  La IA es una herramienta de apoyo, no un sustituto del criterio profesional.
                  Úsala de manera ética, responsable y siempre dentro del marco legal aplicable.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BancoPrompts;
