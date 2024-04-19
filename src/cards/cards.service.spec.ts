import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Card } from '../schemas/card.model';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { User } from '../schemas/user.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { Document } from 'mongoose';

describe('CardService', () => {
  const mockUserModel = {
    findById: jest.fn(),
  };

  const mockCardModel = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

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

  let cardService: CardsService;
  let userService: UsersService;
  let cardModel: Model<Card>;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        UsersService,
        {
          provide: getModelToken(Card.name),
          useValue: mockCardModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    cardService = module.get<CardsService>(CardsService);
    userService = module.get<UsersService>(UsersService);
    cardModel = module.get<Model<Card>>(getModelToken(Card.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('createCard', () => {
    it('should return a created card', async () => {
      const newCard = {
        title: 'New Card',
        description: 'new',
        section: 'no section',
        label: 'indigo',
        isOnCalendar: false,
        day: null,
        createdBy: '65eed6a27a8439b4b6f96363',
        assignedUsers: ['65eed6c27a8439b4b6f96365'],
      };

      jest
        .spyOn(cardModel, 'create')
        .mockImplementation(() => Promise.resolve(mockCard as any));

      const result = await cardService.createCard(newCard as CreateCardDto);

      expect(result).toEqual(mockCard);
    });
  });

  describe('getAllCards', () => {
    it('should return an array of Cards', async () => {
      jest.spyOn(cardModel, 'find').mockResolvedValue([mockCard]);
      const result = await cardService.getAllCards();

      // expect(cardModel.find).toHaveBeenCalledWith({ property: " "})

      expect(result).toEqual([mockCard]);
    });
  });

  describe('getCardById', () => {
    it('should find id and return card', async () => {
      jest.spyOn(cardModel, 'findById').mockResolvedValue(mockCard);

      const result = await cardService.getCardById(mockCard._id);

      expect(cardModel.findById).toHaveBeenCalledWith(mockCard._id);
      expect(result).toEqual(mockCard);
    });

    it('should throw BadRequestException if invalid id', async () => {
      const id = 'invalid-id';

      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(cardService.getCardById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if card is not found', async () => {
      jest.spyOn(cardModel, 'findById').mockResolvedValue(null);
      let result: Card;
      try {
        result = await cardService.getCardById(mockCard._id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Card not found');
      }
      await expect(cardService.getCardById(mockCard._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(cardModel.findById).toHaveBeenCalledWith(mockCard._id);
    });
  });

  describe('updateCard', () => {
    it('should find and update a Card', async () => {
      const updatedCard = { ...mockCard, title: 'Updated name' };

      const card = { title: 'Updated name' };

      jest.spyOn(cardModel, 'findByIdAndUpdate').mockResolvedValue(updatedCard);

      const result = await cardService.updateCard(mockCard._id, mockCard);

      expect(cardModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCard._id,
        mockCard,
        {
          new: true,
        },
      );

      expect(result.title).toEqual(card.title);
    });
  });

  describe('deleteCard', () => {
    it('should delete a Card', async () => {
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

      jest.spyOn(cardModel, 'findById').mockResolvedValue(mockCard);
      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValueOnce(mockCreatedByUser)
        .mockResolvedValueOnce(mockAssignedToUser);

      let message = `We have deleted the card: ${mockCard.title}.`;
      message += `\nThe card has also been removed from the created properties of ${mockCreatedByUser.username}.`;
      message += `\nThe card has also been removed from the assigned properties of ${mockAssignedToUser.username}.`;

      const result = await cardService.deleteCard(mockCard._id);

      expect(cardModel.deleteOne).toHaveBeenCalledWith({ _id: mockCard._id });

      expect(result).toEqual({ message, card: mockCard });
    });
  });
});
