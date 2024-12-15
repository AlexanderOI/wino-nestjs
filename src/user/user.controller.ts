import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from '@/auth/auth.decorator'
import { RequestWithUser } from 'types'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'

@Auth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req: RequestWithUser) {
    return this.userService.create(createUserDto, req.user)
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.userService.findAll(req.user)
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.remove(id)
  }

  @Get('change-current-company/:companyId')
  changeCurrentCompany(
    @Request() req: RequestWithUser,
    @Param('companyId', ParseMongoIdPipe) companyId: string,
  ) {
    return this.userService.changeCurrentCompany(companyId, req.user)
  }
}
