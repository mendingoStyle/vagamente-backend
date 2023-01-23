import { IsNotEmpty, IsString } from 'class-validator'
export class UserChangePasswordDTO {
  @IsString()
  @IsNotEmpty({ message: 'Campo password não pode ser vázia' })
  password: string

  @IsString()
  @IsNotEmpty({ message: 'Campo confirmPassword não pode estar vazio' })
  confirmPassword: string



}

