import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./user/user.entity";
// import * as Joi from "joi";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: Joi.object({
      //   DATABASE_HOST: Joi.string().required().label("DATABASE_HOST"),
      //   DATABASE_PORT: Joi.number().default(5432).label("DATABASE_PORT"),
      //   DATABASE_USER: Joi.string().required().label("DATABASE_USER"),
      //   DATABASE_PASSWORD: Joi.string().required().label("DATABASE_PASSWORD"),
      //   DATABASE_NAME: Joi.string().required().label("DATABASE_NAME"),
      // }) as Joi.ObjectSchema,
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
        entities: [User],
        synchronize: true,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
