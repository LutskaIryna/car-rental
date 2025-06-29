import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastChanges1751189102821 implements MigrationInterface {
  name = 'AddLastChanges1751189102821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "brands" DROP CONSTRAINT IF EXISTS "UQ_96db6bbbaa6f23cad26871339b6"`
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "name" SET NOT NULL`
    );

    await queryRunner.query(
      `ALTER TABLE "models" ALTER COLUMN "name" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`
    );
    await queryRunner.query(
      `ALTER TABLE "models" ALTER COLUMN "name" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "name" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name")`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }
}
