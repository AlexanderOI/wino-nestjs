export const permissions: permissions[] = [
  {
    name: 'create-role',
    description: 'This user can create roles',
  },
  {
    name: 'edit-role',
    description: 'This user can edit roles',
  },
  {
    name: 'delete-role',
    description: 'This user can delete roles',
  },
  {
    name: 'assign-role',
    description: 'This user can assign roles',
  },
]

interface permissions {
  name: string
  description: string
}
