import { IsArray, IsString, MinLength } from 'class-validator';

export class CreateOrganisationDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsArray()
  managers: Array<string>;

  @IsArray()
  members: Array<string>;
}
