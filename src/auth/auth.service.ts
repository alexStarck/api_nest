import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RegisterLoginDto } from './dto/request/registerLoginDto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse, LoginSuccessResponse } from './dto/response/login.dto';
import {
    JWTResponse,
    ValidateTokenErrorResponse,
    ValidateTokenResponse,
    ValidateTokenSuccessResponse,
} from './dto/response/jwt.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: RegisterLoginDto): Promise<LoginResponse> {
        const user = await this.usersService.findOneByEmail(dto);
        return new LoginSuccessResponse(
            this.generateToken(user.id, user.email),
        );
    }

    async register(dto: RegisterLoginDto, entityManager: EntityManager) {
        return this.usersService.createIfNotExistByEmail(dto, entityManager);
    }

    private generateToken(id: string, email: string): JWTResponse {
        const payload = { sub: id, email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    verifyToken(token: string): ValidateTokenResponse {
        try {
            const data: Record<string, string> = this.jwtService.verify(token);
            return new ValidateTokenSuccessResponse(data.sub, data.email);
        } catch (e) {
            return new ValidateTokenErrorResponse(e.message);
        }
    }
}
