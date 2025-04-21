import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/request/create-article.dto';
import {
    GetSingleArticleResponse,
    GetSingleArticleSuccessResponse,
} from './dto/response/get-single-article.dto';
import { AuthGuard } from '../common/decorators/guard/auth.guard';
import { TransactionInterceptor } from '../common/decorators/interceptor/transaction.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    CreateArticleResponse,
    CreateArticleSuccessResponse,
} from './dto/response/create-article.dto';
import { Transaction, UserId } from '../common/decorators/default.decorator';
import { EntityManager } from 'typeorm';
import {
    DeleteArticleResponse,
    DeleteArticleSuccessResponse,
} from './dto/response/delete-article.dto';
import { UpdateArticleDto } from './dto/request/update-article.dto';
import { ScrollArticleDto } from './dto/request/scroll-article.dto';
import {
    GetMultiArticleResponse,
    GetMultiArticleSuccessResponse,
} from './dto/response/get-multi-article.dto';
import {
    UpdateArticleResponse,
    UpdateArticleSuccessResponse,
} from './dto/response/update-article.dto';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    @ApiOperation({ summary: 'Get scroll articles' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetMultiArticleSuccessResponse,
    })
    find(@Query() query: ScrollArticleDto): Promise<GetMultiArticleResponse> {
        return this.articleService.find(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get single article' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetSingleArticleSuccessResponse,
    })
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetSingleArticleResponse> {
        return this.articleService.findOne(id.toString());
    }

    @Post()
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create article' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: CreateArticleSuccessResponse,
    })
    create(
        @Body() dto: CreateArticleDto,
        @UserId() userId: string,
        @Transaction() entityManager: EntityManager,
    ): Promise<CreateArticleResponse> {
        return this.articleService.create(dto, userId, entityManager);
    }

    @Patch(':id')
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update article' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UpdateArticleSuccessResponse,
    })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateArticleDto,
        @Transaction() entityManager: EntityManager,
    ): Promise<UpdateArticleResponse> {
        return this.articleService.update(id, dto, entityManager);
    }

    @Delete(':id')
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete article' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: DeleteArticleSuccessResponse,
    })
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Transaction() entityManager: EntityManager,
    ): Promise<DeleteArticleResponse> {
        return this.articleService.delete(id.toString(), entityManager);
    }
}
