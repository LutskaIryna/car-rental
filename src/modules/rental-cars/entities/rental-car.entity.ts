import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Model } from './model.entity';

@Entity('cars')
export class RentalCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vin: string;

  @ManyToOne(() => Brand, (brand) => brand.rentalCars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Model)
  @JoinColumn({ name: 'model_id' })
  model: Model;

  @Column()
  color: string;

  @Column({ unique: true })
  plateNumber: string;

  @Column()
  year: string;
}
