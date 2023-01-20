import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class LoginPayloadDto {
  @IsOptional()
  @IsString()
  document?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsString()
  @IsNotEmpty({ message: 'O campo senha não pode ser vazio' })
  password: string

  refresh?: boolean
}


export class LoginResultDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string

  name?: string

}

