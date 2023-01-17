import { IsOptional, IsPositive } from "@nestjs/class-validator"
import { Type } from 'class-transformer'

export class PaginationPayloadDto {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    limit?: number = 10

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page?: number = 1
    
}
