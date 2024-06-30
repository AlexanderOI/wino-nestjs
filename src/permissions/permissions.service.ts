import { BadRequestException, Injectable } from '@nestjs/common'

import { Permission, Role } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CustomPrismaClient } from 'src/prisma/prima.config'

@Injectable()
export class PermissionsService {
  private prisma: CustomPrismaClient
  constructor(private cli: PrismaService) {
    this.prisma = this.cli.client
  }

  async findAll() {
    const roles = await this.prisma.permission.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
        updatedBy: true,
      },
    })

    return roles
  }

  async search(query: string): Promise<Permission[]> {
    if (!query.trim()) {
      throw new BadRequestException('Query must not be empty')
    }
    const roles = await this.prisma.permission.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    })
    return roles
  }
}
