import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cars')
export class RentalCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vin: string;

  @Column({ type: 'text', nullable: true })
  brand: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column({ unique: true })
  plateNumber: string;

  @Column()
  year: string;

  @Column({ type: 'tsvector', nullable: true })
  searchIndex: string;
}
