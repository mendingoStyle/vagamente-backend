import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TokenExpiredError } from 'jsonwebtoken'
import { UtilsService } from 'modules/utils/utils.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private utilsService: UtilsService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (await super.canActivate(context)) as boolean
  }

  handleRequest(err, user) {
    const isExpired = err instanceof TokenExpiredError
    if (err || !user) {
      if (isExpired)
        throw this.utilsService.throwExpiredException('Token expirado')
      throw this.utilsService.throwUnauthorizedException('Não autorizado')
    }
    return user
  }
}
