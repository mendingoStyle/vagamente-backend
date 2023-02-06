import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { IAccessToken } from 'modules/auth/interfaces/jwt.interface'
import { UsersService } from 'modules/users/users.service'
import { UtilsService } from 'modules/utils/utils.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TokenExpiredError } from 'jsonwebtoken'
import { Users, UsersDocument } from 'database/schemas/users.schema'
import { GetUser } from 'modules/users/dto/users.get.dto'
import { ForgetPasswordPayloadDto } from './dto/forgetPassword.dto'
import { RefreshTokenResultDto } from './dto/refresh.dto'
import { RefreshToken, RefreshTokenDocument } from 'database/schemas/refresh_token.schema'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'


@Injectable()
export class TokenService {
  constructor(
    private utils: UtilsService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
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


  async createTokenChangePassword(user: ForgetPasswordPayloadDto) {
    const accessToken = {
      accessToken: this.jwtService.sign(
        {
          email: user.email,
          sub: user.id,
          id: user.id,
          changePassword: true,
          confirmPassword: false
        },
        {
          secret: this.config.get('SECRET_KEY_FORGETPASSWORD'),
          expiresIn: this.config.get('TOKEN_EXPIRE_TIME_FORGETPASSWORD'),
        }
      ),
    }
    return accessToken
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

  async createTokens(payload: IAccessToken): Promise<RefreshTokenResultDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('SECRET_KEY'),
      expiresIn: this.config.get('TOKEN_EXPIRE_TIME'),
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('SECRET_KEY_REFRESH'),
      expiresIn: this.config.get('TOKEN_EXPIRE_TIME_REFRESH'),
    })

    await this.createOrUpdate({ token: refreshToken, user_id: payload.id })
    return { accessToken, refreshToken }
  }
  async createOrUpdate(refreshToken: {
    token: string, user_id: any
  }): Promise<RefreshToken> {
    return await this.refreshTokenModel.create({ ...refreshToken, created_at: new Date() })
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      this.refreshTokenModel.remove({ token: token })
      return { message: 'logout feito com sucesso' }
    } catch (e) {
      console.log(e)
    }
  }
  async refresh(refreshToken: string): Promise<RefreshTokenResultDto> {
    let oldRefreshToken = await this.refreshTokenModel.findOne({ refreshToken: refreshToken })
    const verifyToken = await this.verifyTokenRefresh(refreshToken)
    let user: Users = null
    if (oldRefreshToken) {
      if (oldRefreshToken.user_id != verifyToken.sub)
        throw this.utils.throwUnauthorizedException('Não autorizado')
      user = await this.usersModel.findOne({ _id: oldRefreshToken?.user_id?.toString() })
    } else {
      throw this.utils.throwInvalidRefreshTokenException('Não autorizado refaça o login')
    }
    const payload = {
      id: user._id,
      user: user.email,
      sub: user._id,
      changePassword: false,
      confirmEmail: false,
      refresh: true
    } as IAccessToken

    const tokens = await this.createTokens(payload)
    return tokens
  }



}
