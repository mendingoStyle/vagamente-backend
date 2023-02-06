import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { UtilsModule } from '../utils/utils.module'
import { AuthController } from './auth.controller'
import { TokenModule } from 'modules/token/tokenController.module'
import { LocalStrategy } from './guard/local.strategy'
import { JwtStrategy } from './guard/jwt.strategy'
import { AxiosModule } from 'modules/axios/axios.module'


@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    UtilsModule,
    TokenModule,
    UsersModule,
    AxiosModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
