import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { UserAuth } from 'types'

import { User } from '@/models/user.model'
import { Project, ProjectDocument } from '@/models/project.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'

import { CreateProjectDto } from '@/projects/dto/create-project.dto'
import { UpdateProjectDto } from '@/projects/dto/update-project.dto'
import { AddProjectUsersDto } from '@/projects/dto/add-project.dto'

import { ColumnsService } from '@/columns-task/columns.service'
import { UserService } from '@/user/user.service'
import { FormsTaskService } from '@/forms-task/forms-task.service'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserCompany.name)
    private readonly userCompanyModel: Model<UserCompanyDocument>,
    private readonly columnsService: ColumnsService,
    private readonly userService: UserService,
    private readonly formTaskService: FormsTaskService,
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

  async setProjectUsers(id: string, addProjectUsersDto: AddProjectUsersDto) {
    const project = await this.projectModel.findById(id)

    if (!project) throw new NotFoundException('Project not found')

    const users = await this.userModel.find({
      _id: { $in: addProjectUsersDto.membersId },
    })

    if (!users) throw new NotFoundException('Users not found')

    await project.updateOne({ membersId: users.map((user) => user._id) })

    return project.membersId
  }

  async getProjectsByCompanyId(companyId: string, userAuth: UserAuth) {
    const userCompany = await this.userCompanyModel.findOne({
      userId: userAuth._id,
      companyId,
    })

    if (!userCompany)
      throw new NotFoundException('The user is not a member of this company')

    const projects = await this.projectModel.find({
      companyId,
    })

    if (!projects) throw new NotFoundException('Projects not found')

    return projects
  }

  async assignFormTaskToProject(
    projectId: string,
    formTaskId: string,
    userAuth: UserAuth,
  ) {
    const project = await this.projectModel.findById(projectId)

    if (!project) throw new NotFoundException('Project not found')

    const formTask = await this.formTaskService.findOne(formTaskId, userAuth)

    await project.updateOne({ formTaskId: formTask._id })

    return { message: 'FormTask assigned to project successfully' }
  }
}
