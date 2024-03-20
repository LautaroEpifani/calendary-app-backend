import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/schemas/user.model';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
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
        throw new Error('Contraseña incorrecta');
      }
    } catch (error) {
      throw new Error(`Error al autenticar al usuario: ${error.message}`);
    }
  }

  private async verifyPassword(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}