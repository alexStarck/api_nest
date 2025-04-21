import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleDto } from './article.dto';
import { ArticleEntity } from '../../../database/models/article.model';

export type GetSingleArticleResponse =
    | GetSingleArticleSuccessResponse
    | GetSingleArticleErrorResponse;

export class GetSingleArticleErrorResponse {
    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class GetSingleArticleSuccessResponse {
    constructor(article: ArticleEntity) {
        this.message = new ArticleDto(article);
        this.error = false;
    }

    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty({ type: ArticleDto })
    @Type(() => ArticleDto)
    @ValidateNested()
    message: ArticleDto;
}
