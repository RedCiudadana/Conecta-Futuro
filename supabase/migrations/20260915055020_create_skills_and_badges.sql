/*
# Create 3 skills and 3 badges based on existing courses and paths

## Skills
1. Análisis de Datos con Power BI -- maps to PowerBI + Excel courses
2. Inteligencia Artificial Aplicada al Sector Público -- maps to IA courses
3. Protección de Datos Personales -- maps to protección de datos + ciberseguridad courses

## Badges (valid badge_type values: path_completion, skill_combo, milestone, manual)
1. Explorador Digital -- milestone: complete 3 courses
2. Guardián de Datos -- skill_combo: complete ciberseguridad + protección de datos
3. Líder en Transformación Digital -- path_completion: complete any learning path
*/

-- Skills
INSERT INTO skills (id, name, slug, description, category, level, status)
VALUES
  ('a1000000-0000-0000-0000-000000000001',
   'Análisis de Datos con Power BI',
   'analisis-de-datos-power-bi',
   'Capacidad para transformar datos en visualizaciones interactivas, dashboards e informes usando Power BI y Excel avanzado. Incluye Power Query, modelado con DAX y creación de paneles de gestión.',
   'Análisis de Datos',
   'intermedio',
   'active')
  ON CONFLICT (slug) DO NOTHING;

INSERT INTO skills (id, name, slug, description, category, level, status)
VALUES
  ('a1000000-0000-0000-0000-000000000002',
   'Inteligencia Artificial Aplicada al Sector Público',
   'ia-aplicada-sector-publico',
   'Comprensión y aplicación práctica de herramientas de inteligencia artificial en procesos de gobierno: diseño de soluciones con IA, uso ético y aplicación en la gestión pública.',
   'Inteligencia Artificial',
   'intermedio',
   'active')
  ON CONFLICT (slug) DO NOTHING;

INSERT INTO skills (id, name, slug, description, category, level, status)
VALUES
  ('a1000000-0000-0000-0000-000000000003',
   'Protección de Datos Personales',
   'proteccion-datos-personales',
   'Conocimiento de principios, derechos y obligaciones en materia de protección de datos personales según la legislación guatemalteca, incluyendo evaluación de riesgos y ciberseguridad.',
   'Seguridad y Privacidad',
   'intermedio',
   'active')
  ON CONFLICT (slug) DO NOTHING;

-- Badges
INSERT INTO badges (id, name, slug, description, icon, color, badge_type, criteria, status, sort_order)
VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'Explorador Digital',
   'explorador-digital',
   'Otorgada a estudiantes que completan sus primeros 3 cursos en la plataforma. Reconoce la iniciativa de explorar múltiples temas y construir una base de conocimientos digitales.',
   'compass',
   'sky',
   'milestone',
   '{"type":"milestone","courses_completed":3}'::jsonb,
   'active',
   1)
  ON CONFLICT (slug) DO NOTHING;

INSERT INTO badges (id, name, slug, description, icon, color, badge_type, criteria, status, sort_order)
VALUES
  ('b1000000-0000-0000-0000-000000000002',
   'Guardián de Datos',
   'guardian-de-datos',
   'Otorgada a estudiantes que completan los cursos de Ciberseguridad y Protección de Datos Personales. Reconoce la formación integral en seguridad de la información y privacidad.',
   'shield',
   'emerald',
   'skill_combo',
   '{"type":"skill_combo","skill_id":"a1000000-0000-0000-0000-000000000003","min_level":"intermedio"}'::jsonb,
   'active',
   2)
  ON CONFLICT (slug) DO NOTHING;

INSERT INTO badges (id, name, slug, description, icon, color, badge_type, criteria, status, sort_order)
VALUES
  ('b1000000-0000-0000-0000-000000000003',
   'Líder en Transformación Digital',
   'lider-transformacion-digital',
   'Otorgada a estudiantes que completan una ruta de aprendizaje completa (Conecta Gobierno, Digitaliza tu PyME o Mis Primeros Pasos Digitales). Reconoce la dedicación de seguir un plan formativo de principio a fin.',
   'award',
   'amber',
   'path_completion',
   '{"type":"path_completion","any_path":true}'::jsonb,
   'active',
   3)
  ON CONFLICT (slug) DO NOTHING;

-- Link skills to relevant courses
INSERT INTO course_skills (course_id, skill_id, level, weight)
SELECT c.id, 'a1000000-0000-0000-0000-000000000001', 'intermedio', 1
FROM courses c
WHERE c.slug IN ('introduccion-a-powerbi', 'introduccin-a-powerbi', 'powerbi-avanzado',
                 'excel-para-la-gestion-publica', 'excel-para-la-gestin-pblica', 'excel-avanzado-1')
  AND NOT EXISTS (SELECT 1 FROM course_skills cs WHERE cs.course_id = c.id AND cs.skill_id = 'a1000000-0000-0000-0000-000000000001');

INSERT INTO course_skills (course_id, skill_id, level, weight)
SELECT c.id, 'a1000000-0000-0000-0000-000000000002', 'intermedio', 1
FROM courses c
WHERE c.slug IN ('inteligencia-artificial-basico', 'inteligencia-artificial-bsico',
                 'introduccion-a-la-inteligencia-artificial', 'introduccin-a-la-inteligencia-artificial',
                 'aplicando-la-ia-herramientas-y-soluciones-para-la-gestion-publica',
                 'aplicando-la-ia-herramientas-y-soluciones-para-la-gestin-pblica',
                 'diseno-de-soluciones-con-ia-para-la-transformacion-digital-institucional',
                 'diseo-de-soluciones-con-ia-para-la-transformacin-digital-institucional',
                 'uso-etico-de-la-inteligencia-artificial', 'uso-tico-de-la-inteligencia-artificial')
  AND NOT EXISTS (SELECT 1 FROM course_skills cs WHERE cs.course_id = c.id AND cs.skill_id = 'a1000000-0000-0000-0000-000000000002');

INSERT INTO course_skills (course_id, skill_id, level, weight)
SELECT c.id, 'a1000000-0000-0000-0000-000000000003', 'intermedio', 1
FROM courses c
WHERE c.slug IN ('proteccion-de-datos-personales', 'proteccin-de-datos-personales',
                 'taller-proteccion-de-datos-personales', 'taller-proteccin-de-datos-personales',
                 'introduccion-a-ciberseguridad', 'introduccin-a-ciberseguridad', 'ciberseguridad')
  AND NOT EXISTS (SELECT 1 FROM course_skills cs WHERE cs.course_id = c.id AND cs.skill_id = 'a1000000-0000-0000-0000-000000000003');
