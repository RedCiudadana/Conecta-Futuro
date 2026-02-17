import { Prompt } from '../types/prompt';

export const promptsData: Prompt[] = [
  {
    id: 1,
    title: "Oficio institucional profesional",
    category: "Redacción Institucional",
    level: "Basico",
    risk: "Verde",
    description: "Genera un oficio formal estructurado.",
    prompt_text: "Actúa como experto en comunicación gubernamental. Redacta un oficio formal incluyendo asunto (2 opciones), contexto breve, solicitud en bullets, plazo específico y cierre institucional. No inventes datos.",
    inputs: ["Destinatario", "Institución", "Objetivo", "Plazo"],
    output_format: "Oficio estructurado",
    example_use_case: "Solicitud interinstitucional"
  },
  {
    id: 2,
    title: "Resumen ejecutivo estratégico",
    category: "Alta Dirección",
    level: "Intermedio",
    risk: "Verde",
    description: "Resume documentos largos en formato ejecutivo.",
    prompt_text: "Resume el documento en 10 bullets ejecutivos, 3 decisiones clave y 3 riesgos. No agregues información externa.",
    inputs: ["Documento"],
    output_format: "Resumen ejecutivo estructurado",
    example_use_case: "Informe técnico extenso"
  },
  {
    id: 3,
    title: "Minuta profesional con tabla de acuerdos",
    category: "Gestión de Reuniones",
    level: "Basico",
    risk: "Verde",
    description: "Convierte notas en minuta estructurada.",
    prompt_text: "Convierte estas notas en minuta institucional con tabla de acuerdos (tarea, responsable, fecha, entregable).",
    inputs: ["Notas"],
    output_format: "Minuta estructurada",
    example_use_case: "Reunión interinstitucional"
  },
  {
    id: 4,
    title: "Indicadores SMART",
    category: "Gestión con Datos",
    level: "Intermedio",
    risk: "Verde",
    description: "Genera indicadores SMART completos.",
    prompt_text: "Genera 6 indicadores SMART con fórmula, fuente, frecuencia y responsable.",
    inputs: ["Objetivo institucional"],
    output_format: "Tabla de indicadores",
    example_use_case: "Programa público"
  },
  {
    id: 5,
    title: "Lenguaje ciudadano claro",
    category: "Comunicación Pública",
    level: "Basico",
    risk: "Verde",
    description: "Simplifica textos técnicos.",
    prompt_text: "Reescribe el texto en lenguaje ciudadano claro con pasos numerados y FAQ.",
    inputs: ["Texto técnico"],
    output_format: "Texto simplificado",
    example_use_case: "Reglamento municipal"
  },
  {
    id: 6,
    title: "Evaluación de herramienta de IA",
    category: "Gobernanza de IA",
    level: "Avanzado",
    risk: "Amarillo",
    description: "Evalúa riesgos y madurez de herramienta digital.",
    prompt_text: "Evalúa esta herramienta considerando datos procesados, riesgos de privacidad y recomendación de uso.",
    inputs: ["Enlace herramienta"],
    output_format: "Tabla de evaluación",
    example_use_case: "Adopción institucional IA"
  },
  {
    id: 7,
    title: "Términos de Referencia (TDR)",
    category: "Compras Públicas",
    level: "Avanzado",
    risk: "Verde",
    description: "Genera TDR completos.",
    prompt_text: "Redacta TDR incluyendo objetivo, alcance, entregables, cronograma y criterios ponderados.",
    inputs: ["Servicio requerido"],
    output_format: "Documento estructurado",
    example_use_case: "Contratación consultoría"
  },
  {
    id: 8,
    title: "Matriz de riesgos institucionales",
    category: "Gestión de Riesgos",
    level: "Intermedio",
    risk: "Verde",
    description: "Identifica riesgos operativos y legales.",
    prompt_text: "Clasifica riesgos en operativos, legales, financieros y reputacionales incluyendo mitigación.",
    inputs: ["Descripción proyecto"],
    output_format: "Tabla de riesgos",
    example_use_case: "Implementación digital"
  },
  {
    id: 9,
    title: "Diseño de Dashboard institucional",
    category: "Analítica Pública",
    level: "Intermedio",
    risk: "Verde",
    description: "Propone estructura de tablero.",
    prompt_text: "Diseña dashboard con KPIs, visualizaciones y preguntas clave que responde.",
    inputs: ["Programa"],
    output_format: "Estructura dashboard",
    example_use_case: "Ejecución presupuestaria"
  },
  {
    id: 10,
    title: "Plan de automatización básica",
    category: "Transformación Digital",
    level: "Intermedio",
    risk: "Verde",
    description: "Propone automatizaciones simples.",
    prompt_text: "Propón 5 automatizaciones con herramienta, impacto y complejidad.",
    inputs: ["Institución"],
    output_format: "Lista estructurada",
    example_use_case: "Municipalidad"
  },
  {
    id: 11,
    title: "Respuesta a solicitud ciudadana",
    category: "Atención Ciudadana",
    level: "Basico",
    risk: "Verde",
    description: "Genera respuesta profesional a consulta ciudadana.",
    prompt_text: "Redacta respuesta formal a solicitud ciudadana incluyendo: saludo cordial, resumen de solicitud, respuesta clara en bullets, base legal si aplica, pasos a seguir y cierre institucional.",
    inputs: ["Solicitud ciudadana", "Institución"],
    output_format: "Respuesta estructurada",
    example_use_case: "Solicitud de acceso a información"
  },
  {
    id: 12,
    title: "Análisis de viabilidad técnica",
    category: "Transformación Digital",
    level: "Avanzado",
    risk: "Verde",
    description: "Evalúa viabilidad de proyecto tecnológico.",
    prompt_text: "Analiza viabilidad técnica del proyecto considerando: recursos necesarios, complejidad técnica, dependencias, riesgos tecnológicos, alternativas y recomendación final.",
    inputs: ["Descripción proyecto", "Recursos disponibles"],
    output_format: "Informe de viabilidad",
    example_use_case: "Sistema de gestión municipal"
  },
  {
    id: 13,
    title: "Comunicado de prensa institucional",
    category: "Comunicación Pública",
    level: "Intermedio",
    risk: "Verde",
    description: "Redacta comunicado de prensa profesional.",
    prompt_text: "Redacta comunicado de prensa incluyendo: título atractivo, lead con 5W+H, cuerpo con datos clave, declaraciones entrecomilladas, información de contacto y llamado a la acción.",
    inputs: ["Evento o noticia", "Institución", "Vocero"],
    output_format: "Comunicado estructurado",
    example_use_case: "Lanzamiento de programa público"
  },
  {
    id: 14,
    title: "Plan de capacitación institucional",
    category: "Gestión de Reuniones",
    level: "Intermedio",
    risk: "Verde",
    description: "Diseña plan de capacitación estructurado.",
    prompt_text: "Diseña plan de capacitación incluyendo: objetivos SMART, contenidos por módulo, metodología, duración, recursos necesarios, evaluación y cronograma.",
    inputs: ["Tema capacitación", "Público objetivo", "Duración total"],
    output_format: "Plan estructurado",
    example_use_case: "Capacitación en transformación digital"
  },
  {
    id: 15,
    title: "Análisis comparativo de proveedores",
    category: "Compras Públicas",
    level: "Intermedio",
    risk: "Amarillo",
    description: "Compara ofertas de proveedores objetivamente.",
    prompt_text: "Crea matriz comparativa de proveedores evaluando: cumplimiento técnico, experiencia, propuesta económica, garantías y puntuación total ponderada. No incluir nombres reales de empresas.",
    inputs: ["Criterios requeridos", "Número de proveedores"],
    output_format: "Matriz comparativa",
    example_use_case: "Selección de proveedor de software"
  },
  {
    id: 16,
    title: "Política institucional de datos",
    category: "Gobernanza de IA",
    level: "Avanzado",
    risk: "Amarillo",
    description: "Redacta política de manejo de datos.",
    prompt_text: "Redacta política de datos institucional incluyendo: principios, alcance, roles y responsabilidades, clasificación de datos, protocolos de seguridad, sanciones y vigencia.",
    inputs: ["Tipo de institución", "Marco legal aplicable"],
    output_format: "Documento de política",
    example_use_case: "Implementación de gobernanza de datos"
  },
  {
    id: 17,
    title: "Informe de transparencia ciudadana",
    category: "Comunicación Pública",
    level: "Basico",
    risk: "Verde",
    description: "Genera reporte de gestión para ciudadanía.",
    prompt_text: "Crea informe ciudadano con lenguaje claro incluyendo: logros principales con cifras, comparación período anterior, gráficos sugeridos, testimonios y compromisos pendientes.",
    inputs: ["Logros del período", "Datos cuantitativos"],
    output_format: "Informe ciudadano",
    example_use_case: "Rendición de cuentas trimestral"
  },
  {
    id: 18,
    title: "Checklist de ciberseguridad básica",
    category: "Gestión de Riesgos",
    level: "Basico",
    risk: "Verde",
    description: "Lista verificación de seguridad informática.",
    prompt_text: "Genera checklist de ciberseguridad para institución pública incluyendo: contraseñas, copias de seguridad, actualizaciones, accesos, correo institucional y capacitación.",
    inputs: ["Tipo de institución"],
    output_format: "Checklist verificable",
    example_use_case: "Auditoría básica de seguridad"
  },
  {
    id: 19,
    title: "Roadmap de proyecto digital",
    category: "Transformación Digital",
    level: "Avanzado",
    risk: "Verde",
    description: "Planifica hoja de ruta de proyecto.",
    prompt_text: "Crea roadmap de proyecto digital con: fases principales, hitos clave por trimestre, dependencias críticas, recursos por fase, riesgos anticipados y quick wins.",
    inputs: ["Objetivo del proyecto", "Plazo total"],
    output_format: "Roadmap estructurado",
    example_use_case: "Digitalización de trámites"
  },
  {
    id: 20,
    title: "Encuesta de satisfacción ciudadana",
    category: "Atención Ciudadana",
    level: "Intermedio",
    risk: "Verde",
    description: "Diseña encuesta de calidad de servicio.",
    prompt_text: "Diseña encuesta de satisfacción con: preguntas cerradas (escala), preguntas abiertas, sección demográfica opcional, tiempo estimado y análisis sugerido de resultados.",
    inputs: ["Servicio a evaluar", "Público objetivo"],
    output_format: "Cuestionario estructurado",
    example_use_case: "Evaluación de ventanilla única"
  }
];

export const categories = [
  "Redacción Institucional",
  "Gestión de Reuniones",
  "Gestión con Datos",
  "Compras Públicas",
  "Atención Ciudadana",
  "Comunicación Pública",
  "Gobernanza de IA",
  "Gestión de Riesgos",
  "Transformación Digital",
  "Alta Dirección",
  "Analítica Pública"
];

export const levels = ["Basico", "Intermedio", "Avanzado"];
export const risks = ["Verde", "Amarillo", "Rojo"];
