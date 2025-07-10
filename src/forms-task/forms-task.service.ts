import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  CreateFormsTaskDto,
  UpdateFormsTaskDto,
  AssignFormTaskDto,
} from '@/forms-task/dto/request'

import { FormTask } from '@/models/form-task.model'
import { Project } from '@/models/project.model'

import { UserAuth } from '@/types'

@Injectable()
export class FormsTaskService {
  constructor(
    @InjectModel(FormTask.name) private readonly formTaskModel: Model<FormTask>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async create(createFormsTaskDto: CreateFormsTaskDto, user: UserAuth) {
    const { name, fields } = createFormsTaskDto

    const newFormTask = await this.formTaskModel.create({
      name: name,
      fields: fields,
      companyId: user.companyId,
    })

    return newFormTask
  }

  async findAll(user: UserAuth, fields: boolean = true) {
    let select = fields ? '-__v' : '-__v -fields'
    const formTasks = await this.formTaskModel
      .find({ companyId: user.companyId })
      .select(select)
      .lean()

    const projects = await this.projectModel
      .find({
        formTaskId: { $in: formTasks.map((formTask) => formTask._id) },
        companyId: user.companyId,
      })
      .select('name formTaskId')
      .lean()

    const formTasksWithProjectName = formTasks.map((formTask) => {
      const project = projects.find(
        (project) => project.formTaskId.toString() === formTask._id.toString(),
      )
      return { ...formTask, projectName: project?.name ?? '' }
    })

    return formTasksWithProjectName
  }

  async findOne(id: string | Types.ObjectId, user: UserAuth, fields: boolean = true) {
    let select = fields ? '-__v' : '-__v -fields'
    const formTask = await this.formTaskModel
      .findOne({ _id: id, companyId: user.companyId })
      .select(select)
      .exec()

    if (!formTask) throw new NotFoundException('FormTask not found')

    return formTask
  }

  async update(id: string, updateFormsTaskDto: UpdateFormsTaskDto, user: UserAuth) {
    const formTask = await this.formTaskModel
      .findOneAndUpdate({ _id: id, companyId: user.companyId }, updateFormsTaskDto, {
        new: true,
      })
      .exec()

    if (!formTask) throw new NotFoundException('FormTask not found')

    return formTask
  }

  async duplicate(id: string, user: UserAuth) {
    const formTask = await this.formTaskModel
      .findOne({ _id: id, companyId: user.companyId })
      .select('-__v -updatedAt -createdAt')
      .exec()

    if (!formTask) throw new NotFoundException('FormTask not found')

    const { _id, ...rest } = formTask

    const newFormTask = await this.formTaskModel.create({
      name: formTask.name + ' (duplicated)',
      fields: formTask.fields,
      companyId: user.companyId,
    })

    return newFormTask
  }

  async remove(id: string, user: UserAuth) {
    const formTask = await this.formTaskModel
      .findOneAndDelete({ _id: id, companyId: user.companyId })
      .exec()

    if (!formTask) throw new NotFoundException('FormTask not found')

    return { message: 'FormTask deleted successfully' }
  }

  async assignFormTaskToProject(
    formTaskId: string,
    assignFormTaskDto: AssignFormTaskDto,
    userAuth: UserAuth,
  ) {
    const formTask = await this.findOne(formTaskId, userAuth)

    if (formTask.hasProject) throw new NotFoundException('FormTask already has a project')

    const project = await this.projectModel.findOne({
      _id: assignFormTaskDto.projectId,
      companyId: userAuth.companyId,
    })

    if (!project) throw new NotFoundException('Project not found')

    if (project.formTaskId) {
      const formTask = await this.findOne(project.formTaskId, userAuth)
      await formTask.updateOne({ hasProject: false })
    }

    await project.updateOne({ formTaskId: formTask._id })
    await formTask.updateOne({ hasProject: true })

    return { message: 'FormTask assigned to project successfully' }
  }
}
