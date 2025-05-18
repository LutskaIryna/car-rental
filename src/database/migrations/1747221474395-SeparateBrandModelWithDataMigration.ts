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

    // 3. Add brand_id and model_id into cars
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

    // 4. Remove old columns
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
