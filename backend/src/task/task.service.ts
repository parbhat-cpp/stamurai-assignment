import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import mongoose, { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import {
  Organisation,
  OrganisationDocument,
} from 'src/organisation/schemas/organisation.schema';

@Injectable({ scope: Scope.REQUEST })
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    @InjectModel(Organisation.name)
    private orgModel: Model<OrganisationDocument>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    if (createTaskDto.assigned_to.length === 0) {
      throw new BadRequestException('Please assign task to atleast one member');
    }

    const req = this.request;
    const user = req['user'];
    const userId = user['_id'];
    const {
      assigned_to,
      description,
      due_date,
      org_id,
      priority,
      status,
      title,
    } = createTaskDto;

    const assignedUsers = assigned_to.map((memId) => new Types.ObjectId(memId));

    const org = await this.orgModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(org_id),
          $and: [
            {
              $or: [
                {
                  admin: new Types.ObjectId(userId),
                },
                {
                  managers: {
                    $in: [new Types.ObjectId(userId)],
                  },
                },
                {
                  members: {
                    $in: [new Types.ObjectId(userId)],
                  },
                },
              ],
            },
            {
              $or: [
                {
                  managers: {
                    $in: assignedUsers,
                  },
                },
                {
                  members: {
                    $in: assignedUsers,
                  },
                },
              ],
            },
          ],
        },
      },
    ]);

    if (!org.length) {
      throw new NotFoundException(
        'Cannot create a task: Organisation not found',
      );
    }

    const createTask = await this.taskModel.create({
      org_id: org_id,
      created_by: userId,
      assigned_to: assigned_to,
      title: title,
      description: description,
      due_date: new Date(due_date),
      priority: priority,
      status: status,
    });

    return createTask;
  }

  async getTasks(orgId: string) {
    const req = this.request;
    const user = req['user'];
    const userId = user['_id'];

    const org = await this.orgModel.find({
      $and: [
        {
          _id: orgId,
        },
        {
          $or: [{ admin: userId }, { managers: userId }, { members: userId }],
        },
      ],
    });

    if (!org.length) {
      throw new NotFoundException('You are not part of this organisation');
    }

    const assignedTasks = await this.taskModel.find({
      $and: [
        {
          org_id: orgId,
        },
        {
          assigned_to: userId,
        },
      ],
    });

    return assignedTasks;
  }

  async update(updateTaskDto: UpdateTaskDto, taskId: string) {
    const req = this.request;
    const user = req['user'];
    const userId = user['_id'];

    if (Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException(
        'Please provide valid data to update a task',
      );
    }

    const task = await this.taskModel.findOne({
      $and: [
        {
          _id: taskId,
        },
        {
          $or: [{ created_by: userId }, { assigned_to: userId }],
        },
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.taskModel.updateOne(
      {
        $and: [
          {
            _id: taskId,
          },
          {
            $or: [{ created_by: userId }, { assigned_to: userId }],
          },
        ],
      },
      {
        ...updateTaskDto,
      },
    );

    return updatedTask;
  }

  async del(taskId: string) {
    const req = this.request;
    const user = req['user'];
    const userId = user['_id'];

    const task = await this.taskModel.findOne({
      $and: [{ created_by: userId }, { _id: taskId }],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const delTask = await this.taskModel.deleteOne({
      $and: [{ created_by: userId }, { _id: taskId }],
    });

    return delTask;
  }
}
