import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "../auth/auth.controller";
import { UsersEntity } from "./entities/users.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AwsS3Service } from "../common/aws/aws-s3.service";
import { AuthService } from "../auth/auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, AwsS3Service],
})
export class UsersModule {}
