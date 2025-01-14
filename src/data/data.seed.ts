import { CreateUserDto } from '@/user/dto/create-user.dto'
import { CreateCompanyDto } from '@/company/dto/create-company.dto'
import { CreateRoleDto } from '@/roles/dto/create-role.dto'
import { PERMISSIONS } from '@/permissions/constants/permissions'

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
    roles: [],
    roleType: 'admin',
  },
  {
    name: 'Usuario Regular',
    email: 'usuario@sistema.com',
    userName: 'usuario',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Juan Perez',
    email: 'juan.perez@example.com',
    userName: 'juanperez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Maria Gonzalez',
    email: 'maria.gonzalez@example.com',
    userName: 'mariagonzalez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Carlos Lopez',
    email: 'carlos.lopez@example.com',
    userName: 'carloslopez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Ana Martinez',
    email: 'ana.martinez@example.com',
    userName: 'anamartinez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Luis Fernandez',
    email: 'luis.fernandez@example.com',
    userName: 'luisfernandez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Sofia Ramirez',
    email: 'sofia.ramirez@example.com',
    userName: 'sofiaramirez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Diego Alvarez',
    email: 'diego.alvarez@example.com',
    userName: 'diegoalvarez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Laura Torres',
    email: 'laura.torres@example.com',
    userName: 'lauratorres',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Ricardo Herrera',
    email: 'ricardo.herrera@example.com',
    userName: 'ricardoherrera',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Valentina Ruiz',
    email: 'valentina.ruiz@example.com',
    userName: 'valentinaruiz',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Fernando Vega',
    email: 'fernando.vega@example.com',
    userName: 'fernandovega',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Isabel Morales',
    email: 'isabel.morales@example.com',
    userName: 'isabelmorales',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Gabriel Soto',
    email: 'gabriel.soto@example.com',
    userName: 'gabrielsoto',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Camila Diaz',
    email: 'camila.diaz@example.com',
    userName: 'camiladiaz',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Pedro Sanchez',
    email: 'pedro.sanchez@example.com',
    userName: 'pedrosanchez',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
  {
    name: 'Lucia Mendoza',
    email: 'lucia.mendoza@example.com',
    userName: 'luciamendoza',
    password: '1234',
    confirmPassword: '1234',
    roles: [],
    roleType: 'user',
  },
]
