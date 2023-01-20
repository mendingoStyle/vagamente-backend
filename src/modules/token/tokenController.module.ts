import { forwardRef, Module } from '@nestjs/common'
import { TokenService } from './tokenController.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TokenController } from './tokenController.controller'
import { UtilsModule } from 'modules/utils/utils.module'

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('SECRET_KEY_REFRESH'),
        signOptions: { expiresIn: config.get('TOKEN_EXPIRE_TIME_REFRESH') },
      }),
      inject: [ConfigService],
    }),
    UtilsModule
  ],
  exports: [TokenService],
})
export class TokenModule { }
