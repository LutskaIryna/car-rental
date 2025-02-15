import { Injectable } from "@nestjs/common";
import { randomBytes, pbkdf2 } from "crypto";
import { promisify } from "util";

@Injectable()
export class HashingService {
  private readonly pbkdf2Async = promisify(pbkdf2);
  private readonly iterations = 100000;
  private readonly keyLength = 64;
  private readonly digest = "sha512";

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await this.pbkdf2Async(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest,
    );
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(":");
    const derivedKey = await this.pbkdf2Async(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest,
    );
    return hash === derivedKey.toString("hex");
  }
}
