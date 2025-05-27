import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor, File } from '@nest-lab/fastify-multer'

import { multerOptions } from '@/cloudinary/config/multer.config'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { User } from '@/auth/decorators/user.decorator'
import { Auth } from '@/auth/auth.decorator'

import { UserAuth } from '@/types'

import { UserService } from '@/user/user.service'
import { CreateUserDto } from '@/user/dto/create-user.dto'
import { UpdateUserDto } from '@/user/dto/update-user.dto'
import { CreateInvitedUserDto } from '@/user/dto/create-invited-user.dto'
import { UpdateInvitedUserDto } from '@/user/dto/update-invited-user.dto'

@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(PERMISSIONS.CREATE_USER)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: UserAuth) {
    return this.userService.create(createUserDto, user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.userService.findAll(user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.userService.findOne(id, user)
  }

  @Auth(PERMISSIONS.EDIT_USER)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserAuth,
  ) {
    return this.userService.update(id, updateUserDto, user)
  }

  @Auth(PERMISSIONS.DELETE_USER)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.userService.remove(id, user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get('change-current-company/:companyId')
  changeCurrentCompany(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.changeCurrentCompany(companyId, user)
  }

  @Auth(PERMISSIONS.EDIT_USER)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAvatar(@UploadedFile() file: File, @User() user: UserAuth) {
    return this.userService.uploadAvatar(file, user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/:userId')
  createInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() createInvitedUserDto: CreateInvitedUserDto,
    @User() user: UserAuth,
  ) {
    return this.userService.createInvitedUser(userId, createInvitedUserDto, user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get('invited-user/:userName')
  findInvitedUser(@Param('userName') userName: string, @User() user: UserAuth) {
    return this.userService.findInvitedUser(userName, user)
  }

  @Auth(PERMISSIONS.EDIT_USER)
  @Patch('invited-user/:userId')
  updateInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() updateInvitedUserDto: UpdateInvitedUserDto,
    @User() user: UserAuth,
  ) {
    return this.userService.updateInvitedUser(userId, updateInvitedUserDto, user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/accept/:companyId')
  acceptInvitedUser(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.acceptInvitedUser(companyId, user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/reject/:companyId')
  rejectInvitedUser(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.rejectInvitedUser(companyId, user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/leave/:companyId')
  leaveCompany(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.leaveCompany(companyId, user)
  }

  @Auth(PERMISSIONS.DELETE_USER)
  @Delete('invited-user/:userId')
  deleteInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.deleteInvitedUser(userId, user)
  }
}
