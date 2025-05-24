import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RentalCar } from './rental-car.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => RentalCar, (rentalCar) => rentalCar.brand, {
    cascade: true,
  })
  rentalCars: RentalCar[];
}
