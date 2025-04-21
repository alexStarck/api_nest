import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    GetSingleArticleResponse,
    GetSingleArticleSuccessResponse,
} from './dto/response/get-single-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
    EntityManager,
    FindOptionsWhere,
    LessThan,
    Not,
    Repository,
} from 'typeorm';
import { ArticleEntity } from '../database/models/article.model';
import { CreateArticleDto } from './dto/request/create-article.dto';
import {
    CreateArticleResponse,
    CreateArticleSuccessResponse,
} from './dto/response/create-article.dto';
import {
    DeleteArticleResponse,
    DeleteArticleSuccessResponse,
} from './dto/response/delete-article.dto';
import {
    UpdateArticleResponse,
    UpdateArticleSuccessResponse,
} from './dto/response/update-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { ScrollArticleDto } from './dto/request/scroll-article.dto';
import {
    GetMultiArticleResponse,
    GetMultiArticleSuccessResponse,
} from './dto/response/get-multi-article.dto';
import { CacheService } from '../common/services/cache.service';
import { isFailedArticleCache } from '../common/services/dto/article.cache.dto';
import { ArticleDto } from './dto/response/article.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articlesRepository: Repository<ArticleEntity>,
        private readonly cacheService: CacheService,
    ) {}

    async findOne(id: string): Promise<GetSingleArticleResponse> {
        const cache = await this.cacheService.getArticleCache(id);
        if (!isFailedArticleCache(cache)) {
            return { error: false, message: cache.message };
        }

        const article = await this.articlesRepository.findOne({
            where: { id: id },
            select: {
                id: true,
                title: true,
                description: true,
                user: { id: true, email: true },
            },
            relations: { user: true },
        });

        if (!article) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }

        await this.cacheService.setArticleCache(id, new ArticleDto(article));

        return new GetSingleArticleSuccessResponse(article);
    }

    async find(dto: ScrollArticleDto): Promise<GetMultiArticleResponse> {
        const { authorId, cursor, limit = 10 } = dto;
        const where: FindOptionsWhere<ArticleEntity> = {};
        if (cursor) {
            where.id = LessThan(cursor);
        }

        if (authorId) {
            where.user_id = authorId;
        }

        const count: number = await this.articlesRepository.count({ where });

        const articles = await this.articlesRepository.find({
            where,
            relations: ['user'],
            order: { id: 'DESC' },
            take: limit,
        });

        const nextCursor =
            articles.length > 0 ? articles[articles.length - 1].id : undefined;

        return new GetMultiArticleSuccessResponse(articles, count, nextCursor);
    }

    async create(
        dto: CreateArticleDto,
        userId: string,
        entityManager: EntityManager,
    ): Promise<CreateArticleResponse> {
        const repository: Repository<ArticleEntity> =
            entityManager.getRepository(ArticleEntity);

        const exist = await repository.findOne({
            where: { title: dto.title },
            select: { id: true, title: true },
        });
        if (exist) {
            throw new ConflictException(
                `Article with title ${dto.title} already exists`,
            );
        }

        const article = repository.create({ ...dto, user_id: userId });
        await repository.save(article);

        return new CreateArticleSuccessResponse(article.id);
    }

    async update(
        id: string,
        dto: UpdateArticleDto,
        entityManager: EntityManager,
    ): Promise<UpdateArticleResponse> {
        const repository: Repository<ArticleEntity> =
            entityManager.getRepository(ArticleEntity);

        const existTitle: boolean = Object.hasOwn(dto, 'title');
        const articles = await repository.find({
            where: [
                { id },
                ...(existTitle ? [{ title: dto.title, id: Not(id) }] : []),
            ],
        });

        const targetArticle = articles.find(a => a.id === id);
        if (!targetArticle) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }
        if (existTitle) {
            const conflictArticle = articles.find(
                a => a.title === dto.title && a.id !== id,
            );
            if (conflictArticle) {
                throw new BadRequestException(
                    `Article with title "${dto.title}" already exists`,
                );
            }
        }

        Object.assign(targetArticle, dto);

        await repository.save(targetArticle);
        await this.cacheService.invalidateArticleCache(targetArticle.id);

        return new UpdateArticleSuccessResponse(targetArticle.id);
    }

    async delete(
        id: string,
        entityManager: EntityManager,
    ): Promise<DeleteArticleResponse> {
        const repository: Repository<ArticleEntity> =
            entityManager.getRepository(ArticleEntity);

        const exist = await repository.findOne({
            where: { id },
            select: { id: true },
        });
        if (!exist) {
            throw new NotFoundException(`Article with id ${id} not found`);
        }

        await repository.delete(id);
        await this.cacheService.invalidateArticleCache(id);
        return new DeleteArticleSuccessResponse(id);
    }
}
