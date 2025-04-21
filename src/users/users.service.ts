import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { RegisterLoginDto } from '../auth/dto/request/registerLoginDto';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../database/models/user.model';
import { HelperService } from '../common/services/helper.service';
import { CreateUserDto } from './dto/response/create.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly helperService: HelperService,
    ) {}

    async findOneByEmail(dto: RegisterLoginDto): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            where: {
                email: dto.email,
                password: this.helperService.getpbkdf2(dto.password),
            },
            select: { id: true, email: true },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createIfNotExistByEmail(
        dto: RegisterLoginDto,
        entityManager: EntityManager,
    ): Promise<CreateUserDto> {
        const repository: Repository<UserEntity> =
            entityManager.getRepository(UserEntity);

        const existUser = await repository.findOneBy({
            email: dto.email,
        });

        if (existUser) {
            throw new ConflictException('User already exists');
        }

        const user: UserEntity = repository.create({
            password: this.helperService.getpbkdf2(dto.password),
            email: dto.email,
        });

        await repository.save(user);

        return new CreateUserDto(user.id);
    }
}
