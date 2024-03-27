import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { User } from '../schemas/user.model';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('CardService', () => {
  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUser = {
    _id: '65eed6a27a8439b4b6f96363',
    username: 'CreatedUser',
    email: 'createduser@example.com',
    avatarDataUri: 'data:image/svg+',
    createdCards: ['65f6e2d27b7f45c09e775555'],
    assignedCards: ['65f6e2d27b7f45c09e775555'],
  };

  let token: 'jwtToken';

  let authService: AuthService;
  let userService: UsersService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });
//----------------------------CREATE USER / REGISTER-----------------------------------------
  describe('signUp', () => {
    const signUpDto = {
    username: 'CreatedUser',
    email: 'createduser@example.com',
    avatarDataUri: 'data:image/svg+',
    createdCards: ['65f6e2d27b7f45c09e775555'],
    assignedCards: ['65f6e2d27b7f45c09e775555'],
    };
    it('should registrer a new user', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => {
        Promise.resolve('mockedSalt');
      });

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        Promise.resolve('hashedPassword');
      });
      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser as any));
      const result = await userService.createUser(signUpDto);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw duplicate username error', async () => {
      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));
      await expect(userService.createUser(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
//---------------------------- / SignIn-----------------------------------------
  describe('signIn', () => {
    const signInDto = {
      username: 'CreatedUser',
      password: 'password123',
    };

    const signInDtoBadRequest = {
      username: 'CreatedUserBad',
      password: 'password123',
    };

    it('should login user and return the token', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.loginUser(signInDto);

      expect(result).toEqual({ token });
    });

    it('should throw error not found username', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);

      expect(authService.loginUser(signInDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error unauthorized user', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      expect(authService.loginUser(signInDtoBadRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
