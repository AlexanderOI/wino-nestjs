import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { hash } from 'bcrypt'

import { User, UserDocument } from '@/models/user.model'
import { permissions } from '@/permissions/constants/permissions'
import { Permission } from '@/models/permission.model'
import { Role } from '@/models/role.model'
import { Company, CompanyDocument } from '@/models/company.model'
import { UserCompany, UserCompanyDocument } from '@/models/user-company.model'
import {
  initialUsers,
  initialRoles,
  initialCompany,
  initialTasks,
  initialProjects,
} from './data.seed'
import { ActivityDocument } from '@/models/activity.model'
import { Activity } from '@/models/activity.model'
import { TaskDocument } from '@/models/task.model'
import { Task } from '@/models/task.model'
import { ColumnTask } from '@/models/column-task.model'
import { ProjectDocument } from '@/models/project.model'
import { Project } from '@/models/project.model'
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

    return { message: 'Datos iniciales creados exitosamente' }
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

  private async insertUsers(company: Company, roles: Role[]) {
    let adminUser: UserDocument | null = null

    await this.companyModel.findByIdAndUpdate(company._id, {
      rolesId: roles.map((role) => role._id),
    })

    for (const userData of initialUsers) {
      const hashedPassword = await hash(userData.password, 10)
      const role = roles[userData.roleType === 'admin' ? 0 : 1]

      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword,
        currentCompanyId: company._id,
      })

      if (userData.roleType === 'admin') {
        adminUser = user
      }

      const userCompany = await this.userCompanyModel.create({
        userId: user._id,
        companyId: company._id,
        rolesId: [role._id],
        roleType: userData.roleType,
      })

      await this.companyModel.findByIdAndUpdate(company._id, {
        $push: {
          usersCompany: userCompany._id,
        },
        owner: userData.roleType === 'admin' ? user._id : company.owner,
      })
    }

    return adminUser
  }

  private async insertProjects(adminUser: UserDocument) {
    const projects = initialProjects.map((project) => ({
      ...project,
      leaderId: adminUser._id,
      companyId: adminUser.currentCompanyId,
    }))

    const firstProject = await this.projectModel.create(projects[0])
    const otherProjects = await this.projectModel.create(projects.slice(1))

    await Promise.all(
      otherProjects.map((project) =>
        this.columnService.createDefaultColumns(project._id),
      ),
    )

    const columns = await this.columnService.createDefaultColumns(firstProject._id)

    for (const taskData of initialTasks) {
      const column = columns[taskData.column]
      const task = await this.taskModel.create({
        ...taskData,
        projectId: firstProject._id,
        columnId: column._id,
      })
    }
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
}
