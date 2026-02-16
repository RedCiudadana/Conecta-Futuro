import { AITool } from '../types/aiTool';

export const aiTools: AITool[] = [
  {
    id: 1,
    name: 'Microsoft 365 Copilot',
    category: 'Asistentes Generativos y Productividad',
    description: 'IA integrada en suite Microsoft',
    useCase: 'Redacción de oficios, análisis Excel, presentaciones',
    link: 'https://www.microsoft.com/microsoft-365/copilot',
    riskLevel: 'Medio',
    maturityLevel: 'Intermedio',
    targetUsers: ['Gobierno Central', 'Municipalidades', 'General']
  },
  {
    id: 2,
    name: 'ChatGPT',
    category: 'Asistentes Generativos y Productividad',
    description: 'Generación y análisis de texto',
    useCase: 'Borradores normativos, guías técnicas',
    link: 'https://chatgpt.com',
    riskLevel: 'Alto',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 3,
    name: 'Claude',
    category: 'Asistentes Generativos y Productividad',
    description: 'Síntesis y escritura larga',
    useCase: 'Resumen de informes y políticas públicas',
    link: 'https://claude.ai',
    riskLevel: 'Alto',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 4,
    name: 'Google Gemini',
    category: 'Asistentes Generativos y Productividad',
    description: 'IA en Workspace',
    useCase: 'Redacción y minutas automáticas',
    link: 'https://workspace.google.com/solutions/ai/',
    riskLevel: 'Medio',
    maturityLevel: 'Intermedio',
    targetUsers: ['Gobierno Central', 'Municipalidades', 'General']
  },
  {
    id: 5,
    name: 'Perplexity',
    category: 'Investigación y Gestión del Conocimiento',
    description: 'Búsqueda con fuentes citadas',
    useCase: 'Investigación normativa y antecedentes',
    link: 'https://www.perplexity.ai',
    riskLevel: 'Bajo',
    maturityLevel: 'Básico',
    targetUsers: ['General', 'Sector Justicia']
  },
  {
    id: 6,
    name: 'Elicit',
    category: 'Investigación y Gestión del Conocimiento',
    description: 'Síntesis de literatura',
    useCase: 'Evidencia para diseño de políticas',
    link: 'https://elicit.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['Gobierno Central', 'Salud', 'Educación']
  },
  {
    id: 7,
    name: 'Consensus',
    category: 'Investigación y Gestión del Conocimiento',
    description: 'Motor científico basado en papers',
    useCase: 'Soporte técnico en decisiones públicas',
    link: 'https://consensus.app',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['Gobierno Central', 'Salud', 'Educación']
  },
  {
    id: 8,
    name: 'Notion AI',
    category: 'Investigación y Gestión del Conocimiento',
    description: 'Organización y redacción asistida',
    useCase: 'Manuales y bases de conocimiento institucional',
    link: 'https://www.notion.so/product/ai',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 9,
    name: 'Otter.ai',
    category: 'Reuniones y Transcripción',
    description: 'Transcripción automática',
    useCase: 'Minutas de reuniones',
    link: 'https://otter.ai',
    riskLevel: 'Alto',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 10,
    name: 'Fireflies.ai',
    category: 'Reuniones y Transcripción',
    description: 'Resúmenes automáticos de reuniones',
    useCase: 'Seguimiento de acuerdos interinstitucionales',
    link: 'https://fireflies.ai',
    riskLevel: 'Alto',
    maturityLevel: 'Intermedio',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 11,
    name: 'Zoom AI Companion',
    category: 'Reuniones y Transcripción',
    description: 'IA integrada en Zoom',
    useCase: 'Actas automáticas',
    link: 'https://explore.zoom.us/en/products/ai-companion/',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 12,
    name: 'Grammarly',
    category: 'Redacción y Traducción',
    description: 'Mejora de estilo y claridad',
    useCase: 'Comunicados oficiales',
    link: 'https://www.grammarly.com',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 13,
    name: 'DeepL',
    category: 'Redacción y Traducción',
    description: 'Traducción avanzada',
    useCase: 'Documentos multilaterales',
    link: 'https://www.deepl.com',
    riskLevel: 'Alto',
    maturityLevel: 'Básico',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 14,
    name: 'ElevenLabs',
    category: 'Redacción y Traducción',
    description: 'Texto a voz',
    useCase: 'Accesibilidad en portales',
    link: 'https://elevenlabs.io',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['General', 'Educación']
  },
  {
    id: 15,
    name: 'Whisper',
    category: 'Redacción y Traducción',
    description: 'Voz a texto',
    useCase: 'Digitalización de audiencias',
    link: 'https://openai.com/research/whisper',
    riskLevel: 'Alto',
    maturityLevel: 'Avanzado',
    targetUsers: ['Sector Justicia', 'General']
  },
  {
    id: 16,
    name: 'Adobe Acrobat AI',
    category: 'Gestión Documental',
    description: 'Análisis de PDFs',
    useCase: 'Revisión de expedientes',
    link: 'https://www.adobe.com/acrobat/generative-ai-pdf.html',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General', 'Sector Justicia']
  },
  {
    id: 17,
    name: 'ABBYY FineReader',
    category: 'Gestión Documental',
    description: 'OCR avanzado',
    useCase: 'Digitalización masiva',
    link: 'https://www.abbyy.com',
    riskLevel: 'Medio',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 18,
    name: 'Google Document AI',
    category: 'Gestión Documental',
    description: 'Extracción estructurada',
    useCase: 'Automatización de formularios',
    link: 'https://cloud.google.com/document-ai',
    riskLevel: 'Alto',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'Municipalidades']
  },
  {
    id: 19,
    name: 'Power Automate',
    category: 'Automatización de Procesos',
    description: 'Flujos automáticos',
    useCase: 'Aprobaciones internas',
    link: 'https://powerautomate.microsoft.com',
    riskLevel: 'Medio',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 20,
    name: 'Zapier',
    category: 'Automatización de Procesos',
    description: 'Integración de apps',
    useCase: 'Automatización de reportes',
    link: 'https://zapier.com',
    riskLevel: 'Alto',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 21,
    name: 'Make',
    category: 'Automatización de Procesos',
    description: 'Automatización visual',
    useCase: 'Flujos entre sistemas',
    link: 'https://www.make.com',
    riskLevel: 'Alto',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 22,
    name: 'UiPath',
    category: 'Automatización de Procesos',
    description: 'RPA empresarial',
    useCase: 'Automatización de tareas repetitivas',
    link: 'https://www.uipath.com',
    riskLevel: 'Medio',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'Finanzas Públicas']
  },
  {
    id: 23,
    name: 'Tableau',
    category: 'Analítica y BI',
    description: 'Visualización avanzada',
    useCase: 'Dashboards institucionales',
    link: 'https://www.tableau.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 24,
    name: 'Power BI',
    category: 'Analítica y BI',
    description: 'BI con IA integrada',
    useCase: 'Indicadores de gestión',
    link: 'https://powerbi.microsoft.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 25,
    name: 'Looker',
    category: 'Analítica y BI',
    description: 'BI y modelado de datos',
    useCase: 'Monitoreo de datos públicos',
    link: 'https://cloud.google.com/looker',
    riskLevel: 'Bajo',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 26,
    name: 'Qlik',
    category: 'Analítica y BI',
    description: 'Business Intelligence',
    useCase: 'Seguimiento presupuestario',
    link: 'https://www.qlik.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['Finanzas Públicas', 'General']
  },
  {
    id: 27,
    name: 'Alteryx',
    category: 'Analítica y BI',
    description: 'Preparación y transformación',
    useCase: 'Limpieza de datasets',
    link: 'https://www.alteryx.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Avanzado',
    targetUsers: ['General']
  },
  {
    id: 28,
    name: 'DataRobot',
    category: 'Analítica y BI',
    description: 'AutoML predictivo',
    useCase: 'Modelos de predicción en servicios',
    link: 'https://www.datarobot.com',
    riskLevel: 'Medio',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central', 'Salud']
  },
  {
    id: 29,
    name: 'Databricks',
    category: 'Analítica y BI',
    description: 'Plataforma lakehouse',
    useCase: 'Integración masiva de datos',
    link: 'https://www.databricks.com',
    riskLevel: 'Medio',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central']
  },
  {
    id: 30,
    name: 'BigQuery',
    category: 'Analítica y BI',
    description: 'Data warehouse',
    useCase: 'Análisis de datos abiertos',
    link: 'https://cloud.google.com/bigquery',
    riskLevel: 'Medio',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 31,
    name: 'ArcGIS',
    category: 'Geoespacial',
    description: 'Análisis territorial',
    useCase: 'Mapas de cobertura y riesgo',
    link: 'https://www.esri.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['Municipalidades', 'General']
  },
  {
    id: 32,
    name: 'QGIS',
    category: 'Geoespacial',
    description: 'SIG open source',
    useCase: 'Planeación municipal',
    link: 'https://qgis.org',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['Municipalidades', 'General']
  },
  {
    id: 33,
    name: 'Canva Magic Studio',
    category: 'Diseño y Comunicación',
    description: 'Diseño gráfico con IA',
    useCase: 'Infografías públicas',
    link: 'https://www.canva.com/magic/',
    riskLevel: 'Bajo',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 34,
    name: 'Adobe Express',
    category: 'Diseño y Comunicación',
    description: 'Diseño rápido',
    useCase: 'Material educativo',
    link: 'https://www.adobe.com/express',
    riskLevel: 'Bajo',
    maturityLevel: 'Básico',
    targetUsers: ['General', 'Educación']
  },
  {
    id: 35,
    name: 'Synthesia',
    category: 'Diseño y Comunicación',
    description: 'Video con avatar IA',
    useCase: 'Capacitación virtual',
    link: 'https://www.synthesia.io',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['General', 'Educación']
  },
  {
    id: 36,
    name: 'Runway',
    category: 'Diseño y Comunicación',
    description: 'Edición y generación video',
    useCase: 'Producción audiovisual',
    link: 'https://runwayml.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Avanzado',
    targetUsers: ['General']
  },
  {
    id: 37,
    name: 'Descript',
    category: 'Diseño y Comunicación',
    description: 'Edición por texto',
    useCase: 'Podcast institucional',
    link: 'https://www.descript.com',
    riskLevel: 'Medio',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 38,
    name: 'ServiceNow Now Assist',
    category: 'Atención Ciudadana',
    description: 'IA para ITSM',
    useCase: 'Gestión de incidencias',
    link: 'https://www.servicenow.com',
    riskLevel: 'Medio',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 39,
    name: 'Zendesk AI',
    category: 'Atención Ciudadana',
    description: 'Chatbots y soporte',
    useCase: 'Atención automática a ciudadanía',
    link: 'https://www.zendesk.com',
    riskLevel: 'Medio',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 40,
    name: 'Salesforce Einstein',
    category: 'Atención Ciudadana',
    description: 'CRM con IA',
    useCase: 'Seguimiento de casos ciudadanos',
    link: 'https://www.salesforce.com/products/einstein/',
    riskLevel: 'Medio',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 41,
    name: 'Okta',
    category: 'Ciberseguridad',
    description: 'Gestión de identidad',
    useCase: 'Control de acceso institucional',
    link: 'https://www.okta.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 42,
    name: 'Microsoft Defender',
    category: 'Ciberseguridad',
    description: 'Protección con IA',
    useCase: 'Detección de amenazas',
    link: 'https://www.microsoft.com/security',
    riskLevel: 'Bajo',
    maturityLevel: 'Avanzado',
    targetUsers: ['General']
  },
  {
    id: 43,
    name: 'CrowdStrike',
    category: 'Ciberseguridad',
    description: 'Seguridad avanzada endpoint',
    useCase: 'Respuesta a incidentes',
    link: 'https://www.crowdstrike.com',
    riskLevel: 'Bajo',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central', 'General']
  },
  {
    id: 44,
    name: 'MuleSoft',
    category: 'Interoperabilidad',
    description: 'Gestión de APIs',
    useCase: 'Ecosistema digital interoperable',
    link: 'https://www.mulesoft.com',
    riskLevel: 'Medio',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central']
  },
  {
    id: 45,
    name: 'Boomi',
    category: 'Interoperabilidad',
    description: 'Integración cloud',
    useCase: 'Sincronización entre sistemas',
    link: 'https://boomi.com',
    riskLevel: 'Medio',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central']
  },
  {
    id: 46,
    name: 'Figma AI',
    category: 'Diseño y Comunicación',
    description: 'Prototipado asistido',
    useCase: 'Diseño UX de trámites digitales',
    link: 'https://www.figma.com/ai/',
    riskLevel: 'Bajo',
    maturityLevel: 'Intermedio',
    targetUsers: ['General']
  },
  {
    id: 47,
    name: 'LanguageTool',
    category: 'Redacción y Traducción',
    description: 'Corrección multilingüe',
    useCase: 'Documentos oficiales',
    link: 'https://languagetool.org',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 48,
    name: 'Wordtune',
    category: 'Redacción y Traducción',
    description: 'Reformulación',
    useCase: 'Simplificación de lenguaje técnico',
    link: 'https://www.wordtune.com',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 49,
    name: 'Amazon Polly',
    category: 'Redacción y Traducción',
    description: 'Síntesis de voz',
    useCase: 'IVR gubernamental',
    link: 'https://aws.amazon.com/polly/',
    riskLevel: 'Medio',
    maturityLevel: 'Avanzado',
    targetUsers: ['General']
  },
  {
    id: 50,
    name: 'Ironclad',
    category: 'LegalTech',
    description: 'Gestión contractual digital',
    useCase: 'Flujo de contratos públicos',
    link: 'https://ironcladapp.com',
    riskLevel: 'Alto',
    maturityLevel: 'Avanzado',
    targetUsers: ['Gobierno Central', 'Sector Justicia']
  },
  {
    id: 51,
    name: 'Luminance',
    category: 'LegalTech',
    description: 'Revisión legal con IA',
    useCase: 'Due diligence contractual',
    link: 'https://www.luminance.com',
    riskLevel: 'Alto',
    maturityLevel: 'Estratégico',
    targetUsers: ['Gobierno Central', 'Sector Justicia']
  },
  {
    id: 52,
    name: 'Relativity',
    category: 'LegalTech',
    description: 'eDiscovery',
    useCase: 'Auditorías documentales',
    link: 'https://www.relativity.com',
    riskLevel: 'Alto',
    maturityLevel: 'Estratégico',
    targetUsers: ['Sector Justicia', 'Gobierno Central']
  },
  {
    id: 53,
    name: 'n8n',
    category: 'Automatización de Procesos',
    description: 'Automatización autoalojada',
    useCase: 'Flujos internos seguros',
    link: 'https://n8n.io',
    riskLevel: 'Bajo',
    maturityLevel: 'Avanzado',
    targetUsers: ['General']
  },
  {
    id: 54,
    name: 'Google Meet AI',
    category: 'Reuniones y Transcripción',
    description: 'IA en Meet',
    useCase: 'Resúmenes de reuniones',
    link: 'https://meet.google.com',
    riskLevel: 'Medio',
    maturityLevel: 'Básico',
    targetUsers: ['General']
  },
  {
    id: 55,
    name: 'ServiceNow Virtual Agent',
    category: 'Atención Ciudadana',
    description: 'Chatbot institucional',
    useCase: 'Autoservicio ciudadano',
    link: 'https://www.servicenow.com',
    riskLevel: 'Medio',
    maturityLevel: 'Avanzado',
    targetUsers: ['General']
  }
];

export const categories = [
  'Asistentes Generativos y Productividad',
  'Investigación y Gestión del Conocimiento',
  'Reuniones y Transcripción',
  'Redacción y Traducción',
  'Gestión Documental',
  'Automatización de Procesos',
  'Analítica y BI',
  'Geoespacial',
  'Diseño y Comunicación',
  'Atención Ciudadana',
  'LegalTech',
  'Ciberseguridad',
  'Interoperabilidad'
];

export const userTypes = [
  'Gobierno Central',
  'Municipalidades',
  'Sector Justicia',
  'Salud',
  'Educación',
  'Finanzas Públicas',
  'General'
];

export const riskLevels = ['Bajo', 'Medio', 'Alto'];

export const maturityLevels = ['Básico', 'Intermedio', 'Avanzado', 'Estratégico'];
