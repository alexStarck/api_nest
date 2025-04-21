import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ArticleDto } from '../../article/dto/response/article.dto';
import {
    ArticleCacheFailedResponse,
    ArticleCacheResponse,
    ArticleCacheSuccessResponse,
} from './dto/article.cache.dto';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async getArticleCache(id: string): Promise<ArticleCacheResponse> {
        const article = await this.cacheManager.store.get<ArticleDto>(
            `article:${id}`,
        );
        if (!article) {
            return new ArticleCacheFailedResponse('Article cache not found');
        }
        return new ArticleCacheSuccessResponse(article);
    }

    async setArticleCache(id: string, dto: ArticleDto): Promise<void> {
        await this.cacheManager.store.set<ArticleDto>(`article:${id}`, dto, {
            ttl: 3600,
        } as never);
    }

    async invalidateArticleCache(id: string): Promise<void> {
        await this.cacheManager.store.del(`article:${id}`);
    }
}
