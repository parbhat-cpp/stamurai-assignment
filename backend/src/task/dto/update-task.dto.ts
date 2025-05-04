import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../schemas/task.schema';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  title?: string;
  description?: string;
  assigned_to?: string[];
  due_date?: string;
  org_id?: string;
  priority?: boolean;
  status?: TaskStatus;
}
