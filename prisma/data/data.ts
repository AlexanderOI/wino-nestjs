import { PrismaClient } from '@prisma/client'
import { permissions } from '../../src/permissions/constants/permissions'

const prisma = new PrismaClient()

async function generatePermissions() {
  try {
    permissions.map(async (permission) => {
      await prisma.permission.create({
        data: {
          name: permission.name,
          description: permission.description,
        },
      })
    })

    console.log('Success generating permissions')
  } catch (error) {
    console.error('Error generating permissions')
  } finally {
    await prisma.$disconnect()
  }
}

generatePermissions()
