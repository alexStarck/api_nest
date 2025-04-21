import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleDto } from './article.dto';
import { ArticleEntity } from '../../../database/models/article.model';

export type GetMultiArticleResponse =
    | GetMultiArticleSuccessResponse
    | GetMultiArticleErrorResponse;

export class MultiArticleScrollResponse {
    constructor(articles: ArticleEntity[], count: number, nextCursor?: string) {
        this.data = articles.map(item => new ArticleDto(item));
        this.count = count;
        if (nextCursor) {
            this.nextCursor = nextCursor;
        }
    }

    @ApiProperty({ example: [] })
    @IsArray()
    @Type(() => ArticleDto)
    @ValidateNested({ each: true })
    data: ArticleDto[];

    @ApiProperty({ example: 'error' })
    @IsInt()
    count: number;

    @ApiPropertyOptional({ example: '52' })
    @IsOptional()
    @IsString()
    nextCursor?: string;
}

export class GetMultiArticleErrorResponse {
    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class GetMultiArticleSuccessResponse {
    constructor(articles: ArticleEntity[], count: number, nextCursor?: string) {
        this.message = new MultiArticleScrollResponse(
            articles,
            count,
            nextCursor,
        );
        this.error = false;
    }

    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty({ type: MultiArticleScrollResponse })
    @Type(() => MultiArticleScrollResponse)
    @ValidateNested()
    message: MultiArticleScrollResponse;
}
