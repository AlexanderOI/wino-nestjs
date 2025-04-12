import { Controller, Get, Query } from '@nestjs/common'
import { PermissionsService } from '@/permissions/permissions.service'

import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'

@Auth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get()
  findAll() {
    return this.permissionsService.findAll()
  }

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get('search')
  search(@Query('query') query: string) {
    return this.permissionsService.search(query)
  }
}
