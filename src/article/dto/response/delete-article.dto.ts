import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export type DeleteArticleResponse =
    | DeleteArticleSuccessResponse
    | DeleteArticleErrorResponse;

export class DeleteArticleErrorResponse {
    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class DeleteArticleSuccessResponse {
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
