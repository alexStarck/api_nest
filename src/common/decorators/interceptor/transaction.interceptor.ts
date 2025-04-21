import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EntityManager, QueryRunner } from 'typeorm';
import { FastifyUpdatedRequest } from '../../services/helper.service';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly entityManager: EntityManager) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<unknown>> {
        const httpContext = context.switchToHttp();
        const req: FastifyUpdatedRequest = httpContext.getRequest();

        const queryRunner: QueryRunner =
            this.entityManager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        req.entityManager = queryRunner.manager;

        return next.handle().pipe(
            tap(async () => {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }),
            catchError(async error => {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                throw error;
            }),
        );
    }
}
