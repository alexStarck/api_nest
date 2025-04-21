import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { HelperService } from './services/helper.service';

@Module({
    imports: [],
    providers: [CacheService, HelperService],
    exports: [CacheService, HelperService],
})
export class CommonModule {}
