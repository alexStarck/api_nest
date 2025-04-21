import { ArticleDto } from '../../../article/dto/response/article.dto';

export type ArticleCacheResponse =
    | ArticleCacheSuccessResponse
    | ArticleCacheFailedResponse;

export class ArticleCacheSuccessResponse {
    constructor(article: ArticleDto) {
        this.message = article;
        this.error = false;
    }

    error: false;
    message: ArticleDto;
}

export class ArticleCacheFailedResponse {
    constructor(message: string) {
        this.message = message;
        this.error = true;
    }

    error: true;
    message: string;
}

export function isFailedArticleCache(
    response: ArticleCacheResponse,
): response is ArticleCacheFailedResponse {
    return response.error;
}
