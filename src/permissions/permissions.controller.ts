import { Controller, Get, Query, Request } from '@nestjs/common'
import { PermissionsService } from './permissions.service'

import { RequestWithUser } from '@/types'
import { Auth } from '@/auth/auth.decorator'
import { PERMISSIONS } from '@/permissions/constants/permissions'

@Auth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.permissionsService.findAll()
  }

  @Auth(PERMISSIONS.VIEW_ROLE)
  @Get('search')
  search(@Query('query') query: string) {
    return this.permissionsService.search(query)
  }
}
