import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { UtilsService } from '../utils/utils.service'
import { LoginPayloadDto, LoginResultDto } from './dto/login.dto'
import { IAccessToken } from './interfaces/jwt.interface'
import { Users } from 'database/schemas/users.schema'
import { TokenService } from 'modules/token/tokenController.service'
import { AxiosService } from 'modules/axios/axios.service'



@Injectable()
export class AuthService {

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private utils: UtilsService,
    private tokenService: TokenService,
    private readonly axiosService: AxiosService
  ) { }

  async validateUser(user: string, pass: string): Promise<boolean> {
    const userExists = await this.usersService.getCredentialsLogin({ email: user })
    if (!(await bcrypt.compare(pass, userExists.password))) {
      throw this.utils.throwErrorBadReqException(
        this.utils.errorMessages.invalidCredentials
      )
    }
    return true
  }


  async login(user: LoginPayloadDto)
    : Promise<LoginResultDto | {}> {
    let userExists: Users = await this.usersService.getCredentialsLogin({
      email: user.email
    })
    if (!userExists || !(await bcrypt.compare(user?.password, userExists?.password))) throw this.utils.throwNotFoundException(
      this.utils.errorMessages.invalidCredentials
    )
    const info: IAccessToken = {
      id: userExists._id,
      sub: userExists._id,
      changePassword: false,
      confirmEmail: false,
      email: userExists.email
    }
    let r = null
    if (!user.refresh) {
      const accessTokens = await this.tokenService.loginDefault(
        info
      )
      r = {
        ...accessTokens,
        name: userExists.name,
        id: userExists._id,
        avatar: userExists.avatar,
        username: userExists.username,
      }
    } else {
      const accessTokens = await this.tokenService.createTokens(
        info
      )
      r = {
        ...accessTokens,
        name: userExists.name,
        id: userExists._id,
        avatar: userExists.avatar,
        username: userExists.username,
      }
    }
    try {
      this.axiosService.internRequest({ user_id: r.id, created_at: new Date() }, 'users')
    } catch (e) {
      console.log(e)
    }
    return r
  }

}
