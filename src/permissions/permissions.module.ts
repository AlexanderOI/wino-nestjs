import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PermissionsController } from './permissions.controller'

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [PrismaModule],
})
export class RolesModule {}
