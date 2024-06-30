import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClientExtended } from './prima.config'

@Injectable()
export class PrismaService
  extends PrismaClientExtended
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect()
  }
}
