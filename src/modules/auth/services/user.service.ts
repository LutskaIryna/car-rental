import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordService } from 'src/modules/auth/services/password.service';
import { Role } from '../enums/roles.enum';
import { RentalDataService } from 'src/modules/rental-data/services/rental-data.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rentalDataService: RentalDataService,
    private passwordService: PasswordService
  ) {}

  async register(email: string, password: string, role?: Role): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async registerAdmin(email: string, password: string, role: Role) {
    const existingSuperAdmin = await this.userRepository.findOne({
      where: { role: Role.SUPER_ADMIN },
    });
    if (existingSuperAdmin) {
      throw new BadRequestException('This user already exists');
    }

    return await this.register(email, password, role);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (
      user &&
      (await this.passwordService.verifyPassword(pass, user.password))
    ) {
      return user;
    }
    return null;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { role: Role.USER } });
  }

  async getUserRefreshToken(userId: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) return null;
    return user.refreshToken;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async save(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(user: Partial<User>) {
    return await this.userRepository.update(user.id as string, user);
  }

  async remove(id: string) {
    const isRentalExist = this.rentalDataService.getActiveRentalByUser(id);
    if (await isRentalExist) {
      throw new BadRequestException(
        `User has an active rental and cannot be deleted`
      );
    }
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User is deleted', error: null };
  }
}
