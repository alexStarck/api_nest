import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.model';

@Entity({ name: 'articles' })
export class ArticleEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'bigint' })
    user_id: string;

    @ManyToOne(() => UserEntity, user => user.articles, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
