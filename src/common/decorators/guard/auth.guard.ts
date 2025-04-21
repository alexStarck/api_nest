import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service';
import { FastifyUpdatedRequest } from '../../services/helper.service';
import {
    isErrorValidateTokenResponse,
    ValidateTokenResponse,
} from '../../../auth/dto/response/jwt.dto';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: FastifyUpdatedRequest = context
            .switchToHttp()
            .getRequest();

        let authStr: string | undefined = request.headers.authorization;
        if (!authStr || authStr.split(' ')[0] !== 'Bearer') {
            throw new UnauthorizedException('Authentication failed');
        }
        authStr = authStr.replace('Bearer ', '');

        const res: ValidateTokenResponse =
            this.authService.verifyToken(authStr);
        if (!isErrorValidateTokenResponse(res)) {
            request.jwt_token = {
                id: res.message.id,
                email: res.message.email,
            };

            return true;
        }
        throw new UnauthorizedException('Authentication failed');
    }
}
