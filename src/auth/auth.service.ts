import {  Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async loginUser({ username, password }: AuthPayloadDto): Promise<{ token: string } | null> {
    try {
      const user = await this.userService.getUserByUsername(username);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      const isPasswordValid = await this.verifyPassword(
        password,
        user.password,
      );
      if (isPasswordValid) {
        const token = this.jwtService.sign({ id: user._id, username: user.username });
        return { token: token };
      } else {
        throw new UnauthorizedException('Usuario o contraseña incorrecto');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error; 
      } else {
        throw new Error('Error inesperado'); 
      }
    }
  }

  private async verifyPassword(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}