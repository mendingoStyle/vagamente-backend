import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { UtilsModule } from '../utils/utils.module'
import { AuthController } from './auth.controller'
import { TokenModule } from 'modules/token/tokenController.module'


@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    UtilsModule,
    TokenModule,
    UsersModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
