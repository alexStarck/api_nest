import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export type CreateArticleResponse =
    | CreateArticleSuccessResponse
    | CreateArticleErrorResponse;

export class CreateArticleErrorResponse {
    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class CreateArticleSuccessResponse {
    constructor(id: string) {
        this.message = id;
        this.error = false;
    }

    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty()
    @IsString()
    message: string;
}
