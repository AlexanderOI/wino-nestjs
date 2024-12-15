import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DataService } from './data.service'
import { DataController } from './data.controller'
import { User, UserSchema } from '@/models/user.model'
import { Role, RoleSchema } from '@/models/role.model'
import { Permission, PermissionSchema } from '@/models/permission.model'

@Module({
  controllers: [DataController],
  providers: [DataService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
})
export class DataModule {}
