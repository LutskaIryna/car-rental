import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchCar1743066990656 implements MigrationInterface {
  name = 'AddSearchCar1743066990656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add the search_vector column
    await queryRunner.query(`
          ALTER TABLE "cars"
          ADD COLUMN "search_vector" tsvector
        `);

    // 2. Populate it for existing data
    await queryRunner.query(`
          UPDATE "cars"
          SET "search_vector" = to_tsvector('simple', coalesce("brand", '') || ' ' || "model")
        `);

    // 3. Create a GIN index for search_vector
    await queryRunner.query(`
          CREATE INDEX "cars_search_vector_idx"
          ON "cars"
          USING GIN ("search_vector")
        `);

    // 4. Create a trigger function to auto-update search_vector
    await queryRunner.query(`
          CREATE FUNCTION update_search_vector() RETURNS trigger AS $$
          BEGIN
            NEW.search_vector := to_tsvector('simple', coalesce(NEW.brand, '') || ' ' || NEW.model);
            RETURN NEW;
          END
          $$ LANGUAGE plpgsql;
        `);

    // 5. Attach the trigger to the cars table
    await queryRunner.query(`
          CREATE TRIGGER trigger_update_search_vector
          BEFORE INSERT OR UPDATE ON "cars"
          FOR EACH ROW EXECUTE FUNCTION update_search_vector()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger and function
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_search_vector ON "cars"`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_search_vector`);

    // Drop index
    await queryRunner.query(`DROP INDEX IF EXISTS "cars_search_vector_idx"`);

    // Drop the search_vector column
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "search_vector"`);
  }
}
