import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { validateConfig } from '../common/config/validate.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'node:path';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            ignoreEnvFile: true,
            expandVariables: true,
            isGlobal: true,
            cache: true,
            validate: validateConfig,
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>('redis.host');
                const port = configService.get<number>('redis.port');
                const username = configService.get<string>('redis.username');
                const password = configService.get<string>('redis.password');
                const ttl = 0;

                const redisOptions: Record<string, unknown> = {
                    socket: { host, port },
                    ttl,
                };

                if (password) redisOptions.password = password;
                if (username) redisOptions.username = username;

                const store = (await redisStore(
                    redisOptions,
                )) as unknown as CacheStore;

                return {
                    store,
                    ttl,
                };
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService,
            ): Promise<TypeOrmModuleOptions> => {
                const uri: URL = new URL(
                    configService.get<string>('postgres')!,
                );

                return {
                    schema: 'public',
                    type: 'postgres',
                    host: uri.hostname,
                    port: Number(uri.port),
                    username: uri.username,
                    password: uri.password,
                    database: 'api',
                    synchronize: false,
                    autoLoadEntities: false,
                    migrationsRun: true,
                    migrationsTransactionMode: 'each',
                    logging: 'all',
                    entities: [
                        path.resolve(`${__dirname}/models/*.model{.js,.ts}`),
                    ],
                    migrations: [path.resolve(`${__dirname}/migrations/*.js`)],
                    migrationsTableName: 'migration_log',
                };
            },
        }),
    ],
})
export class DatabaseModule {}
