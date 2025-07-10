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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger'

import { multerOptions } from '@/cloudinary/config/multer.config'
import { ParseMongoIdPipe } from '@/common/parse-mongo-id.pipe'
import { PERMISSIONS } from '@/permissions/constants/permissions'
import { User } from '@/auth/decorators/user.decorator'
import { Auth } from '@/auth/auth.decorator'
import { ApiErrors } from '@/common/decorators'

import { UserAuth } from '@/types'

import { UserService } from '@/user/user.service'
import {
  CreateUserDto,
  UpdateUserDto,
  CreateInvitedUserDto,
  UpdateInvitedUserDto,
} from '@/user/dto/request'
import {
  CreateUserResponseDto,
  UserResponseDto,
  UsersListResponseDto,
  UploadAvatarResponseDto,
  InvitedUserResponseDto,
  CompanyChangeResponseDto,
  UserOperationResponseDto,
} from '@/user/dto/response'

@ApiTags('users')
@ApiBearerAuth()
@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user with the specified roles and permissions in the current company',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_USER)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: UserAuth) {
    return this.userService.create(createUserDto, user)
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users belonging to the current company',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiErrors(['unauthorized'])
  @Auth(PERMISSIONS.VIEW_USER)
  @Get()
  findAll(@User() user: UserAuth) {
    return this.userService.findAll(user)
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.VIEW_USER)
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.userService.findOne(id, user)
  }

  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates an existing user with new information',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.EDIT_USER)
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserAuth,
  ) {
    return this.userService.update(id, updateUserDto, user)
  }

  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Deletes a user from the current company or completely if they have no other company associations',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user to delete',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.DELETE_USER)
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string, @User() user: UserAuth) {
    return this.userService.remove(id, user)
  }

  @ApiOperation({
    summary: 'Change current company',
    description: 'Changes the current active company for the authenticated user',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The unique identifier of the company to switch to',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Company changed successfully',
    type: CompanyChangeResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.VIEW_USER)
  @Get('change-current-company/:companyId')
  changeCurrentCompany(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.changeCurrentCompany(companyId, user)
  }

  @ApiOperation({
    summary: 'Upload user avatar',
    description: 'Uploads a new avatar image for the authenticated user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
    type: UploadAvatarResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.EDIT_USER)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAvatar(@UploadedFile() file: File, @User() user: UserAuth) {
    return this.userService.uploadImage(file, user)
  }

  @ApiOperation({
    summary: 'Create invited user',
    description: 'Invites an existing user to join the current company',
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user to invite',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 201,
    description: 'User invited successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/:userId')
  createInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() createInvitedUserDto: CreateInvitedUserDto,
    @User() user: UserAuth,
  ) {
    return this.userService.createInvitedUser(userId, createInvitedUserDto, user)
  }

  @ApiOperation({
    summary: 'Find invited user',
    description: 'Finds a user by username to potentially invite to the company',
  })
  @ApiParam({
    name: 'userName',
    description: 'The username of the user to find',
    example: 'johndoe',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: InvitedUserResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized', 'notFound'])
  @Auth(PERMISSIONS.VIEW_USER)
  @Get('invited-user/:userName')
  findInvitedUser(@Param('userName') userName: string, @User() user: UserAuth) {
    return this.userService.findInvitedUser(userName, user)
  }

  @ApiOperation({
    summary: 'Update invited user',
    description: 'Updates the role information of an invited user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the invited user to update',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Invited user updated successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.EDIT_USER)
  @Patch('invited-user/:userId')
  updateInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @Body() updateInvitedUserDto: UpdateInvitedUserDto,
    @User() user: UserAuth,
  ) {
    return this.userService.updateInvitedUser(userId, updateInvitedUserDto, user)
  }

  @ApiOperation({
    summary: 'Accept company invitation',
    description: 'Accepts an invitation to join a company',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The unique identifier of the company invitation to accept',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/accept/:companyId')
  acceptInvitedUser(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.acceptInvitedUser(companyId, user)
  }

  @ApiOperation({
    summary: 'Reject company invitation',
    description: 'Rejects an invitation to join a company',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The unique identifier of the company invitation to reject',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation rejected successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/reject/:companyId')
  rejectInvitedUser(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.rejectInvitedUser(companyId, user)
  }

  @ApiOperation({
    summary: 'Leave company',
    description: 'Leaves a company that the user is currently part of',
  })
  @ApiParam({
    name: 'companyId',
    description: 'The unique identifier of the company to leave',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Company left successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.CREATE_USER)
  @Post('invited-user/leave/:companyId')
  leaveCompany(
    @Param('companyId', ParseMongoIdPipe) companyId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.leaveCompany(companyId, user)
  }

  @ApiOperation({
    summary: 'Delete invited user',
    description: 'Cancels an invitation sent to a user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the invited user to remove',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Invited user deleted successfully',
    type: UserOperationResponseDto,
  })
  @ApiErrors(['badRequest', 'unauthorized'])
  @Auth(PERMISSIONS.DELETE_USER)
  @Delete('invited-user/:userId')
  deleteInvitedUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @User() user: UserAuth,
  ) {
    return this.userService.deleteInvitedUser(userId, user)
  }
}
