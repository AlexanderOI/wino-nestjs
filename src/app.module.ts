import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard'
import { PermissionModule } from './permissions/permissions.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CompanyModule } from './company/company.module'
import { DataModule } from './data/data.module'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/wino-db'),
    AuthModule,
    RolesModule,
    PermissionModule,
    CompanyModule,
    DataModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
