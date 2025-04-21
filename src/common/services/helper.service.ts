import { iterate } from 'iterare';
import { ValidationError } from 'class-validator';
import { EntityManager } from 'typeorm';
import { FastifyRequest } from 'fastify';
import { UserEntity } from '../../database/models/user.model';
import { Injectable } from '@nestjs/common';
import { pbkdf2Sync } from 'crypto';

export class TokenData {
    id: string;
    email: string;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.email = user.email;
    }
}

export type FastifyUpdatedRequest = FastifyRequest & {
    jwt_token: TokenData;
    entityManager: EntityManager;
};

function prependConstraintsWithParentProp(
    parentPath: string,
    error: ValidationError,
): ValidationError {
    if (!error.constraints) return error;

    const constraints: Record<string, string> = {};
    for (const key in error.constraints) {
        constraints[key] = `${parentPath}.${error.constraints[key]}`;
    }

    return {
        ...error,
        constraints,
    };
}

function mapChildrenToValidationErrors(
    error: ValidationError,
    parentPath?: string,
): ValidationError[] {
    if (!error.children?.length) {
        return [error];
    }

    const validationErrors: ValidationError[] = [];
    const currentPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

    for (const child of error.children) {
        if (child.children?.length) {
            validationErrors.push(
                ...mapChildrenToValidationErrors(child, currentPath),
            );
        }

        if (child.constraints) {
            validationErrors.push(
                prependConstraintsWithParentProp(currentPath, child),
            );
        }
    }

    return validationErrors;
}

export function flattenValidationErrors(
    validationErrors: ValidationError[],
): string[] {
    return iterate(validationErrors)
        .map(mapChildrenToValidationErrors)
        .flatten()
        .filter(error => !!error.constraints)
        .map(error =>
            Object.values(error.constraints as Record<string, string>),
        )
        .flatten()
        .toArray();
}

@Injectable()
export class HelperService {
    constructor() {}

    getpbkdf2(password: string): string {
        const hashPassword: Buffer = pbkdf2Sync(
            password,
            '4fj8h2gyue5d5jedvm',
            100000,
            64,
            'sha512',
        );
        return hashPassword.toString('hex');
    }
}
