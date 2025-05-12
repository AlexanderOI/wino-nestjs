import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

import { AuthModule } from '@/auth/auth.module'
import { DataModule } from '@/data/data.module'
import { UserModule } from '@/user/user.module'
import { TasksModule } from '@/tasks/tasks.module'
import { RolesModule } from '@/roles/roles.module'
import { CompanyModule } from '@/company/company.module'
import { ProjectsModule } from '@/projects/projects.module'
import { FormsTaskModule } from '@/forms-task/forms-task.module'
import { PermissionModule } from '@/permissions/permissions.module'
import { CommentsModule } from '@/comments/comments.module'

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
    FormsTaskModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
