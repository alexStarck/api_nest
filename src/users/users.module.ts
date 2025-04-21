import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from '../database/models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), CommonModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
