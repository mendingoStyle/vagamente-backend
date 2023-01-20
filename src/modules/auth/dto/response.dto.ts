import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class ResponseDto {
  @IsPositive()
  statusCode: number

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  message: string[]
}
