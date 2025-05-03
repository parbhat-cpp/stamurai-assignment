import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organisation,
  OrganisationDocument,
} from './schemas/organisation.schema';
import mongoose, { Model, Types } from 'mongoose';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class OrganisationService {
  constructor(
    @InjectModel(Organisation.name)
    private orgModel: Model<OrganisationDocument>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(createOrganisationDto: CreateOrganisationDto) {
    const req = this.request;
    const user = req['user'];

    const orgs = await this.orgModel.find({
      admin: user._id,
    });

    if (orgs.length >= 3) {
      throw new BadRequestException('Cannot create more than 3 organisations');
    }

    const { members, name, managers } = createOrganisationDto;

    if (!members.length) {
      throw new BadRequestException(
        'Add at least one member to the organisation',
      );
    }

    const createOrg = await this.orgModel.create({
      admin: user._id,
      name: name,
      members: members,
      managers: managers,
    });

    return createOrg;
  }

  async get() {
    const req = this.request;
    const user = req['user'];
    const userId = new Types.ObjectId(user['_id']);

    const orgs = await this.orgModel
      .find({
        $or: [{ admin: userId }, { members: userId }, { managers: userId }],
      })
      .populate('members', '-password')
      .populate('managers', '-password')
      .exec();

    return orgs;
  }

  async update(updateOrganisationDto: UpdateOrganisationDto, orgId: string) {
    const req = this.request;
    const user = req['user'];
    const userId = user['_id'];

    const org = await this.orgModel.findOne({
      _id: orgId,
    });

    if (!org) {
      throw new NotFoundException('Organisation not found');
    }

    const { managers, admin } = org;

    const isUserManager = managers.includes(userId);
    const isUserAdmin = admin == userId;

    if (isUserManager) {
      org.members = updateOrganisationDto.members.map(
        (memberId) => new mongoose.Types.ObjectId(memberId),
      );
      org.save();

      return 'Organisation updated by a manager';
    }

    if (isUserAdmin) {
      org.managers = updateOrganisationDto.managers.map(
        (userId) => new mongoose.Types.ObjectId(userId),
      );
      org.members = updateOrganisationDto.members.map(
        (userId) => new mongoose.Types.ObjectId(userId),
      );
      org.save();
      return 'Organisation updated by the admin';
    }

    throw new UnauthorizedException('Not authorized to update organisation');
  }

  async del(orgId: string) {
    const req = this.request;
    const user = req['user'];

    const org = await this.orgModel.deleteOne({
      _id: orgId,
      admin: user['_id'],
    });

    if (!org) {
      throw new NotFoundException('Organisation not found');
    }

    return {
      message: 'Organisation deleted successfully',
    };
  }
}
