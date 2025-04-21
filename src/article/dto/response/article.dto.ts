import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../database/models/user.model';
import {
    IsEmail,
    IsNumberString,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleEntity } from '../../../database/models/article.model';

export class CreatedUserDto {
    constructor(user: UserEntity) {
        this.id = user.id;
        this.email = user.email;
    }

    @ApiProperty({ example: '1' })
    @IsNumberString()
    id: string;

    @ApiProperty()
    @IsEmail()
    @Length(5, 320)
    email: string;
}

export class ArticleDto {
    constructor(article: ArticleEntity) {
        this.id = article.id;
        this.title = article.title;
        this.description = article.description;
        if (article.user) {
            this.createdUser = new CreatedUserDto(article.user);
        }
    }

    @ApiProperty({ example: '1' })
    @IsNumberString()
    id: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({ type: CreatedUserDto, required: false })
    @Type(() => CreatedUserDto)
    @ValidateNested()
    createdUser: CreatedUserDto;
}
