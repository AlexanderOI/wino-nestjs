import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CustomPrismaClient } from 'src/prisma/prima.config'

@Injectable()
export class RolesService {
  private prisma: CustomPrismaClient
  constructor(private cli: PrismaService) {
    this.prisma = this.cli.client
  }

  async find() {
    const roles = await this.prisma.role.findMany()
    return roles
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const roles = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        companyId: 1,
        createdBy: 1,
      },
    })
    return roles
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany()
    return roles
  }

  async search(query: string): Promise<Role[]> {
    if (!query.trim()) {
      throw new BadRequestException('Query must not be empty')
    }
    const roles = await this.prisma.role.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    })
    return roles
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    })
    return updatedRole
  }

  async remove(id: number): Promise<Role> {
    const deletedRole = await this.prisma.role.delete({ id: id })
    return deletedRole
  }
}
