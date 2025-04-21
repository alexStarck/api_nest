import {
    Body,
    Controller,
    HttpStatus,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterLoginDto } from './dto/request/registerLoginDto';
import { TransactionInterceptor } from '../common/decorators/interceptor/transaction.interceptor';
import { EntityManager } from 'typeorm';
import { Transaction } from '../common/decorators/default.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    RegistrationResponse,
    RegistrationSuccessResponse,
} from './dto/response/register.dto';
import { LoginResponse, LoginSuccessResponse } from './dto/response/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UseInterceptors(TransactionInterceptor)
    @ApiOperation({ summary: 'Register' })
    @ApiResponse({ status: HttpStatus.OK, type: RegistrationSuccessResponse })
    register(
        @Body() dto: RegisterLoginDto,
        @Transaction() entityManager: EntityManager,
    ): Promise<RegistrationResponse> {
        return this.authService.register(dto, entityManager);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: HttpStatus.OK, type: LoginSuccessResponse })
    login(@Body() dto: RegisterLoginDto): Promise<LoginResponse> {
        return this.authService.login(dto);
    }
}
