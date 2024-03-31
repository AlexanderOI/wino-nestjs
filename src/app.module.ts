import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles/roles.module'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from './permissions/permissions.guard'

@Module({
  imports: [AuthModule, RolesModule],
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
