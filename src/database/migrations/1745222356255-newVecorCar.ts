import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewVecorCar1745222356255 implements MigrationInterface {
  name = 'NewVecorCar1745222356255';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "cars_search_vector_idx"
      ON "cars"
      USING GIN (
        to_tsvector('simple', coalesce("brand", '') || ' ' || coalesce("model", ''))
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "cars_search_vector_idx"`);
  }
}
