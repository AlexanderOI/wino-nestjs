import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { UserAuth } from 'types'
import { Model } from 'mongoose'
import { Project } from '@/models/project.model'
import { User } from '@/models/user.model'
import { InjectModel } from '@nestjs/mongoose'
import { toObjectId } from '@/common/transformer.mongo-id'
import { AddProjectUsersDto } from './dto/add-project.dto'
import { ColumnsService } from '../columns-task/columns.service'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly columnsService: ColumnsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userAuth: UserAuth) {
    const project = await this.projectModel.create({
      ...createProjectDto,
      company: userAuth.companyId,
      owner: toObjectId(createProjectDto.owner),
    })

    await this.columnsService.createDefaultColumns(project._id)

    return project
  }

  findAll(userAuth: UserAuth) {
    return this.projectModel.find({ company: userAuth.companyId })
  }

  findOne(id: string) {
    const project = this.projectModel.findById(id).populate([
      {
        path: 'usersTeam',
        model: 'User',
      },
      {
        path: 'owner',
        model: 'User',
      },
    ])

    if (!project) throw new NotFoundException('Project not found')

    return project
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = this.projectModel.findByIdAndUpdate(id, updateProjectDto)

    if (!project) throw new NotFoundException('Project not found')

    return project
  }

  remove(id: string) {
    const project = this.projectModel.findByIdAndDelete(id)

    if (!project) throw new NotFoundException('Project not found')

    return project
  }

  async setProjectUsers(id: string, addProjectUsersDto: AddProjectUsersDto) {
    const project = await this.findOne(id)

    const users = await this.userModel.find({
      _id: { $in: toObjectId(addProjectUsersDto.users) },
    })

    if (!users) throw new NotFoundException('Users not found')

    await project.updateOne({ usersTeam: users.map((user) => user._id) })

    return project.usersTeam
  }
}
