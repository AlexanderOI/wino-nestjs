import { CreateUserDto } from '@/user/dto/request/create-user.dto'
import { CreateCompanyDto } from '@/company/dto/request/create-company.dto'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { CreateRoleDto } from '@/roles/dto/request/create-role.dto'

export const initialCompany: CreateCompanyDto = {
  name: 'Empresa Inicial',
  address: 'Dirección Principal #123',
}

export const initialRoles: CreateRoleDto[] = [
  {
    name: 'Super Admin',
    description: 'Rol con todos los permisos del sistema',
    permissions: Object.values(PERMISSIONS),
  },
  {
    name: 'Usuario Regular',
    description: 'Rol con permisos básicos',
    permissions: [PERMISSIONS.VIEW_ROLE],
  },
]

export const initialUsers: CreateUserDto[] = [
  {
    name: 'Administrador',
    email: 'admin@sistema.com',
    userName: 'admin',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'admin',
  },
  {
    name: 'Usuario Regular',
    email: 'usuario@sistema.com',
    userName: 'usuario',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Juan Perez',
    email: 'juan.perez@example.com',
    userName: 'juanperez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Maria Gonzalez',
    email: 'maria.gonzalez@example.com',
    userName: 'mariagonzalez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Carlos Lopez',
    email: 'carlos.lopez@example.com',
    userName: 'carloslopez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Ana Martinez',
    email: 'ana.martinez@example.com',
    userName: 'anamartinez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Luis Fernandez',
    email: 'luis.fernandez@example.com',
    userName: 'luisfernandez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Sofia Ramirez',
    email: 'sofia.ramirez@example.com',
    userName: 'sofiaramirez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Diego Alvarez',
    email: 'diego.alvarez@example.com',
    userName: 'diegoalvarez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Laura Torres',
    email: 'laura.torres@example.com',
    userName: 'lauratorres',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Ricardo Herrera',
    email: 'ricardo.herrera@example.com',
    userName: 'ricardoherrera',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Valentina Ruiz',
    email: 'valentina.ruiz@example.com',
    userName: 'valentinaruiz',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Fernando Vega',
    email: 'fernando.vega@example.com',
    userName: 'fernandovega',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Isabel Morales',
    email: 'isabel.morales@example.com',
    userName: 'isabelmorales',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Gabriel Soto',
    email: 'gabriel.soto@example.com',
    userName: 'gabrielsoto',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Camila Diaz',
    email: 'camila.diaz@example.com',
    userName: 'camiladiaz',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Pedro Sanchez',
    email: 'pedro.sanchez@example.com',
    userName: 'pedrosanchez',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
  {
    name: 'Lucia Mendoza',
    email: 'lucia.mendoza@example.com',
    userName: 'luciamendoza',
    password: '1234',
    confirmPassword: '1234',
    rolesId: [],
    roleType: 'user',
  },
]

export const initialProjects = [
  {
    name: 'WINO - Project and Task Manager',
    code: 'WINO',
    description:
      'Este proyecto comenzó como practica de Nextjs y Nestjs, luego decidí agregarle MongoDB para practica de Bases de datos no relacionales',
    client: 'Alexander OI',
    status: 'In Progress',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-06'),
    leaderId: '',
    color: '#0000FF',
  },
  {
    name: 'EXO – Expense Organizer',
    code: 'EXO',
    description:
      'Este proyecto será hecho con React Native y Nestjs para navegar un poco por el mundo del desarrollo movile',
    client: 'Alexander OI',
    status: 'Pending',
    startDate: new Date('2024-02-07'),
    endDate: new Date('2024-02-28'),
    leaderId: '',
    color: '#800080',
  },

  {
    name: 'BOW - Battle of Words',
    code: 'BOW',
    description:
      'Juego de batalla de palabras donde dos jugadores tendrán que escribir los mas rápido posible de acuerdo a la palabra asignada con distintas mecánicas, será hecho en React y Nestjs',
    client: 'Alexander OI',
    status: 'Pending',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    leaderId: '',
    color: '#008000',
  },

  {
    name: 'LINKIO - Link Interaction Online',
    code: 'LINKIO',
    description:
      'Aplicación de envió de mensajes en tiempo real, este proyecto será desarrollado en React y Nestjs',
    client: 'Alexander OI',
    status: 'Pending',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    leaderId: '',
    color: '#FF0000',
  },
]

export const initialTasks = [
  {
    name: 'Agregar los rolesId que faltan',
    description:
      'Agregar los rolesId que faltan para que el usuario pueda ver los rolesId',
    column: 0,
  },
  {
    name: 'Mejorar la vista de rolesId',
    description: 'Mejorar la vista de rolesId para que el usuario pueda ver los rolesId',
    column: 0,
  },

  {
    name: 'Agregar skeleton a la pagina de tareas',
    description:
      'Agregar skeleton a la pagina de tareas para que el usuario pueda ver los tareas',
    column: 3,
  },
  {
    name: 'Crear un dashboard general',
    description: 'Crear un dashboard general para que el usuario pueda ver los proyectos',
    column: 1,
  },
  {
    name: 'Refactorizacion de forma de datos',
    description:
      'Refactorizacion de forma de datos para que el usuario pueda ver los datos',
    column: 2,
  },

  {
    name: 'Crear la página de proyectos',
    description:
      'Crear la página de proyectos para que el usuario pueda ver los proyectos',
    column: 3,
  },

  {
    name: 'Configurar autenticación JWT',
    description: 'Implementar sistema de autenticación con tokens JWT',
    column: 0,
  },
  {
    name: 'Crear middleware de validación',
    description: 'Desarrollar middleware para validar requests',
    column: 0,
  },
  {
    name: 'Implementar paginación',
    description: 'Agregar paginación a las listas de datos',
    column: 1,
  },
  {
    name: 'Optimizar queries de MongoDB',
    description: 'Mejorar rendimiento de consultas a la base de datos',
    column: 1,
  },
  {
    name: 'Agregar filtros avanzados',
    description: 'Implementar sistema de filtros para tareas y proyectos',
    column: 2,
  },
  {
    name: 'Crear sistema de notificaciones',
    description: 'Desarrollar notificaciones en tiempo real',
    column: 2,
  },
  {
    name: 'Implementar drag and drop',
    description: 'Agregar funcionalidad de arrastrar y soltar tareas',
    column: 1,
  },
  {
    name: 'Configurar Docker',
    description: 'Crear contenedores Docker para desarrollo',
    column: 3,
  },
  {
    name: 'Agregar tests unitarios',
    description: 'Escribir tests para servicios principales',
    column: 0,
  },
  {
    name: 'Implementar búsqueda global',
    description: 'Crear sistema de búsqueda en toda la aplicación',
    column: 1,
  },
  {
    name: 'Optimizar bundle de frontend',
    description: 'Reducir tamaño del bundle de NextJS',
    column: 2,
  },
  {
    name: 'Configurar CI/CD',
    description: 'Implementar pipeline de integración continua',
    column: 0,
  },
  {
    name: 'Agregar modo oscuro',
    description: 'Implementar tema oscuro en la interfaz',
    column: 1,
  },
  {
    name: 'Crear API documentation',
    description: 'Documentar endpoints con Swagger',
    column: 2,
  },
  {
    name: 'Implementar cache Redis',
    description: 'Agregar sistema de cache para mejor rendimiento',
    column: 3,
  },
  {
    name: 'Configurar logging',
    description: 'Implementar sistema de logs estructurados',
    column: 1,
  },
  {
    name: 'Agregar validación de archivos',
    description: 'Validar tipos y tamaños de archivos subidos',
    column: 0,
  },
  {
    name: 'Crear sistema de backup',
    description: 'Implementar respaldos automáticos de la BD',
    column: 2,
  },
  {
    name: 'Optimizar componentes React',
    description: 'Mejorar rendimiento de componentes frontend',
    column: 1,
  },
  {
    name: 'Implementar websockets',
    description: 'Agregar comunicación en tiempo real',
    column: 3,
  },
  {
    name: 'Configurar React Native',
    description: 'Inicializar proyecto React Native',
    column: 0,
  },
  {
    name: 'Diseñar pantalla de login',
    description: 'Crear interfaz de autenticación móvil',
    column: 0,
  },
  {
    name: 'Implementar navegación',
    description: 'Configurar React Navigation',
    column: 1,
  },
  {
    name: 'Crear modelos de gastos',
    description: 'Definir esquemas para gastos e ingresos',
    column: 0,
  },
  {
    name: 'Diseñar dashboard principal',
    description: 'Crear pantalla principal con resúmenes',
    column: 1,
  },
  {
    name: 'Implementar formulario de gastos',
    description: 'Crear formulario para registrar gastos',
    column: 1,
  },
  {
    name: 'Agregar categorías de gastos',
    description: 'Implementar sistema de categorización',
    column: 2,
  },
  {
    name: 'Crear gráficos de gastos',
    description: 'Implementar visualizaciones con Chart.js',
    column: 2,
  },
  {
    name: 'Configurar almacenamiento local',
    description: 'Implementar AsyncStorage para datos offline',
    column: 1,
  },
  {
    name: 'Diseñar pantalla de reportes',
    description: 'Crear vista de reportes mensuales',
    column: 2,
  },
  {
    name: 'Implementar cámara para recibos',
    description: 'Agregar funcionalidad para fotografiar recibos',
    column: 0,
  },
  {
    name: 'Crear sistema de presupuestos',
    description: 'Implementar límites de gastos por categoría',
    column: 1,
  },
  {
    name: 'Agregar notificaciones push',
    description: 'Configurar notificaciones para límites de gastos',
    column: 2,
  },
  {
    name: 'Implementar exportar datos',
    description: 'Permitir exportar gastos a PDF/Excel',
    column: 3,
  },
  {
    name: 'Crear pantalla de configuración',
    description: 'Implementar ajustes de la aplicación',
    column: 1,
  },
  {
    name: 'Agregar validación de formularios',
    description: 'Validar inputs en formularios de gastos',
    column: 0,
  },
  {
    name: 'Implementar búsqueda de gastos',
    description: 'Crear funcionalidad de búsqueda',
    column: 2,
  },
  {
    name: 'Crear sistema de etiquetas',
    description: 'Permitir etiquetar gastos para mejor organización',
    column: 1,
  },
  {
    name: 'Implementar modo offline',
    description: 'Funcionalidad completa sin conexión',
    column: 2,
  },
  {
    name: 'Agregar autenticación biométrica',
    description: 'Implementar login con huella/Face ID',
    column: 3,
  },
  {
    name: 'Crear widgets para home screen',
    description: 'Widgets nativos para resumen rápido',
    column: 0,
  },
  {
    name: 'Implementar sincronización cloud',
    description: 'Sincronizar datos con servidor',
    column: 1,
  },
  {
    name: 'Agregar análisis de patrones',
    description: 'IA para analizar patrones de gastos',
    column: 2,
  },
  {
    name: 'Crear recordatorios de pagos',
    description: 'Sistema de recordatorios para facturas',
    column: 1,
  },
  {
    name: 'Implementar múltiples monedas',
    description: 'Soporte para diferentes divisas',
    column: 3,
  },
  {
    name: 'Agregar modo familiar',
    description: 'Compartir gastos entre miembros de familia',
    column: 0,
  },
  {
    name: 'Crear backup automático',
    description: 'Respaldo automático de datos',
    column: 2,
  },
  {
    name: 'Implementar reconocimiento de texto',
    description: 'OCR para extraer datos de recibos',
    column: 1,
  },
  {
    name: 'Agregar geolocalización',
    description: 'Registrar ubicación de gastos automáticamente',
    column: 3,
  },
  {
    name: 'Crear sistema de metas de ahorro',
    description: 'Establecer y seguir metas financieras',
    column: 2,
  },
  {
    name: 'Crear sistema de salas',
    description: 'Implementar salas de juego para dos jugadores',
    column: 0,
  },
  {
    name: 'Diseñar interfaz de batalla',
    description: 'Crear UI para la batalla de palabras',
    column: 0,
  },
  {
    name: 'Implementar diccionario de palabras',
    description: 'Crear base de datos de palabras válidas',
    column: 1,
  },
  {
    name: 'Crear sistema de puntuación',
    description: 'Implementar cálculo de puntos por velocidad',
    column: 1,
  },
  {
    name: 'Agregar efectos visuales',
    description: 'Implementar animaciones y efectos',
    column: 2,
  },
  {
    name: 'Crear sistema de matchmaking',
    description: 'Emparejar jugadores automáticamente',
    column: 2,
  },
  {
    name: 'Implementar chat en vivo',
    description: 'Sistema de mensajes durante partidas',
    column: 1,
  },
  {
    name: 'Agregar diferentes modos de juego',
    description: 'Crear variantes del juego principal',
    column: 3,
  },
  {
    name: 'Crear sistema de rankings',
    description: 'Implementar tabla de posiciones',
    column: 2,
  },
  {
    name: 'Agregar power-ups',
    description: 'Crear habilidades especiales para usar',
    column: 1,
  },
  {
    name: 'Implementar sistema de logros',
    description: 'Crear achievements y badges',
    column: 3,
  },
  {
    name: 'Crear modo práctica',
    description: 'Modo single player para entrenar',
    column: 0,
  },
  {
    name: 'Configurar WebSocket server',
    description: 'Implementar servidor de tiempo real',
    column: 0,
  },
  {
    name: 'Crear sistema de salas de chat',
    description: 'Implementar canales de comunicación',
    column: 0,
  },
  {
    name: 'Diseñar interfaz de chat',
    description: 'Crear UI moderna para mensajería',
    column: 1,
  },
  {
    name: 'Implementar envío de archivos',
    description: 'Permitir compartir imágenes y documentos',
    column: 1,
  },
  {
    name: 'Agregar emojis y stickers',
    description: 'Sistema de expresiones visuales',
    column: 2,
  },
  {
    name: 'Crear notificaciones push',
    description: 'Notificar mensajes nuevos',
    column: 2,
  },
  {
    name: 'Implementar videollamadas',
    description: 'Integrar WebRTC para video chat',
    column: 3,
  },
  {
    name: 'Crear sistema de estados',
    description: 'Estados de conectado/desconectado/ocupado',
    column: 1,
  },
  {
    name: 'Agregar encriptación de mensajes',
    description: 'Implementar seguridad end-to-end',
    column: 2,
  },
  {
    name: 'Crear modo grupo',
    description: 'Chats grupales con múltiples usuarios',
    column: 3,
  },
]
