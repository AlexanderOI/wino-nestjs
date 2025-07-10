import { Controller, Get, Param, Patch, Delete, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

import { Auth } from '@/auth/auth.decorator'
import { User } from '@/auth/decorators/user.decorator'
import { ApiErrors } from '@/common/decorators/api-errors.decorator'

import { UserAuth } from '@/types'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

import { NotificationsService } from '@/notifications/notifications.service'
import { FilterNotificationDto } from '@/notifications/dto/request'
import {
  UserNotificationsResponseDto,
  UnreadCountResponseDto,
  MarkReadResponseDto,
  MarkSingleReadResponseDto,
  DeleteNotificationResponseDto,
} from '@/notifications/dto/response'

@ApiTags('Notifications')
@ApiBearerAuth()
@Auth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: 'Obtener notificaciones del usuario',
    description:
      'Obtiene una lista paginada de notificaciones del usuario autenticado con opciones de filtrado por texto y fechas',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones obtenidas exitosamente',
    type: UserNotificationsResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Get()
  async getUserNotifications(
    @User() user: UserAuth,
    @Query() filterNotificationDto: FilterNotificationDto,
  ) {
    return this.notificationsService.getUserNotifications(user._id, filterNotificationDto)
  }

  @ApiOperation({
    summary: 'Obtener conteo de notificaciones no leídas',
    description:
      'Obtiene el número total de notificaciones no leídas del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Conteo de notificaciones no leídas obtenido exitosamente',
    type: UnreadCountResponseDto,
  })
  @ApiErrors(['unauthorized'])
  @Get('unread-count')
  async getUnreadCount(@User() user: UserAuth) {
    return this.notificationsService.getUnreadCount(user._id)
  }

  @ApiOperation({
    summary: 'Marcar todas las notificaciones como leídas',
    description: 'Marca todas las notificaciones del usuario autenticado como leídas',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas las notificaciones marcadas como leídas exitosamente',
    type: MarkReadResponseDto,
  })
  @ApiErrors(['unauthorized'])
  @Patch('read')
  async markAllAsRead(@User() user: UserAuth) {
    return this.notificationsService.markAllAsRead(user._id)
  }

  @ApiOperation({
    summary: 'Marcar notificación específica como leída',
    description: 'Marca una notificación específica como leída utilizando su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la notificación a marcar como leída',
    type: String,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída exitosamente',
    type: MarkSingleReadResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Patch(':id/read')
  async markAsRead(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.markAsRead(id)
  }

  @ApiOperation({
    summary: 'Eliminar notificación',
    description: 'Elimina permanentemente una notificación específica utilizando su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la notificación a eliminar',
    type: String,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación eliminada exitosamente',
    type: DeleteNotificationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Delete(':id')
  async deleteNotification(@Param('id', ParseMongoIdPipe) id: string) {
    return this.notificationsService.deleteNotification(id)
  }
}
