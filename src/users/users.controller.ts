import { Controller, Get, Post, Param, Body, Delete, Patch, NotFoundException, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../schemas/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';


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

  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}