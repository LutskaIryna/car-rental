import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchIndexToCars1741545206551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE cars ADD COLUMN search_vector tsvector;
      UPDATE cars SET search_vector = to_tsvector('simple', brand || ' ' || model);
      CREATE INDEX cars_search_idx ON cars USING GIN(search_vector);
      
      CREATE OR REPLACE FUNCTION cars_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector = to_tsvector('simple', NEW.brand || ' ' || NEW.model);
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER trigger_update_search_vector
      BEFORE INSERT OR UPDATE ON cars
      FOR EACH ROW EXECUTE FUNCTION cars_search_trigger();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_search_vector ON cars;
      DROP FUNCTION IF EXISTS cars_search_trigger;
      DROP INDEX IF EXISTS cars_search_idx;
      ALTER TABLE cars DROP COLUMN IF EXISTS search_vector;
    `);
  }
}
