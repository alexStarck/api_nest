import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { JWTResponse } from './jwt.dto';

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export class LoginErrorResponse {
    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class LoginSuccessResponse {
    constructor(response: JWTResponse) {
        this.message = response;
        this.error = false;
    }

    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty({ type: JWTResponse })
    @Type(() => JWTResponse)
    message: JWTResponse;
}
