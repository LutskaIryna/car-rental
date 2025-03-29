import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1743066177617 implements MigrationInterface {
  name = 'InitialMigration1743066177617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "token" text, "refreshToken" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vin" character varying NOT NULL, "brand" text, "model" character varying NOT NULL, "color" character varying NOT NULL, "plateNumber" character varying NOT NULL, "year" character varying NOT NULL, CONSTRAINT "UQ_1a56deecb54b4ed4917445f49e9" UNIQUE ("vin"), CONSTRAINT "UQ_dbb57fec3f7c30c209d094abfb4" UNIQUE ("plateNumber"), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "rentals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "carId" uuid NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rentals"`);
    await queryRunner.query(`DROP TABLE "cars"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
