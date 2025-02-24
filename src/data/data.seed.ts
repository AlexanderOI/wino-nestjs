import { CreateUserDto } from '@/user/dto/create-user.dto'
import { CreateCompanyDto } from '@/company/dto/create-company.dto'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { CreateProjectDto } from '@/projects/dto/create-project.dto'
import { CreateRoleDto } from '@/roles/dto/create-role.dto'

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
    description:
      'Este proyecto comenzó como practica de Nextjs y Nestjs, luego decidí agregarle MongoDB para practica de Bases de datos no relacionales',
    client: 'Alexander OI',
    status: 'In Progress',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-06'),
    leaderId: '',
  },
  {
    name: 'EXO – Expense Organizer',
    description:
      'Este proyecto será hecho con React Native y Nestjs para navegar un poco por el mundo del desarrollo movile',
    client: 'Alexander OI',
    status: 'Pending',
    startDate: new Date('2024-02-07'),
    endDate: new Date('2024-02-28'),
    leaderId: '',
  },

  {
    name: 'BOW - Battle of Words',
    description:
      'Juego de batalla de palabras donde dos jugadores tendrán que escribir los mas rápido posible de acuerdo a la palabra asignada con distintas mecánicas, será hecho en React y Nestjs',
    client: 'Alexander OI',
    status: 'Pending',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    leaderId: '',
  },

  {
    name: 'LINKIO - Link Interaction Online',
    description:
      'Aplicación de envió de mensajes en tiempo real, este proyecto será desarrollado en React y Nestjs',
    client: 'Alexander OI',
    status: 'Pending',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    leaderId: '',
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
]
