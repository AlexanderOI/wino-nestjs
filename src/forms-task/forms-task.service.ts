import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CreateFormsTaskDto } from '@/forms-task/dto/create-forms-task.dto'
import { UpdateFormsTaskDto } from '@/forms-task/dto/update-forms-task.dto'

import { FormTask } from '@/models/form-task.model'
import { Project } from '@/models/project.model'

import { UserAuth } from 'types'

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
      .select('name')
      .lean()

    const formTasksWithProjectName = formTasks.map((formTask) => {
      const project = projects.find((project) =>
        project.formTaskId.equals(formTask._id as Types.ObjectId),
      )
      return { ...formTask, projectName: project?.name ?? '' }
    })

    return formTasksWithProjectName
  }

  async findOne(id: string, user: UserAuth, fields: boolean = true) {
    console.log(id, fields)
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
}
