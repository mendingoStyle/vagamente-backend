import { RefreshJwtAuthGuard } from 'modules/auth/refresh-jwt-auth.guard';
import { TokenService } from './tokenController.service'
import { Controller, Post, Headers, UseGuards } from "@nestjs/common";
import { RefreshTokenResultDto } from './dto/refresh.dto';

@UseGuards(RefreshJwtAuthGuard)
@Controller()
export class TokenController {
  constructor(private readonly service: TokenService) { }

  @Post('logout')
  async logout(
    @Headers('authorization') refreshToken: string
  ): Promise<{ message: string }> {
    let token = refreshToken
    if (refreshToken?.startsWith('Bearer '))
      token = refreshToken.split('Bearer ')[1]
    return await this.service.logout(token)
  }

  @Post('refresh')
  refresh(
    @Headers('authorization') refreshToken: string
  ): Promise<RefreshTokenResultDto> {
    let token = refreshToken
    if (refreshToken?.startsWith('Bearer '))
      token = refreshToken.split('Bearer ')[1]

    return this.service.refresh(token)
  }

}
