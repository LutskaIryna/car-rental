import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./modules/auth/entities/user.entity";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { RentalCarsModule } from "./modules/rental-cars/rental-cars.module";
import { RentalCar } from "./modules/rental-cars/entities/rental-car.entity";
import { RentalData } from "./modules/rental-data/entity/rental-data.entity";
import { RentalDataModule } from "./modules/rental-data/rental-data.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST"),
        port: configService.get<number>("DATABASE_PORT"),
        username: configService.get<string>("DATABASE_USER"),
        password: configService.get<string>("DATABASE_PASSWORD"),
        database: configService.get<string>("DATABASE_NAME"),
        entities: [User, RentalCar, RentalData],
        synchronize: true,
      }),
    }),
    AuthModule,
    RentalCarsModule,
    RentalDataModule,
    ProfileModule  
  ],
  exports:[
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
