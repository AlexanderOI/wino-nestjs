import { Controller, Get } from '@nestjs/common'
import { DataService } from './data.service'

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('create')
  create() {
    if (process.env.ENV === 'development') {
      return this.dataService.create()
    }

    return { message: 'No se puede crear datos en producción' }
  }
}
