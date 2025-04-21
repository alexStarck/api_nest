import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumberString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class JWTResponse {
    @ApiProperty({})
    @IsString()
    access_token: string;
}

export type ValidateTokenResponse =
    | ValidateTokenSuccessResponse
    | ValidateTokenErrorResponse;

export class JWTDataResponse {
    constructor(id: string, email: string) {
        this.id = id;
        this.email = email;
    }

    @ApiProperty({})
    @IsNumberString()
    id: string;

    @ApiProperty({})
    @IsString()
    email: string;
}

export class ValidateTokenErrorResponse {
    constructor(message: string) {
        this.message = message;
        this.error = true;
    }

    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class ValidateTokenSuccessResponse {
    constructor(sub: string, email: string) {
        this.message = new JWTDataResponse(sub, email);
        this.error = false;
    }

    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty({ type: JWTDataResponse })
    @Type(() => JWTDataResponse)
    message: JWTDataResponse;
}

export function isErrorValidateTokenResponse(
    response: ValidateTokenResponse,
): response is ValidateTokenErrorResponse {
    return response.error;
}
