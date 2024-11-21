import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../common/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

@Controller({
  path: "users",
  version: "1",
})
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get("profile")
  getUserProfile(@Req() request: Request) {
    return this.usersService.getActiveUser(request);
  }

  @Post("/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException("Only .jpg and .png files are allowed!"),
            false
          );
        }
        callback(null, true);
      },
    })
  )
  uploadUserProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request
  ) {
    return this.usersService.uploadUserProfile(file, request);
  }
}
