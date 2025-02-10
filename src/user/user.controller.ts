import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Auth } from '@/auth/auth.decorator'
import { RequestWithUser } from 'types'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '@/cloudinary/config/multer.config'

@Auth()
@Controller('users')
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
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.userService.findOne(id, req.user)
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.update(id, updateUserDto, req.user)
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.userService.remove(id, req.user)
  }

  @Get('change-current-company/:companyId')
  changeCurrentCompany(
    @Request() req: RequestWithUser,
    @Param('companyId', ParseMongoIdPipe) companyId: string,
  ) {
    return this.userService.changeCurrentCompany(companyId, req.user)
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.uploadAvatar(file, req.user)
  }
}
