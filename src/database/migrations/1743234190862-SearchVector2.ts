import { MigrationInterface, QueryRunner } from 'typeorm';

export class SearchVector21743234190862 implements MigrationInterface {
  name = 'SearchVector21743234190862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cars"
      ADD COLUMN "search_vector" tsvector
    `);

    await queryRunner.query(`
      CREATE INDEX "cars_search_vector_idx"
      ON "cars"
      USING GIN ("search_vector")
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_search_vector()
      RETURNS trigger AS $$
      BEGIN
        NEW.search_vector := to_tsvector('simple', coalesce(NEW.brand, '') || ' ' || NEW.model);
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER cars_search_vector_trigger
      BEFORE INSERT OR UPDATE ON "cars"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS cars_search_vector_trigger ON "cars"
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_search_vector
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "cars_search_vector_idx"
    `);

    await queryRunner.query(`
      ALTER TABLE "cars"
      DROP COLUMN "search_vector"
    `);
  }
}
