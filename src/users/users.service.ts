import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "./entities/users.entity";
import { Repository } from "typeorm";
import { Request } from "express";
import { AwsS3Service } from "../common/aws/aws-s3.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,

    private awsS3Service: AwsS3Service
  ) {}

  async getUsers() {
    return await this.usersRepository.find({
      select: {
        id: true,
        email: true,
        user_name: true,
        display_name: true,
        photo: true,
      },
    });
  }

  async getActiveUser(request: Request) {
    const { id } = request.user;

    const activeUser = await this.usersRepository.findOne({ where: { id } });
    if (!activeUser) {
      throw new ForbiddenException("UnAuthorized");
    }

    return {
      message: "Success",
      error: null,
      statusCode: HttpStatus.OK,
      data: {
        ...activeUser,
        password: undefined,
      },
    };
  }

  async uploadUserProfile(file: Express.Multer.File, request: Request) {
    const activeUser = request.user;

    const awsData = await this.awsS3Service.uploadFile(file);

    if (!awsData) {
      throw new BadRequestException("AWS error");
    }

    await this.usersRepository.update(
      { id: activeUser.id },
      {
        photo: awsData.Location,
      }
    );

    return {
      message: "User profile uploaded success",
      error: null,
      statusCode: HttpStatus.OK,
      data: "OK",
    };
  }
}
