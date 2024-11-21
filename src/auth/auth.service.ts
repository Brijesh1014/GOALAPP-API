import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ILogin } from "../types/users/ILogin";
import { UsersEntity } from "../users/entities/users.entity";
import { Repository } from "typeorm";
import { CreateUser } from "../types/users/IUser";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async createAccount(payload: CreateUser) {
    const { display_name, email, password, user_name, photo } = payload;
    if (!email || !password || !user_name) {
      throw new BadRequestException("Missing required properties");
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException(
        `Account with email ${email} already using this app`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userObject = this.userRepository.create({
      email,
      password: hashedPassword,
      email_verified: false,
      display_name,
      photo,
      user_name,
    });

    const userData = await this.userRepository.save(userObject);

    return {
      message: "Account created success",
      error: null,
      statusCode: HttpStatus.CREATED,
      data: userData,
    };
  }

  async login(payload: ILogin) {
    const { email, password } = payload;

    if (!email || !password) {
      throw new BadRequestException("Invalid Email or Password");
    }

    const user = await this.userRepository.findOne({
      where: { email },
      // select: {
      //   id: true,
      //   email: true,
      //   email_verified: true,
      //   display_name: true,
      //   user_name: true,
      //   created_at: true,
      //   photo: true,
      //   updated_at: true,
      // },
    });
    if (!user) {
      throw new NotFoundException("Account is not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid Email or Password");
    }

    const excludedPasswordUserPayload = {
      ...user,
      password: undefined,
    };

    const secretKey = this.configService.get("JWT_SECRET");

    const access_token = await this.jwtService.signAsync(
      excludedPasswordUserPayload,
      { secret: secretKey }
    );

    return {
      message: "Login success",
      error: null,
      statusCode: HttpStatus.OK,
      data: {
        access_token,
        user: excludedPasswordUserPayload,
      },
    };
  }
}
