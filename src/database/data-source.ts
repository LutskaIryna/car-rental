import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/modules/auth/entities/user.entity';
import { RentalCar } from 'src/modules/rental-cars/entities/rental-car.entity';
import { RentalData } from 'src/modules/rental-data/entity/rental-data.entity';
import { Brand } from 'src/modules/rental-cars/entities/brand.entity';
import { Model } from 'src/modules/rental-cars/entities/model.entity';

config(); // Load environment variables

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, RentalCar, RentalData, Brand, Model],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Use compiled migrations
  synchronize: false, // Use migrations instead of synchronize
  logging: true,
});
