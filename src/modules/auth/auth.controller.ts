import {
  Body,
  Controller, Post,
} from '@nestjs/common'
import { LoginPayloadDto, LoginResultDto } from './dto/login.dto'
import { AuthService } from './auth.service'


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }
  
  @Post('login')
  async login(@Body() loginDto: LoginPayloadDto)
    : Promise<LoginResultDto | {}> {
    return await this.authService.login(loginDto)
  }
}