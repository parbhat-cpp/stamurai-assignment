import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get(':org_id')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async getTasksByOrg(@Param('org_id') org_id: string) {
    return this.taskService.getTasks(org_id);
  }

  @Put('update/:task_id')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('task_id') taskId: string,
  ) {
    return this.taskService.update(updateTaskDto, taskId);
  }

  @Delete('delete/:task_id')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async deleteTask(@Param('task_id') task_id: string) {
    return this.taskService.del(task_id);
  }
}
