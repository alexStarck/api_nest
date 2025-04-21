import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitProject1745139600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE users
                                 (
                                     id         BIGSERIAL PRIMARY KEY,
                                     email      VARCHAR(255) NOT NULL UNIQUE,
                                     password   VARCHAR(255) NOT NULL,
                                     created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
                                 );`);

        await queryRunner.query(`CREATE TABLE articles
                                 (
                                     id          BIGSERIAL PRIMARY KEY,
                                     title       VARCHAR(255) NOT NULL,
                                     description TEXT         NOT NULL,
                                     created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
                                     user_id     INTEGER      NOT NULL,
                                     CONSTRAINT fk_author FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                                 );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `drop table if exists public."articles" cascade;`,
        );
        await queryRunner.query(`drop table if exists public."users" cascade;`);
    }
}
