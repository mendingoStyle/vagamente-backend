import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { IAccessToken } from 'modules/auth/interfaces/jwt.interface'
import { UsersService } from 'modules/users/users.service'
import { UtilsService } from 'modules/utils/utils.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TokenExpiredError } from 'jsonwebtoken'
import { Users } from 'database/schemas/users.schema'
import { GetUser } from 'modules/users/dto/users.get.dto'


@Injectable()
export class TokenService {
  constructor(
    private utils: UtilsService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) { }



  async loginDefault(payload: IAccessToken): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('SECRET_KEY'),
      expiresIn: this.config.get('TOKEN_EXPIRE_TIME'),
    })

    return { accessToken }
  }


  async verifyTokenRefresh(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token,
        { secret: this.config.get('SECRET_KEY_REFRESH') }
      )
      return decodedToken
    } catch (error) {
      throw this.utils.throwForbiddenException(
        'Não autorizado'
      )
    }
  }

  async verifyToken(token: string): Promise<IAccessToken> {
    try {
      const decodedToken = this.jwtService.verify(token,
        { secret: this.config.get('SECRET_KEY') }
      )
      return decodedToken
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw this.utils.throwForbiddenException('Token Expirou')
      }
      this.utils.throwForbiddenException(
        'Não autorizado'
      )
    }
  }

  async verifyTokenChangePassword(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token,
        { secret: this.config.get('SECRET_KEY_FORGETPASSWORD') }
      )
      return decodedToken
    } catch (error) {
      console.log(error)
      if (error instanceof TokenExpiredError) {
        throw this.utils.throwForbiddenException(
          'Token Expirou'
        )
      }
      throw this.utils.throwForbiddenException(
        'Não autorizado'
      )
    }
  }




  async createTokenConfirmEmail(user: GetUser) {
    const acessToken = {
      accessToken: this.jwtService.sign(
        {
          sub: user._id,
          id: user._id,
          changePassword: true,
          confirmPassword: false
        },
        {
          secret: this.config.get('SECRET_KEY_CONFIRMEMAIL'),
          expiresIn: this.config.get('TOKEN_EXPIRE_TIME_CONFIRMEMAIL'),
        }
      ),
    }
    return acessToken
  }

  async verifyTokenConfirmEmail(token: string): Promise<IAccessToken> {
    try {
      const decodedToken = this.jwtService.verify(token,
        { secret: this.config.get('SECRET_KEY_CONFIRMEMAIL') }
      )
      return decodedToken
    } catch (error) {
      console.log(error)
      if (error instanceof TokenExpiredError) {
        throw this.utils.throwForbiddenException(
          'Token Expirou'
        )
      }
      throw this.utils.throwForbiddenException(
        'Não autorizado'
      )
    }
  }



  async verifyTokenTwoFactors(token: string): Promise<IAccessToken> {
    try {
      const decodedToken = this.jwtService.verify(token,
        { secret: this.config.get('SECRET_KEY_TWOFACTORS'), }
      )
      return decodedToken
    } catch (error) {
      console.log(error)
      if (error instanceof TokenExpiredError) {
        throw this.utils.throwForbiddenException(
          'Token Expirou'
        )
      }
      throw this.utils.throwForbiddenException(
        'Não autorizado'
      )
    }
  }


}
