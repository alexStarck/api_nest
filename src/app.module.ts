import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [DatabaseModule, UsersModule, ArticleModule, AuthModule],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
