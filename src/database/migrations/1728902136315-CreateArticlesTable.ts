import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticlesTable1728902136315 implements MigrationInterface {
  name = 'CreateArticlesTable1728902136315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "publishDate" date NOT NULL, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "articles"`);
  }
}
