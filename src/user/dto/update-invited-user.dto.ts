import { PartialType } from '@nestjs/mapped-types'
import { CreateInvitedUserDto } from './create-invited-user.dto'

export class UpdateInvitedUserDto extends PartialType(CreateInvitedUserDto) {}
