import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterLoginDto {
    @ApiProperty()
    @IsEmail()
    @Length(5, 320)
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly password: string;
}
