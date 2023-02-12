import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TokenExpiredError } from 'jsonwebtoken'
import { UtilsService } from '../../utils/utils.service'

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {
  constructor(private utilsService: UtilsService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (await super.canActivate(context)) as boolean
  }

  handleRequest(err, user) {
    const isExpired = err instanceof TokenExpiredError
    if (err || !user) {
      isExpired
        ? this.utilsService.throwExpiredException('Token expirado')
        : this.utilsService.throwUnauthorizedException('Não autorizado')
    }
    return user
  }
}
