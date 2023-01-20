import { IsNotEmpty, IsString } from 'class-validator'

export class CaptchaDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @IsNotEmpty()
  equation: string
}
