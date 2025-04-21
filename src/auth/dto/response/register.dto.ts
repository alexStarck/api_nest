import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumberString, IsString } from 'class-validator';

export type RegistrationResponse =
    | RegistrationSuccessResponse
    | RegistrationErrorResponse;

export class RegistrationErrorResponse {
    @ApiProperty({ example: true })
    @IsBoolean()
    error: true;

    @ApiProperty({ example: 'error' })
    @IsString()
    message: string;
}

export class RegistrationSuccessResponse {
    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty({})
    @IsNumberString()
    message: string;
}
