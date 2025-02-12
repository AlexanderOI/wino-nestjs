import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { UserAuth } from 'types'
import { Model, Types } from 'mongoose'
import { Project, ProjectDocument } from '@/models/project.model'
import { User } from '@/models/user.model'
import { InjectModel } from '@nestjs/mongoose'
import { AddProjectUsersDto } from './dto/add-project.dto'
import { ColumnsService } from '../columns-task/columns.service'
import { UserService } from '@/user/user.service'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly columnsService: ColumnsService,
    private readonly userService: UserService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userAuth: UserAuth) {
    const project = await this.projectModel.create({
      ...createProjectDto,
      companyId: userAuth.companyId,
    })

    await this.columnsService.createDefaultColumns(project._id)

    return project
  }

  async findAll(userAuth: UserAuth, projectIds?: Types.ObjectId[]): Promise<any[]> {
    const projects = await this.projectModel
      .find({
        companyId: userAuth.companyId,
        ...(projectIds ? { _id: { $in: projectIds } } : {}),
      })
      .select('-updatedAt -createdAt -__v')
      .lean()

    const projectsResponse = await Promise.all(
      projects.map((project) =>
        Promise.all([
          this.userService.findAll(userAuth, project.membersId, false),
          this.userService.findOne(project.leaderId, userAuth, false),
        ]).then(([members, leader]) => ({
          ...project,
          members,
          leader,
        })),
      ),
    )

    return projectsResponse
  }

  async findOne(
    id: string | Types.ObjectId,
    userAuth: UserAuth,
    withMembers = false,
  ): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .select('-updatedAt -createdAt -__v')
      .lean()

    if (!project) throw new NotFoundException('Project not found')

    const projectResponse = {
      ...project,

      members: withMembers
        ? await this.userService.findAll(userAuth, project.membersId, false)
        : [],
      leader: await this.userService.findOne(project.leaderId, userAuth, false),
    }

    return projectResponse
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

  async setProjectUsers(
    id: string,
    addProjectUsersDto: AddProjectUsersDto,
    userAuth: UserAuth,
  ) {
    const project = await this.projectModel.findById(id)

    if (!project) throw new NotFoundException('Project not found')

    const users = await this.userModel.find({
      _id: { $in: addProjectUsersDto.membersId },
    })

    if (!users) throw new NotFoundException('Users not found')

    await project.updateOne({ membersId: users.map((user) => user._id) })

    return project.membersId
  }
}
