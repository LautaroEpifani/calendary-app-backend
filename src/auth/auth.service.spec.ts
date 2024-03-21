import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Card } from '../schemas/card.model';
import { UsersService } from '../users/users.service';
import { User } from '../schemas/user.model';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';


describe('CardService', () => {


  const mockUserModel = {
    findById: jest.fn(),
  };

  let authService: AuthService;
  let userService: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('createCard', () => {
    it('should return a created card', async () => {
  


    });
  });

});