export const PERMISSIONS_KEY = 'permissions'

export const PERMISSIONS = {
  // roles
  CREATE_ROLE: 'create-role',
  EDIT_ROLE: 'edit-role',
  DELETE_ROLE: 'delete-role',
  ASSIGN_ROLE: 'assign-role',
  VIEW_ROLE: 'view-role',
  // tasks
  CREATE_TASK: 'create-task',
  EDIT_TASK: 'edit-task',
  DELETE_TASK: 'delete-task',
  ASSIGN_TASK: 'assign-task',
  VIEW_TASK: 'view-task',
  // projects
  MANAGE_PROJECT: 'manage-project',
  CREATE_PROJECT: 'create-project',
  EDIT_PROJECT: 'edit-project',
  DELETE_PROJECT: 'delete-project',
  VIEW_PROJECT: 'view-project',
  // columns
  CREATE_COLUMN: 'create-column',
  EDIT_COLUMN: 'edit-column',
  DELETE_COLUMN: 'delete-column',
  // users
  CREATE_USER: 'create-user',
  EDIT_USER: 'edit-user',
  DELETE_USER: 'delete-user',
  VIEW_USER: 'view-user',
  // dashboard
  VIEW_DASHBOARD: 'view-dashboard',
  // company
  EDIT_COMPANY: 'edit-company',
  DELETE_COMPANY: 'delete-company',
  CREATE_COMPANY: 'create-company',
  VIEW_COMPANY: 'view-company',
}

export const permissions = [
  {
    name: PERMISSIONS.CREATE_ROLE,
    description: 'This user can create roles',
  },
  {
    name: PERMISSIONS.EDIT_ROLE,
    description: 'This user can edit roles',
  },
  {
    name: PERMISSIONS.DELETE_ROLE,
    description: 'This user can delete roles',
  },
  {
    name: PERMISSIONS.ASSIGN_ROLE,
    description: 'This user can assign roles',
  },
  {
    name: PERMISSIONS.VIEW_ROLE,
    description: 'This user can view roles',
  },
  {
    name: PERMISSIONS.CREATE_TASK,
    description: 'This user can create tasks',
  },
  {
    name: PERMISSIONS.EDIT_TASK,
    description: 'This user can edit tasks',
  },
  {
    name: PERMISSIONS.DELETE_TASK,
    description: 'This user can delete tasks',
  },
  {
    name: PERMISSIONS.ASSIGN_TASK,
    description: 'This user can assign tasks',
  },
  {
    name: PERMISSIONS.VIEW_TASK,
    description: 'This user can view tasks',
  },
  {
    name: PERMISSIONS.CREATE_PROJECT,
    description: 'This user can create projects',
  },
  {
    name: PERMISSIONS.EDIT_PROJECT,
    description: 'This user can edit projects',
  },
  {
    name: PERMISSIONS.DELETE_PROJECT,
    description: 'This user can delete projects',
  },
  {
    name: PERMISSIONS.VIEW_PROJECT,
    description: 'This user can view projects',
  },
  {
    name: PERMISSIONS.MANAGE_PROJECT,
    description: 'This user can manage projects',
  },
  {
    name: PERMISSIONS.CREATE_COLUMN,
    description: 'This user can create columns',
  },
  {
    name: PERMISSIONS.EDIT_COLUMN,
    description: 'This user can edit columns',
  },
  {
    name: PERMISSIONS.DELETE_COLUMN,
    description: 'This user can delete columns',
  },
  {
    name: PERMISSIONS.CREATE_USER,
    description: 'This user can create users',
  },
  {
    name: PERMISSIONS.EDIT_USER,
    description: 'This user can edit users',
  },
  {
    name: PERMISSIONS.DELETE_USER,
    description: 'This user can delete users',
  },
  {
    name: PERMISSIONS.VIEW_USER,
    description: 'This user can view users',
  },
  {
    name: PERMISSIONS.VIEW_DASHBOARD,
    description: 'This user can view the dashboard',
  },
  {
    name: PERMISSIONS.EDIT_COMPANY,
    description: 'This user can edit the company',
  },
  {
    name: PERMISSIONS.DELETE_COMPANY,
    description: 'This user can delete the company',
  },
  {
    name: PERMISSIONS.CREATE_COMPANY,
    description: 'This user can create the company',
  },
  {
    name: PERMISSIONS.VIEW_COMPANY,
    description: 'This user can view the company',
  },
]

interface permissions {
  name: string
  description: string
}
