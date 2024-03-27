import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { UsersService } from '../users/users.service';
import { CardsController } from './cards.controller';
import { UsersController } from '../users/users.controller';
import { PassportModule } from '@nestjs/passport';

describe('CardController', () => {
  const mockCard = {
    _id: '65f6e2d27b7f45c09e775555',
    title: 'Clean Kitchen',
    description: 'Clean all kitchen, over and refrigerator',
    section: 'cleaning',
    label: 'indigo',
    isOnCalendar: false,
    day: null,
    createdBy: '65eed6a27a8439b4b6f96363',
    assignedUsers: ['65eed6c27a8439b4b6f96365'],
    __v: 0,
  };

  const mockUserService = {};

  const mockCardService = {
    getAllCards: jest.fn().mockResolvedValueOnce([mockCard]),
    createCard: jest.fn().mockResolvedValueOnce(mockCard),
    getCardById: jest.fn().mockResolvedValueOnce(mockCard),
    updateCard: jest.fn(),
    deleteCard: jest.fn(),
  };

  let cardService: CardsService;
  let userService: UsersService;
  let cardController: CardsController;
  let userController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [CardsController, UsersController],
      providers: [
        CardsService,
        UsersService,
        {
          provide: CardsService,
          useValue: mockCardService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    cardService = module.get<CardsService>(CardsService);
    cardController = module.get<CardsController>(CardsController);
  });

  describe('getAllCards', () => {
    it('should return all cards', async () => {
      const result = await cardController.findAll();
      expect(cardService.getAllCards).toHaveBeenCalled();
      expect(result).toEqual([mockCard]);
    });
  });

  describe('getCardById', () => {
    it('should get a card', async () => {
      const result = await cardController.findOne(mockCard._id);

      expect(cardService.getCardById).toHaveBeenCalled();

      expect(result).toEqual(mockCard);
    });
  });

  describe('createCard', () => {
    const newCard = {
      title: 'New Card',
      description: 'new',
      section: 'no section',
      label: 'green',
      isOnCalendar: false,
      day: null,
      createdBy: '65eed6a27a8439b4b6f96343',
      assignedUsers: ['65eed6c27a8439b4b6f96312'],
    };

    it('should create a new card', async () => {
      const result = await cardController.create(newCard);

      expect(cardService.createCard).toHaveBeenCalled();

      expect(result).toEqual(mockCard);
    });
  });

  describe('findByIdAndUpdate Card', () => {
    const updatedCard = {
      _id: '65f6e2d27b7f45c09e775555',
      title: 'Updated Card',
      description: 'Clean all kitchen, over and refrigerator',
      section: 'cleaning',
      label: 'indigo',
      isOnCalendar: false,
      day: null,
      createdBy: '65eed6a27a8439b4b6f96363',
      assignedUsers: ['65eed6c27a8439b4b6f96365'],
      __v: 0,
    };

    it('should find card an update it', async () => {
      const updateProperty = { title: 'Updated Card' };

      mockCardService.updateCard = jest.fn().mockResolvedValueOnce(updatedCard);

      const result = await cardController.update(
        updatedCard._id,
        updateProperty,
      );

      expect(cardService.updateCard).toHaveBeenCalled();

      expect(result).toEqual(updatedCard);
    });
  });

  describe('deleteCard', () => {
    const mockCreatedByUser = {
      _id: '65eed6a27a8439b4b6f96363',
      username: 'CreatedUser',
      email: 'createduser@example.com',
      password: 'password123',
      avatarDataUri: 'data:image/svg+',
      createdCards: ['65f6e2d27b7f45c09e775555'],
      assignedCards: ['65f6e2d27b7f45c09e775555'],
      save: jest.fn().mockResolvedValue(this),
    };

    const mockAssignedToUser = {
      _id: '65eed6a27a8439b4b6f96363',
      username: 'AssignedUser',
      email: 'assigneduser@example.com',
      password: 'password123',
      avatarDataUri: 'data:image/svg+',
      createdCards: ['65f6e2d27b7f45c09e775555'],
      assignedCards: ['65f6e2d27b7f45c09e775555'],
      save: jest.fn().mockResolvedValue(this),
    };

    it('should delete a card', async () => {
      let message = `Hemos eliminado la tarjeta: ${mockCard.title}.`;
      message += `\nLa tarjeta también ha sido eliminada de las propiedades creadas de ${mockCreatedByUser.username}.`;
      message += `\nLa tarjeta también ha sido eliminada de las propiedades asignadas a ${mockAssignedToUser.username}.`;

      mockCardService.deleteCard = jest
        .fn()
        .mockResolvedValueOnce({ message, mockCard });

      const result = await cardController.delete(mockCard._id);

      expect(cardService.deleteCard).toHaveBeenCalled();

      expect(result).toEqual({ message, mockCard });
    });
  });
});
