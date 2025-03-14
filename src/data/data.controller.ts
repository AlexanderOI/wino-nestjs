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

    return { message: 'This route is only available in development mode' }
  }
}
