import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class ForgetPasswordPayloadDto {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsOptional()
  id?: number
}
export class ForgetResultDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string
}
