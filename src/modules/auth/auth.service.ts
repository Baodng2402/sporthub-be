import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '../../../lib/prisma';
import { RegisterDto } from './dto/register/register.dto';
export type AuthUser = {
  id: number;
  email: string;
};
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return {
      id: user.id,
      email: user.email,
    };
  }
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    const { password: _password, ...safeUser } = user;
    return {
      message: 'User registered successfully',
      user: safeUser,
    };
  }
  login(user: AuthUser) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
