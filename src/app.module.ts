import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from '@/permissions/guards/permissions.guard'
import { PermissionModule } from './permissions/permissions.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CompanyModule } from './company/company.module'
import { DataModule } from './data/data.module'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { ProjectsModule } from './projects/projects.module'
import { TasksModule } from './tasks/tasks.module'
import { AuthGuardJwt } from './auth/guard/auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    RolesModule,
    PermissionModule,
    CompanyModule,
    DataModule,
    UserModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
