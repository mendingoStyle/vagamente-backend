import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { UtilsService } from 'modules/utils/utils.service'



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private utils: UtilsService
  ) {
    super({ usernameField: 'user' })
  }

  async validate(userLogin: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(userLogin, password)

    if (!user) {
      throw this.utils.throwNotFoundException(
        this.utils.errorMessages.invalidCredentials
      )
    }
    return user
  }
}
