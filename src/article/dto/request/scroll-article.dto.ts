import { IsInt, IsNumberString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ScrollArticleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    cursor?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional()
    @IsOptional()
    authorId?: string;
}
