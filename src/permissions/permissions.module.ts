import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Permission, PermissionSchema } from './entities/permission.entity'

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
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