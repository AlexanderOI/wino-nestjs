import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hash } from 'bcrypt'

import {
  initialUsers,
  initialCompany,
  initialTasks,
  initialProjects,
  initialRoles,
} from '@/data/data.seed'
import { avatarColors } from '@/user/constants/avatar-colors'
import { permissions } from '@/permissions/constants/permissions'

import { User, UserDocument } from '@/models/user.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'
import { Company, CompanyDocument } from '@/models/company.model'
import { Project, ProjectDocument } from '@/models/project.model'
import { Activity, ActivityDocument } from '@/models/activity.model'
import { Task, TaskDocument } from '@/models/task.model'
import { ColumnTask } from '@/models/column-task.model'
import { Permission } from '@/models/permission.model'
import { Role } from '@/models/role.model'

import { ColumnsService } from '@/columns-task/columns.service'

@Injectable()
export class DataService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(UserCompany.name)
    private readonly userCompanyModel: Model<UserCompanyDocument>,
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(ColumnTask.name)
    private readonly columnTaskModel: Model<ColumnTask>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,

    private columnService: ColumnsService,
  ) {}

  async create() {
    await this.deleteAll()
    const createdPermissions = await this.insertPermissions()
    const company = await this.insertCompany()
    const roles = await this.insertRoles(createdPermissions)
    const adminUser = await this.insertUsers(company, roles)
    await this.insertProjects(adminUser)

    return { message: 'Initial data created successfully' }
  }

  async createDemoData(userId: unknown) {
    const user = await this.userModel.findById(userId)
    const company = await this.companyModel.findOne({ isMain: true, owner: userId })
    const roles = await this.roleModel.find({ _id: { $in: company.rolesId } })
    await this.insertUsers(company, roles, user)
    await this.insertProjects(user)
  }

  private async insertPermissions() {
    const createdPermissions = await this.permissionModel.insertMany(permissions)
    return createdPermissions
  }

  private async insertCompany() {
    const company = await this.companyModel.create({
      ...initialCompany,
      isMain: true,
    })
    return company
  }

  private async insertRoles(permissions: Permission[]) {
    const permissionIds = permissions.map((permission) => permission._id)

    const rolesWithPermissions = initialRoles.map((role) => ({
      ...role,
      permissions: permissionIds,
    }))

    const roles = (await this.roleModel.insertMany(
      rolesWithPermissions,
    )) as unknown as Role[]
    return roles
  }

  private async insertUsers(company: Company, roles: Role[], user?: UserDocument) {
    let adminUser: UserDocument | null = user || null

    if (!user) {
      await this.companyModel.findByIdAndUpdate(company._id, {
        rolesId: roles.map((role) => role._id),
      })
    }

    const hashedPasswords = await Promise.all(
      initialUsers.map((userData) => hash(userData.password, 10)),
    )

    const usersToInsert = initialUsers.map((userData, index) => {
      const role = user ? roles[0] : roles[userData.roleType === 'admin' ? 0 : 1]
      const { userName, email } = userData

      let newUserName: string
      if (user) {
        newUserName = userName + '_' + company.name + '_' + Date.now() + '_' + index
      } else {
        newUserName = userData.roleType === 'admin' ? userName : userName + company.name
      }

      let newEmail: string
      if (user) {
        const emailParts = email.split('@')
        newEmail = `${emailParts[0]}_${company.name}_${Date.now()}_${index}@${company.name}.com`
      } else {
        newEmail = `${email.split('@')[0]}_${company.name}@${company.name}.com`
      }

      const avatarColor = this.getRandomAvatarColor()

      return {
        ...userData,
        userName: newUserName,
        email: newEmail,
        password: user ? user.password : hashedPasswords[index],
        currentCompanyId: company._id,
        avatarColor,
      }
    })

    const createdUsers = (await this.userModel.insertMany(
      usersToInsert,
    )) as UserDocument[]

    const userCompaniesToInsert = createdUsers.map((newUser, index) => {
      const userData = initialUsers[index]
      const role = user ? roles[0] : roles[userData.roleType === 'admin' ? 0 : 1]

      return {
        userId: newUser._id,
        companyId: company._id,
        rolesId: [role._id],
        roleType: userData.roleType,
      }
    })

    const createdUserCompanies =
      await this.userCompanyModel.insertMany(userCompaniesToInsert)

    const adminUserIndex = initialUsers.findIndex(
      (userData) => userData.roleType === 'admin',
    )
    if (adminUserIndex !== -1 && !user) {
      adminUser = createdUsers[adminUserIndex]
    }

    const owner = user?._id || (adminUser ? adminUser._id : company.owner)

    await this.companyModel.findByIdAndUpdate(company._id, {
      $push: {
        usersCompany: { $each: createdUserCompanies.map((uc) => uc._id) },
      },
      owner,
    })

    return adminUser
  }

  private async insertProjects(adminUser: UserDocument) {
    const users = await this.userModel
      .find({ currentCompanyId: adminUser.currentCompanyId })
      .select('_id')

    const usersIds = users.map((user) => user._id)

    const projects = initialProjects.map((project) => ({
      ...project,
      leaderId: adminUser._id,
      companyId: adminUser.currentCompanyId,
      membersId: usersIds,
    }))

    const createdProjects = await this.projectModel.insertMany(projects)

    const projectColumns = await Promise.all(
      createdProjects.map((project) =>
        this.columnService.createDefaultColumns(project._id, adminUser.currentCompanyId),
      ),
    )

    const taskDistribution = [
      { projectIndex: 0, startTask: 0, endTask: 26 }, // WINO - Project and Task Manager
      { projectIndex: 1, startTask: 26, endTask: 56 }, // EXO – Expense Organizer
      { projectIndex: 2, startTask: 56, endTask: 68 }, // BOW - Battle of Words
      { projectIndex: 3, startTask: 68, endTask: 78 }, // LINKIO - Link Interaction Online
    ]

    const allTasksToInsert = taskDistribution.flatMap((distribution) => {
      const project = createdProjects[distribution.projectIndex]
      const columns = projectColumns[distribution.projectIndex]
      const projectTasks = initialTasks.slice(
        distribution.startTask,
        distribution.endTask,
      )

      return projectTasks.map((taskData, index) => {
        const column = columns[taskData.column]
        return {
          ...taskData,
          code: distribution.startTask + index + 1,
          order: index + 1,
          projectId: project._id,
          columnId: column._id,
          companyId: adminUser.currentCompanyId,
          assignedToId: usersIds[Math.floor(Math.random() * usersIds.length)],
        }
      })
    })

    await this.taskModel.insertMany(allTasksToInsert)
  }

  async deleteAll() {
    await Promise.all([
      this.userModel.deleteMany({}),
      this.permissionModel.deleteMany({}),
      this.roleModel.deleteMany({}),
      this.companyModel.deleteMany({}),
      this.userCompanyModel.deleteMany({}),
      this.activityModel.deleteMany({}),
      this.projectModel.deleteMany({}),
      this.taskModel.deleteMany({}),
      this.columnTaskModel.deleteMany({}),
    ])
  }

  getRandomAvatarColor() {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)]
  }
}
