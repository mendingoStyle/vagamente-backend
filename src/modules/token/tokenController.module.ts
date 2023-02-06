import { forwardRef, Module } from '@nestjs/common'
import { TokenService } from './tokenController.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TokenController } from './tokenController.controller'
import { UtilsModule } from 'modules/utils/utils.module'
import { MongooseModule } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenSchema } from 'database/schemas/refresh_token.schema'
import { Users, UsersSchema } from 'database/schemas/users.schema'
import { RefreshJwtStrategy } from 'modules/auth/refresh-jwt.strategy'

@Module({
  controllers: [TokenController],
  providers: [TokenService, RefreshJwtStrategy],
  imports: [
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('SECRET_KEY_REFRESH'),
        signOptions: { expiresIn: config.get('TOKEN_EXPIRE_TIME_REFRESH') },
      }),
      inject: [ConfigService],
    }),
    UtilsModule,
  ],
  exports: [TokenService],
})
export class TokenModule { }
