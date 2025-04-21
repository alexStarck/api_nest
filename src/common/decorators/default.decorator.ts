import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyUpdatedRequest } from '../services/helper.service';
import { EntityManager } from 'typeorm';

export const Transaction = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): EntityManager => {
        const request: FastifyUpdatedRequest = ctx.switchToHttp().getRequest();
        return request.entityManager;
    },
);

export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request: FastifyUpdatedRequest = ctx.switchToHttp().getRequest();
        return request.jwt_token.id;
    },
);
