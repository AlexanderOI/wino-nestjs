export const PERMISSIONS_KEY = 'permissions'

export const PERMISSIONS = {
  CREATE_ROLE: 'create-role',
  EDIT_ROLE: 'edit-role',
  DELETE_ROLE: 'delete-role',
  ASSIGN_ROLE: 'assign-role',
  VIEW_ROLE: 'view-role',
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
    description: 'This user can assign roles',
  },
]

interface permissions {
  name: string
  description: string
}
