import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'

import { UserAuth } from '@/types'

import { User } from '@/models/user.model'
import { Project, ProjectDocument } from '@/models/project.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'

import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectUsersDto,
  FilterProjectsDto,
} from '@/projects/dto/request'
import { ColumnsService } from '@/columns-task/columns.service'
import { UserService } from '@/user/user.service'
import { NotificationsService } from '@/notifications/notifications.service'
import { toObjectId } from '@/common/transformer.mongo-id'

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
    await this.checkCodeExist(createProjectDto.code, userAuth._id, userAuth)

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

  async findAll(
    userAuth: UserAuth,
    filterDto: FilterProjectsDto = {},
    projectIds?: Types.ObjectId[],
  ): Promise<{
    projects: any[]
    total: number
  }> {
    const { search, page = 1, limit = 10 } = filterDto
    const skip = (page - 1) * limit

    const matchStage: FilterQuery<ProjectDocument> = {
      companyId: userAuth.companyId,
      ...(projectIds ? { _id: { $in: projectIds } } : {}),
    }

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const [result] = await this.projectModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'leaderId',
          foreignField: '_id',
          as: 'leader',
          pipeline: [{ $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0 } }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'membersId',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { password: 0, __v: 0, updatedAt: 0, createdAt: 0 } }],
        },
      },
      {
        $addFields: {
          leader: { $arrayElemAt: ['$leader', 0] },
        },
      },
      {
        $project: {
          __v: 0,
          updatedAt: 0,
          createdAt: 0,
        },
      },
      {
        $facet: {
          data: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ])

    const projects = result.data || []
    const total = result.total[0]?.count || 0

    return {
      projects,
      total,
    }
  }

  async findOne(
    id: string | Types.ObjectId,
    userAuth: UserAuth,
    withMembers = false,
  ): Promise<Project> {
    const project = await this.projectModel
      .findOne({ _id: id, companyId: userAuth.companyId })
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

  async update(id: string, updateProjectDto: UpdateProjectDto, userAuth: UserAuth) {
    await this.checkCodeExist(updateProjectDto.code, toObjectId(id), userAuth)

    const project = await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    })

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

  async checkCodeExist(code: string, id: Types.ObjectId, userAuth: UserAuth) {
    const project = await this.projectModel.findOne({
      code,
      companyId: userAuth.companyId,
      _id: { $ne: id },
    })

    if (project)
      throw new BadRequestException({
        code: 'code_already_exists',
        message: 'The code already exists',
      })

    return true
  }
}
