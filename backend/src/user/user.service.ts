import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers user
   * @param registerData - User information (email, fullname & password)
   * @returns Users relavent data
   */
  async registerUser(registerData: CreateUserDto) {
    const { email, fullname, password } = registerData;

    const userExists = await this.userModel.findOne({
      email: email,
    });

    if (userExists) {
      throw new BadRequestException('User Already Exists with that email');
    }

    const createUser = new this.userModel({
      email: email,
      fullname: fullname,
      password: password,
    });

    await createUser.save();

    const userData = {
      email: createUser.email,
      fullname: createUser.fullname,
      _id: createUser._id,
    };

    const accessToken = await this.jwtService.signAsync(userData, {
      secret: config.JWT_SECRET,
      expiresIn: '15d',
    });

    return { ...userData, access_token: accessToken };
  }

  /**
   * Login user
   * @param email - User registered email
   * @param password - User login password
   * @returns User data
   */
  async loginUser(email: string, password: string) {
    const userExists = await this.userModel.findOne({
      email: email,
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await userExists.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid Password');
    }

    const userData = {
      email: userExists.email,
      fullname: userExists.fullname,
      _id: userExists._id,
    };

    const accessToken = await this.jwtService.signAsync(userData, {
      secret: config.JWT_SECRET,
      expiresIn: '15d',
    });

    return { ...userData, access_token: accessToken };
  }

  async deleteUser(email: string, password: string) {}
}
