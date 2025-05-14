import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class SeparateBrandModelWithDataMigration1747221474395
  implements MigrationInterface
{
  name = 'SeparateBrandModelWithDataMigration1747221474395';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create brands table
    await queryRunner.createTable(
      new Table({
        name: 'brands',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'name', type: 'varchar', isUnique: true },
        ],
      })
    );

    // 2. Create models table
    await queryRunner.createTable(
      new Table({
        name: 'models',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'name', type: 'varchar' },
          { name: 'brand_id', type: 'uuid' },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'models',
      new TableForeignKey({
        columnNames: ['brand_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'brands',
        onDelete: 'CASCADE',
      })
    );

    // 3. add brand_id и model_id into car table
    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'brand_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'model_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'cars',
      new TableForeignKey({
        columnNames: ['brand_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'brands',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'cars',
      new TableForeignKey({
        columnNames: ['model_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'models',
        onDelete: 'SET NULL',
      })
    );

    // 4. insert uniq brands
    await queryRunner.query(`
      INSERT INTO brands (id, name)
      SELECT gen_random_uuid(), DISTINCT brand
      FROM cars
      WHERE brand IS NOT NULL
    `);

    // 5. inser uniq pairs (model, brand)
    await queryRunner.query(`
      INSERT INTO models (id, name, brand_id)
      SELECT
        gen_random_uuid(),
        car.model,
        b.id
      FROM (
        SELECT DISTINCT model, brand
        FROM cars
        WHERE model IS NOT NULL AND brand IS NOT NULL
      ) car
      JOIN brands b ON b.name = car.brand
    `);

    // 6. fill brand_id и model_id вin car table
    await queryRunner.query(`
      UPDATE cars
      SET brand_id = b.id
      FROM brands b
      WHERE cars.brand = b.name
    `);

    await queryRunner.query(`
      UPDATE cars
      SET model_id = m.id
      FROM models m
      JOIN brands b ON m.brand_id = b.id
      WHERE cars.model = m.name AND cars.brand = b.name
    `);

    // 7. delete old columns
    await queryRunner.dropColumn('cars', 'brand');
    await queryRunner.dropColumn('cars', 'model');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'brand',
        type: 'text',
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'model',
        type: 'varchar',
      })
    );

    // restore old columns
    await queryRunner.query(`
      UPDATE cars
      SET brand = b.name
      FROM brands b
      WHERE cars.brand_id = b.id
    `);

    await queryRunner.query(`
      UPDATE cars
      SET model = m.name
      FROM models m
      WHERE cars.model_id = m.id
    `);

    await queryRunner.dropForeignKey('cars', 'FK_cars_brand_id');
    await queryRunner.dropForeignKey('cars', 'FK_cars_model_id');
    await queryRunner.dropColumn('cars', 'brand_id');
    await queryRunner.dropColumn('cars', 'model_id');

    await queryRunner.dropTable('models');
    await queryRunner.dropTable('brands');
  }
}
