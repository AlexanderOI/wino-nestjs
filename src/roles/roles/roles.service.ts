import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from '@prisma/client'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.prisma.role.create({
      data: { ...createRoleDto, created_by: userId },
    })
    return role
  }

  async findAll(user_id: number): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        created_by: user_id,
      },
    })
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
    const deletedRole = await this.prisma.role.delete({ where: { id } })
    return deletedRole
  }
}
