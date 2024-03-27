import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const mockUser = {
    _id: '65eed6a27a8439b4b6f96363',
    username: 'CreatedUser',
    email: 'createduser@example.com',
    avatarDataUri: 'data:image/svg+',
    createdCards: ['65f6e2d27b7f45c09e775555'],
    assignedCards: ['65f6e2d27b7f45c09e775555'],
  };

  const userDecoded = {
    _id: '65eed6a27a8439b4b6f96363',
    username: 'CreatedUser',
  };

  let token: 'jwtToken';

  const mockUserService = {
    findOne: jest.fn(),
    createUser: jest.fn().mockResolvedValueOnce(mockUser),
  };

  const mockAuthService = {
    loginUser: jest.fn().mockResolvedValueOnce(token),
  };

  let userService: UsersService;
  let userController: UsersController;
  let authService: AuthService;
  let authController: AuthController;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    //   imports: [PassportModule.register({ defaultStrategy: 'jwt' })], 
      controllers: [UsersController, AuthController],
      providers: [
        UsersService,
        AuthService,
        JwtService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
            provide: AuthService,
            useValue: mockAuthService,
          },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userController = module.get<UsersController>(UsersController);
    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    const signUpDto = {
      username: 'CreatedUser',
      password: 'createUser123',
      email: 'createduser@example.com',
      avatarDataUri: 'data:image/svg+',
      createdCards: ['65f6e2d27b7f45c09e775555'],
      assignedCards: ['65f6e2d27b7f45c09e775555'],
    };

    it('should regiser a new user', async () => {
      const result = await userController.createUser(signUpDto);

      expect(userService.createUser).toHaveBeenCalled();

      expect(result).toEqual(mockUser);
    });
  });

  describe('signIn', () => {
    const signInDto = {
        username: 'CreatedUser',
        password: 'password123',
      };

    it('should sign in user', async () => {
      const result = await authController.login(signInDto);

      expect(authService.loginUser).toHaveBeenCalled();

      expect(result).toEqual(token);
    });
  });

//   describe('should check for logged user', () => {

//     const userDecoded = {
//         username: 'CreatedUser',
//         password: 'password123',
//       };

//     const req: any = { token };

//     it('should check for logged user', async () => {
//       const result = authController.userLogged(req)

//       expect(result).toEqual(signInDto);
//     });
//   });
});
