import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { UserAuth } from '@/types'

import { User } from '@/models/user.model'
import { Project, ProjectDocument } from '@/models/project.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'

import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectUsersDto,
} from '@/projects/dto/request'
import { ColumnsService } from '@/columns-task/columns.service'
import { UserService } from '@/user/user.service'
import { NotificationsService } from '@/notifications/notifications.service'

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
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userAuth: UserAuth) {
    const project = await this.projectModel.create({
      ...createProjectDto,
      companyId: userAuth.companyId,
    })

    await this.columnsService.createDefaultColumns(project._id, userAuth.companyId)

    if (
      createProjectDto.leaderId &&
      createProjectDto.leaderId.toString() !== userAuth._id.toString()
    ) {
      await this.notificationsService.sendNotification({
        userIds: [createProjectDto.leaderId.toString()],
        title: 'New project',
        description: `You are the leader of the project ${project.name}`,
        link: `/projects/${project._id}`,
      })
    }

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

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel.findById(id)

    if (!project) throw new NotFoundException('Project not found')

    if (
      updateProjectDto.leaderId &&
      updateProjectDto.leaderId.toString() !== project.leaderId.toString()
    ) {
      await this.notificationsService.sendNotification({
        userIds: [updateProjectDto.leaderId.toString()],
        title: 'Project updated',
        description: `You are the leader of the project ${project.name}`,
        link: `/project/${project._id}`,
      })
    }

    return project
  }

  async remove(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id)

    if (!project) throw new NotFoundException('Project not found')

    await this.columnsService.deleteAllColumns(project._id)

    await this.notificationsService.sendNotification({
      userIds: project.membersId,
      title: 'Project deleted',
      description: `The project ${project.name} has been deleted`,
    })

    return project
  }

  async setProjectUsers(id: string, addProjectUsersDto: AddProjectUsersDto) {
    const project = await this.projectModel.findById(id)

    if (!project) throw new NotFoundException('Project not found')

    const users = await this.userModel.find({
      _id: { $in: addProjectUsersDto.membersId },
    })

    if (!users) throw new NotFoundException('Users not found')

    const currentMemberIds = project.membersId.map((id) => id.toString())
    const newMemberIds = addProjectUsersDto.membersId.map((id) => id.toString())

    const removedMemberIds = currentMemberIds.filter((id) => !newMemberIds.includes(id))

    const addedMemberIds = newMemberIds.filter((id) => !currentMemberIds.includes(id))

    if (removedMemberIds.length > 0) {
      await this.notificationsService.sendNotification({
        userIds: removedMemberIds,
        title: 'Project membership update',
        description: `You have been removed from the project ${project.name}`,
        link: `/project/${project._id}`,
      })
    }

    if (addedMemberIds.length > 0) {
      await this.notificationsService.sendNotification({
        userIds: addedMemberIds,
        title: 'Project membership update',
        description: `You have been added to the project ${project.name}`,
        link: `/project/${project._id}`,
      })
    }

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
}
