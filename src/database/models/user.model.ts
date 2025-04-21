import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.model';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => ArticleEntity, article => article.user)
    articles: ArticleEntity[];
}
