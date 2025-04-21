import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumberString } from 'class-validator';

export class CreateUserDto {
    constructor(id: string) {
        this.message = id;
        this.error = false;
    }

    @ApiProperty({ example: false })
    @IsBoolean()
    error: false;

    @ApiProperty({})
    @IsNumberString()
    message: string;
}
