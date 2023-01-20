import { IsNotEmpty, IsString } from 'class-validator'

export class ForgotPasswordPayloadDto {
  @IsNotEmpty()
  document: string

  @IsNotEmpty()
  email: string

  password?: string

  @IsString()
  token: string

}
