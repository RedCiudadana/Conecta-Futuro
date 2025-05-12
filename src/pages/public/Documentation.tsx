import React from 'react';
import { FileText, Video, Users, Award, Plus, Edit, Trash2, Search, BookOpen, Calendar, Clock } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Documentación del Sistema</h1>

      {/* Acceso al Panel de Administración */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Acceso al Panel de Administración</h2>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4">Requisitos de Acceso</h3>
            <ul className="space-y-2">
              <li>Cuenta de usuario con privilegios de administrador</li>
              <li>Iniciar sesión en la plataforma</li>
              <li>Acceder a través del menú de usuario → Panel Admin</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gestión de Cursos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gestión de Cursos</h2>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4">Crear un Nuevo Curso</h3>
            <ol className="space-y-4">
              <li>
                <strong>Acceder al Panel de Cursos:</strong>
                <ul>
                  <li>Navegar a "Panel Admin" → "Gestión de Cursos"</li>
                  <li>Hacer clic en el botón <span className="inline-flex items-center text-primary-600"><Plus className="w-4 h-4 mr-1" /> Nuevo Curso</span></li>
                </ul>
              </li>
              <li>
                <strong>Información Básica del Curso:</strong>
                <ul>
                  <li>Título del curso (obligatorio)</li>
                  <li>Descripción detallada</li>
                  <li>Imagen de portada (dimensiones recomendadas: 1280x720px)</li>
                  <li>Nivel (Básico, Intermedio, Avanzado)</li>
                  <li>Duración estimada</li>
                  <li>Categoría principal</li>
                </ul>
              </li>
              <li>
                <strong>Información del Instructor:</strong>
                <ul>
                  <li>Nombre completo</li>
                  <li>Título profesional</li>
                  <li>Biografía corta</li>
                  <li>Foto de perfil</li>
                </ul>
              </li>
              <li>
                <strong>Requisitos y Objetivos:</strong>
                <ul>
                  <li>Lista de requisitos previos</li>
                  <li>Objetivos de aprendizaje</li>
                  <li>Público objetivo</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4">Gestión de Contenido</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">Editar Contenido</h4>
                <p className="mb-4">Para editar el contenido de un curso, sigue estos pasos:</p>
                <ol className="space-y-2">
                  <li>1. Localiza el curso en la lista de cursos</li>
                  <li>2. Dentro del curso, encontrarás los módulos y sus lecciones</li>
                  <li>3. Para cada lección, verás un botón de edición <Edit className="w-4 h-4 inline text-primary-600" /></li>
                  <li>4. Al hacer clic en editar, podrás modificar:
                    <ul className="ml-6 mt-2 space-y-2">
                      <li>• Título de la lección</li>
                      <li>• Descripción</li>
                      <li>• Contenido específico según el tipo de lección:
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Video className="w-5 h-5 text-primary-600 mt-1" />
                            <div>
                              <span className="font-medium">Videos</span>
                              <p className="text-sm text-gray-600">URL del video y transcripción opcional</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <FileText className="w-5 h-5 text-primary-600 mt-1" />
                            <div>
                              <span className="font-medium">Documentos</span>
                              <p className="text-sm text-gray-600">URL del documento (PDF o presentación)</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Users className="w-5 h-5 text-primary-600 mt-1" />
                            <div>
                              <span className="font-medium">Sesiones en Vivo</span>
                              <p className="text-sm text-gray-600">URL de Zoom y programación</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>5. Realiza los cambios necesarios</li>
                  <li>6. Haz clic en "Guardar Cambios" para aplicar las modificaciones</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">Recomendaciones para el Contenido</h4>
                <ul className="space-y-2">
                  <li>• Asegúrate de que los enlaces de video sean válidos y accesibles</li>
                  <li>• Verifica que los documentos PDF estén optimizados para web</li>
                  <li>• Para sesiones en vivo, programa las fechas con anticipación</li>
                  <li>• Mantén las descripciones claras y concisas</li>
                  <li>• Actualiza el contenido regularmente para mantenerlo vigente</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">Eliminar Contenido</h4>
                <ul className="space-y-2">
                  <li>• Localiza el elemento a eliminar</li>
                  <li>• Usa el botón <Trash2 className="w-4 h-4 inline text-red-600" /> para eliminar</li>
                  <li>• Confirma la acción en el diálogo de confirmación</li>
                </ul>
                <p className="text-red-600 mt-2">
                  ⚠️ La eliminación es permanente y no se puede deshacer. Se recomienda hacer una copia de seguridad antes de eliminar contenido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mejores Prácticas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mejores Prácticas</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Contenido del Curso</h3>
            <ul className="space-y-2">
              <li>Mantener lecciones concisas (15-20 minutos)</li>
              <li>Incluir ejemplos prácticos y casos de estudio</li>
              <li>Proporcionar recursos adicionales</li>
              <li>Usar un lenguaje claro y profesional</li>
              <li>Mantener el contenido actualizado</li>
              <li>Incluir ejercicios prácticos</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Organización</h3>
            <ul className="space-y-2">
              <li>Estructurar el contenido de manera lógica</li>
              <li>Establecer objetivos claros por módulo</li>
              <li>Mantener la consistencia en el formato</li>
              <li>Revisar y actualizar regularmente</li>
              <li>Organizar el contenido de lo básico a lo avanzado</li>
              <li>Mantener una nomenclatura consistente</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Soporte y Ayuda */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Soporte y Ayuda</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Contacto de Soporte</h3>
            <ul className="space-y-2">
              <li>Email: soporte@redciudadana.org</li>
              <li>Teléfono: +502 2224-5252</li>
              <li>Horario: Lunes a Viernes, 9:00 - 17:00 (GMT-6)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recursos Adicionales</h3>
            <ul className="space-y-2">
              <li>Manual completo del administrador (PDF)</li>
              <li>Videos tutoriales de la plataforma</li>
              <li>FAQ para administradores</li>
              <li>Guías de mejores prácticas</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Documentation;