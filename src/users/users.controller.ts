import { Controller, Get, Post, Param, Body, Delete, Patch, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Card } from 'src/schemas/card.model';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User | null> {
    return this.usersService.getUserByUsername(username);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  // @Patch(':userId/:cardId')
  // async likeCard(@Param('userId') userId: string, @Param('cardId') cardId: string): Promise<{ user: User, card: Card }> {
  //   try {
  //     const result = await this.usersService.likeCard(userId, cardId);
  //     return result;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw new NotFoundException('Usuario o tarjeta no encontrados.');
  //     } else {
  //       throw new Error('Error al procesar la solicitud.');
  //     }
  //   }
  // }
}