import { Controller, Get } from '@nestjs/common'
import { DataService } from './data.service'

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('create')
  create() {
    return this.dataService.create()
  }

  @Get('delete')
  deleteAll() {
    return this.dataService.deleteAll()
  }
}
