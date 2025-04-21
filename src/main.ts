import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const fastifyAdapter: FastifyAdapter = new FastifyAdapter({ logger: true });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyAdapter,
    );

    const configService: ConfigService = app.get(ConfigService);

    const port: number | undefined = configService.get<number>('port');

    app.useGlobalPipes(
        new ValidationPipe({
            enableDebugMessages: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            transform: true,
            whitelist: true,
        }),
    );

    await app.listen(port ?? 3000);
}

bootstrap();
