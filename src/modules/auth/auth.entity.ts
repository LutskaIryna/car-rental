// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
// } from "typeorm";
// import { Role } from "./roles/roles.enum";

// @Entity("users")
// export class User {
//   @PrimaryGeneratedColumn("uuid")
//   token: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   password: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @Column({
//     type: 'enum',
//     enum: Role,
//     default: Role.USER,
//   })
//   role: Role;
// }
