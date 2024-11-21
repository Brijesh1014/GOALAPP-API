import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ILogin } from "../types/users/ILogin";
import { CreateUser } from "../types/users/IUser";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  login(@Body() payload: ILogin) {
    return this.authService.login(payload);
  }

  @Post("/signup")
  signup(@Body() payload: CreateUser) {
    return this.authService.createAccount(payload);
  }
}
