import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../database/models/article.model';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity]), CommonModule],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
