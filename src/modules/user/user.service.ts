import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { PasswordService } from "src/shared/security/password.service";
import { Role } from "./roles/roles.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  async register(email: string, password: string, role?: Role): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("Wrong credentials");
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role
    });
    return this.userRepository.save(user);
  }

  async registerAdmin(email: string, password: string, role: Role) {
    const existingSuperAdmin = await this.userRepository.findOne({
      where: { role: Role.SUPER_ADMIN },
    });
    if (existingSuperAdmin) {
      throw new BadRequestException("This user already exists");
    }

    return await this.register(email, password, role);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && await this.passwordService.verifyPassword(pass, user.password)) {
      return user;
    }
    return null;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

}
