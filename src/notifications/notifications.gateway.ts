import { Logger } from '@nestjs/common'
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { JwtService } from '@nestjs/jwt'

import { Server, Socket } from 'socket.io'
import { UserAuth } from '@/types'

import { NotificationsService } from '@/notifications/notifications.service'

@WebSocketGateway({
  cors: {
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name)

  @WebSocketServer()
  server: Server

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Initializing WebSocket Gateway...')
    this.notificationsService.setSocketServer(server)
    this.logger.log('WebSocket Gateway initialized successfully')
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1]

      if (!token) {
        this.logger.warn(`Connection attempt without token from client: ${client.id}`)
        client.disconnect()
        return
      }

      const payload: UserAuth = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_ACCESS,
      })

      if (!payload || !payload._id) {
        client.disconnect()
        return
      }

      const userId = payload._id.toString()
      await client.join(userId)

      this.logger.log(
        `Client connected successfully: ${client.id} - User: ${payload.name} id: ${userId}`,
      )
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}: ${error.message}`)
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
