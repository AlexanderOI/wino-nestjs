import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Permission, PermissionSchema } from '../models/permission.model'
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, JwtService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
    ]),
  ],
})
export class PermissionModule {}
