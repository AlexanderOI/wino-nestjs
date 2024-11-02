import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DataService } from './data.service'
import { DataController } from './data.controller'
import { User, UserSchema } from 'src/auth/entities/user.entity'
import { Role, RoleSchema } from 'src/roles/entities/role.entity'
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/entities/permission.entity'

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
