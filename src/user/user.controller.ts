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
import { CreateInvitedUserDto } from './dto/create-invited-user.dto'
import { UpdateInvitedUserDto } from './dto/update-invited-user.dto'
import { PERMISSIONS } from '@/permissions/constants/permissions'
@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(PERMISSIONS.CREATE_USER)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req: RequestWithUser) {
    return this.userService.create(createUserDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.userService.findAll(req.user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.userService.findOne(id, req.user)
  }

  @Auth(PERMISSIONS.EDIT_USER)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.update(id, updateUserDto, req.user)
  }

  @Auth(PERMISSIONS.DELETE_USER)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @Request() req: RequestWithUser) {
    return this.userService.remove(id, req.user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get('change-current-company/:companyId')
  changeCurrentCompany(
    @Request() req: RequestWithUser,
    @Param('companyId', ParseMongoIdPipe) companyId: string,
  ) {
    return this.userService.changeCurrentCompany(companyId, req.user)
  }

  @Auth(PERMISSIONS.EDIT_USER)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.uploadAvatar(file, req.user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/:userId')
  createInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() createInvitedUserDto: CreateInvitedUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.createInvitedUser(userId, createInvitedUserDto, req.user)
  }

  @Auth(PERMISSIONS.VIEW_USER)
  @Get('invited-user/:userName')
  findInvitedUser(@Param('userName') userName: string, @Request() req: RequestWithUser) {
    return this.userService.findInvitedUser(userName, req.user)
  }

  @Auth(PERMISSIONS.EDIT_USER)
  @Patch('invited-user/:userId')
  updateInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() updateInvitedUserDto: UpdateInvitedUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.updateInvitedUser(userId, updateInvitedUserDto, req.user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/accept/:companyId')
  acceptInvitedUser(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.acceptInvitedUser(companyId, req.user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/reject/:companyId')
  rejectInvitedUser(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.rejectInvitedUser(companyId, req.user)
  }

  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/leave/:companyId')
  leaveCompany(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.leaveCompany(companyId, req.user)
  }

  @Auth(PERMISSIONS.DELETE_USER)
  @Delete('invited-user/:userId')
  deleteInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.userService.deleteInvitedUser(userId, req.user)
  }
}
