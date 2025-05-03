import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Delete,
  Query,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';

@Controller('organisation')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Post('create')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async createOrganisation(
    @Body() createOrganisationDto: CreateOrganisationDto,
  ) {
    return this.organisationService.create(createOrganisationDto);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async getMyOrganisations() {
    return this.organisationService.get();
  }

  @Put('update/:org_id')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async updateOrganisation(
    @Body() updateOrganisationDto: UpdateOrganisationDto,
    @Param('org_id') orgId: string,
  ) {
    return this.organisationService.update(updateOrganisationDto, orgId);
  }

  @Delete('delete')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async deleteOrganisation(@Query('org_id') orgId: string) {
    return this.organisationService.del(orgId);
  }
}
