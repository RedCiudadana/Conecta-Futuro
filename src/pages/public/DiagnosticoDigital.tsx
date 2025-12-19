import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Award,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Question {
  id: number;
  dimension: string;
  question: string;
  relatedModules: string;
  options: {
    label: string;
    text: string;
    value: number;
  }[];
}

interface DiagnosticResult {
  totalScore: number;
  maturityLevel: number;
  levelName: string;
  levelDescription: string;
  characteristics: string[];
  recommendedModules: string;
  emoji: string;
  color: string;
}

const DiagnosticoDigital: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'info' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [userInfo, setUserInfo] = useState({ name: '', email: '', businessName: '' });
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      dimension: 'Organización y procesos',
      question: '¿Cómo organizas las tareas diarias de tu negocio?',
      relatedModules: '3, 7',
      options: [
        { label: 'A', text: 'Todo está en mi cabeza o en papel', value: 1 },
        { label: 'B', text: 'Uso WhatsApp o notas del celular', value: 2 },
        { label: 'C', text: 'Uso herramientas digitales para organizarme', value: 3 },
        { label: 'D', text: 'Tengo procesos digitales claros y automatizados', value: 4 }
      ]
    },
    {
      id: 2,
      dimension: 'Organización y procesos',
      question: '¿Cuánto tiempo dedicas a tareas repetitivas (mensajes, registros, cotizaciones)?',
      relatedModules: '3, 7',
      options: [
        { label: 'A', text: 'Mucho tiempo, casi todos los días', value: 1 },
        { label: 'B', text: 'Bastante tiempo', value: 2 },
        { label: 'C', text: 'Poco tiempo', value: 3 },
        { label: 'D', text: 'Muy poco, la mayoría está automatizado', value: 4 }
      ]
    },
    {
      id: 3,
      dimension: 'Ventas y relación con clientes',
      question: '¿Cómo gestionas a tus clientes y ventas?',
      relatedModules: '4, 5',
      options: [
        { label: 'A', text: 'No llevo registro', value: 1 },
        { label: 'B', text: 'Solo mensajes y llamadas', value: 2 },
        { label: 'C', text: 'Tengo registros digitales', value: 3 },
        { label: 'D', text: 'Uso herramientas para seguimiento y análisis', value: 4 }
      ]
    },
    {
      id: 4,
      dimension: 'Ventas y relación con clientes',
      question: '¿Cómo atiendes a tus clientes?',
      relatedModules: '4, 7',
      options: [
        { label: 'A', text: 'Respondo cuando puedo', value: 1 },
        { label: 'B', text: 'Respondo manualmente', value: 2 },
        { label: 'C', text: 'Uso mensajes predeterminados', value: 3 },
        { label: 'D', text: 'Tengo respuestas automáticas y flujos', value: 4 }
      ]
    },
    {
      id: 5,
      dimension: 'Presencia digital',
      question: '¿Tu negocio tiene presencia en internet?',
      relatedModules: '5',
      options: [
        { label: 'A', text: 'No', value: 1 },
        { label: 'B', text: 'Solo WhatsApp', value: 2 },
        { label: 'C', text: 'Redes sociales activas', value: 3 },
        { label: 'D', text: 'Redes + catálogo o página', value: 4 }
      ]
    },
    {
      id: 6,
      dimension: 'Presencia digital',
      question: '¿Cómo creas contenido para promocionar tu negocio?',
      relatedModules: '4, 5',
      options: [
        { label: 'A', text: 'No creo contenido', value: 1 },
        { label: 'B', text: 'Publico ocasionalmente', value: 2 },
        { label: 'C', text: 'Tengo contenido planificado', value: 3 },
        { label: 'D', text: 'Uso herramientas digitales o IA', value: 4 }
      ]
    },
    {
      id: 7,
      dimension: 'Gestión financiera',
      question: '¿Cómo llevas el control de ingresos y gastos?',
      relatedModules: '6',
      options: [
        { label: 'A', text: 'No llevo control', value: 1 },
        { label: 'B', text: 'En libreta', value: 2 },
        { label: 'C', text: 'En Excel o herramientas digitales', value: 3 },
        { label: 'D', text: 'Analizo datos y hago proyecciones', value: 4 }
      ]
    },
    {
      id: 8,
      dimension: 'Gestión financiera',
      question: '¿Cómo controlas tu inventario o servicios?',
      relatedModules: '6, 7',
      options: [
        { label: 'A', text: 'No llevo control', value: 1 },
        { label: 'B', text: 'Control mental o en papel', value: 2 },
        { label: 'C', text: 'Control digital básico', value: 3 },
        { label: 'D', text: 'Control digital con alertas', value: 4 }
      ]
    },
    {
      id: 9,
      dimension: 'Uso de tecnología',
      question: '¿Usas herramientas digitales o IA en tu negocio?',
      relatedModules: '3, 7',
      options: [
        { label: 'A', text: 'No uso', value: 1 },
        { label: 'B', text: 'Uso herramientas básicas', value: 2 },
        { label: 'C', text: 'Uso varias herramientas', value: 3 },
        { label: 'D', text: 'Uso IA para apoyar decisiones', value: 4 }
      ]
    },
    {
      id: 10,
      dimension: 'Uso de tecnología',
      question: '¿Tu negocio tiene un plan para crecer usando tecnología?',
      relatedModules: '9',
      options: [
        { label: 'A', text: 'No', value: 1 },
        { label: 'B', text: 'Tengo ideas, pero no plan', value: 2 },
        { label: 'C', text: 'Tengo un plan básico', value: 3 },
        { label: 'D', text: 'Tengo una ruta digital clara', value: 4 }
      ]
    }
  ];

  const calculateResult = (answers: { [key: number]: number }): DiagnosticResult => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    let maturityLevel: number;
    let levelName: string;
    let levelDescription: string;
    let characteristics: string[];
    let recommendedModules: string;
    let emoji: string;
    let color: string;

    if (totalScore >= 10 && totalScore <= 17) {
      maturityLevel = 1;
      levelName = 'Inicial';
      levelDescription = 'Mi negocio apenas empieza en lo digital';
      characteristics = [
        'Procesos manuales',
        'Poco uso de tecnología',
        'Mucho esfuerzo operativo'
      ];
      recommendedModules = '1, 2, 3, 4, 5';
      emoji = '🔴';
      color = 'red';
    } else if (totalScore >= 18 && totalScore <= 26) {
      maturityLevel = 2;
      levelName = 'En Proceso';
      levelDescription = 'Mi negocio ya usa tecnología, pero puede mejorar';
      characteristics = [
        'Uso básico de herramientas',
        'Presencia digital parcial',
        'Poca automatización'
      ];
      recommendedModules = '3, 4, 5, 6, 7';
      emoji = '🟠';
      color = 'orange';
    } else if (totalScore >= 27 && totalScore <= 34) {
      maturityLevel = 3;
      levelName = 'Digital Activo';
      levelDescription = 'Mi negocio está digitalizado y listo para crecer';
      characteristics = [
        'Procesos digitales',
        'Ventas organizadas',
        'Uso incipiente de IA'
      ];
      recommendedModules = '6, 7, 8, 9';
      emoji = '🟡';
      color = 'yellow';
    } else {
      maturityLevel = 4;
      levelName = 'Avanzado';
      levelDescription = 'Mi negocio usa tecnología de forma estratégica';
      characteristics = [
        'Automatización',
        'Uso de IA',
        'Toma de decisiones basada en datos'
      ];
      recommendedModules = '7, 8, 9 (nivel avanzado / mentoría)';
      emoji = '🟢';
      color = 'green';
    }

    return {
      totalScore,
      maturityLevel,
      levelName,
      levelDescription,
      characteristics,
      recommendedModules,
      emoji,
      color
    };
  };

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setCurrentStep('info');
      }, 300);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const diagnosticResult = calculateResult(answers);
    setResult(diagnosticResult);

    try {
      const answersArray = questions.map(q => ({
        question_id: q.id,
        question: q.question,
        answer_value: answers[questions.indexOf(q)],
        dimension: q.dimension
      }));

      await supabase.from('diagnostic_results').insert({
        name: userInfo.name || null,
        email: userInfo.email || null,
        business_name: userInfo.businessName || null,
        answers: answersArray,
        total_score: diagnosticResult.totalScore,
        maturity_level: diagnosticResult.maturityLevel,
        recommended_modules: diagnosticResult.recommendedModules.split(', ')
      });
    } catch (error) {
      console.error('Error saving diagnostic:', error);
    }

    setIsSubmitting(false);
    setCurrentStep('result');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <BarChart3 className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
                Diagnóstico de Madurez Digital
              </h1>
              <p className="text-xl text-primary-100">
                Digitaliza tu PyME – Conecta Futuro
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
              <h2 className="text-2xl font-bold mb-4">¿Para qué sirve este diagnóstico?</h2>
              <p className="mb-4 text-primary-100">Este diagnóstico te ayudará a:</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Conocer el nivel digital actual de tu negocio</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Identificar áreas de mejora</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Recibir una ruta de formación personalizada</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>Aprovechar mejor el programa Digitaliza tu PyME</span>
                </li>
              </ul>

              <div className="bg-blue-900/30 border-l-4 border-blue-300 p-4 rounded">
                <p className="text-blue-100">
                  <strong>Importante:</strong> No hay respuestas correctas o incorrectas.
                  Responde según la realidad de tu negocio hoy.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
              <h3 className="text-xl font-bold mb-4">🧩 Dimensiones del diagnóstico</h3>
              <p className="text-primary-100 mb-4">Las 10 preguntas evalúan 5 áreas clave:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Organización y procesos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Ventas y relación con clientes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Presencia digital</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Gestión financiera</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Uso de tecnología e IA</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep('questions')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-primary-600 font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg"
              >
                Iniciar diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <p className="text-primary-100 text-sm mt-4">
                Tiempo estimado: 5 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    const question = questions[currentQuestion];
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-sm font-semibold text-primary-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                  {question.dimension}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
                  {question.question}
                </h2>
                <p className="text-sm text-gray-500">
                  Módulos relacionados: {question.relatedModules}
                </p>
              </div>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion] === option.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                          answers[currentQuestion] === option.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {option.label}
                      </div>
                      <span className="text-gray-900 pt-2">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Anterior
                </button>

                {currentQuestion === questions.length - 1 && answers[currentQuestion] && (
                  <button
                    onClick={() => setCurrentStep('info')}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'info') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Diagnóstico completado!
                </h2>
                <p className="text-gray-600">
                  Para recibir tus resultados, completa la siguiente información (opcional)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de tu negocio
                  </label>
                  <input
                    type="text"
                    value={userInfo.businessName}
                    onChange={(e) => setUserInfo({ ...userInfo, businessName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Mi PyME"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setCurrentStep('questions')}
                  className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Ver resultados'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Esta información es opcional y se usa únicamente para mejorar el programa
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'result' && result) {
    const levelColors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-900',
        badge: 'bg-red-100 text-red-800'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-900',
        badge: 'bg-orange-100 text-orange-800'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-500',
        text: 'text-yellow-900',
        badge: 'bg-yellow-100 text-yellow-800'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-900',
        badge: 'bg-green-100 text-green-800'
      }
    };

    const colors = levelColors[result.color as keyof typeof levelColors];

    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Award className="w-20 h-20 text-primary-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Tus Resultados
              </h1>
              <p className="text-xl text-gray-600">
                Diagnóstico de Madurez Digital
              </p>
            </div>

            <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 border-l-8 ${colors.border}`}>
              <div className="flex items-start gap-4 mb-6">
                <span className="text-5xl">{result.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Nivel {result.maturityLevel} – {result.levelName}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                      {result.totalScore} / 40 puntos
                    </span>
                  </div>
                  <p className="text-xl text-gray-600 italic mb-4">
                    "{result.levelDescription}"
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary-600" />
                    Características de tu negocio
                  </h3>
                  <ul className="space-y-2">
                    {result.characteristics.map((char, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-600" />
                    Ruta recomendada
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Módulos sugeridos para ti:
                  </p>
                  <div className={`p-4 rounded-lg ${colors.bg}`}>
                    <p className={`font-bold text-lg ${colors.text}`}>
                      Módulos {result.recommendedModules}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white mb-8">
              <div className="flex items-start gap-4">
                <Sparkles className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3">
                    Tu negocio tiene un gran potencial de mejora
                  </h3>
                  <p className="text-primary-100 text-lg">
                    En el programa <strong>Digitaliza tu PyME</strong> aprenderás paso a paso cómo avanzar desde tu nivel actual hacia un negocio más organizado, productivo y competitivo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/digitaliza-tu-pyme"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-center"
              >
                <TrendingUp className="w-5 h-5" />
                Ver programa completo
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors text-center"
              >
                Inscribirme ahora
              </Link>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => window.print()}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Imprimir o guardar resultados
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DiagnosticoDigital;
