import {
    IsInt,
    isNumberString,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
    validateSync,
    ValidationError,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { flattenValidationErrors } from '../services/helper.service';

class RedisConfig {
    @IsString()
    host: string;

    @IsInt()
    @Min(0)
    @Max(65535)
    port: number;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;
}
class MainConfig {
    port: number;

    postgres: string;

    redis: RedisConfig;
}

class EnvironmentVariables {
    @IsInt()
    @Min(0)
    @Max(65535)
    @Type(() => Number)
    PORT =
        process.env.PORT && isNumberString(process.env.PORT)
            ? parseInt(process.env.PORT)
            : 3000;

    @IsString()
    @IsUrl({
        protocols: ['postgresql'],
        require_protocol: true,
        require_host: false,
    })
    POSTGRESQL: string;

    @IsString()
    REDIS: string;
}

export function validateConfig(configuration: Record<string, unknown>) {
    const configToValidate = plainToInstance(
        EnvironmentVariables,
        configuration,
        {
            enableImplicitConversion: true,
        },
    );

    const errors: ValidationError[] = validateSync(configToValidate, {
        whitelist: true,
        forbidUnknownValues: true,
    });

    if (errors.length > 0) {
        throw new Error(flattenValidationErrors(errors).join(' , '));
    }

    const redisUrl = new URL(`redis://${configToValidate.REDIS}`);
    if (!!redisUrl.username && !redisUrl.password) {
        [redisUrl.password, redisUrl.username] = [
            redisUrl.username,
            redisUrl.password,
        ];
    }
    const redisConfig: RedisConfig = {
        host: redisUrl.hostname,
        port: parseInt(redisUrl.port) || 6379,
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
    };

    const redisValidation = plainToInstance(RedisConfig, redisConfig);
    const redisErrors = validateSync(redisValidation);
    if (redisErrors.length > 0) {
        throw new Error(flattenValidationErrors(redisErrors).join(' , '));
    }

    const finalConfig: MainConfig = {
        port: configToValidate.PORT,
        postgres: configToValidate.POSTGRESQL,
        redis: redisConfig,
    };

    console.info('Config loaded successfully:', finalConfig);
    return finalConfig;
}
