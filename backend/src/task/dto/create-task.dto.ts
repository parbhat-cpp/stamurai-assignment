import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  org_id: string;

  @IsArray()
  assigned_to: Array<string>;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  due_date: string;

  @IsBoolean()
  priority: boolean;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
