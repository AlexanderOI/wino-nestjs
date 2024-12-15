import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { PermissionsService } from './permissions.service'

import { RequestWithUser } from 'types'
import { PermissionsGuard } from '@/permissions/guards/permissions.guard'
import { Auth } from '@/auth/auth.decorator'
import { Permissions } from '@/permissions/decorators/permissions.decorator'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  // @UseGuards(AuthGuardJwt, PermissionsGuard)
  // @Permissions(['admin'])
  findAll(@Request() req: RequestWithUser) {
    return this.permissionsService.findAll()
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.permissionsService.search(query)
  }
}
