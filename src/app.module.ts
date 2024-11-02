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
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/wino-db'),
    AuthModule,
    RolesModule,
    PermissionModule,
    CompanyModule,
    DataModule,
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
