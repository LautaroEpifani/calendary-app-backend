import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Card } from '../schemas/card.model';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    private readonly userModel: UsersService,
  ) {}

  async getAllCards(): Promise<Card[]> {
    const cards = await this.cardModel.find();
    return cards;
    // .populate('assignedUsers')
  }

  async getCardById(id: string): Promise<Card | null> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id');
    }

    const card = await this.cardModel.findById(id);

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async createCard(card: CreateCardDto): Promise<Card> {
    if (!card.isOnCalendar) {
      const createdCard = await this.cardModel.create(card);
      const createdByUser = await this.userModel.getUserById(card.createdBy);
      if (createdByUser) {
        createdByUser.createdCards.push(createdCard._id);
        await createdByUser.save();
      }

      for (const assignedUserId of card.assignedUsers) {
        const assignedUser = await this.userModel.getUserById(assignedUserId);
        if (assignedUser) {
          assignedUser.assignedCards.push(createdCard._id);
          await assignedUser.save();
        }
      }
      return createdCard;
    } else {
      const { createdBy, assignedUsers, ...restOfCard } = card;
      const createdByObjectId = new mongoose.Types.ObjectId(createdBy);
      const assignedUsersObjectIds = assignedUsers.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
      const createdCard = await this.cardModel.create({
        ...restOfCard,
        createdBy: createdByObjectId,
        assignedUsers: assignedUsersObjectIds,
      });
      return createdCard;
    }
  }

  async updateCard(id: string, card: UpdateCardDto) {
    return this.cardModel.findByIdAndUpdate(id, card, { new: true });
  }

  async deleteCard(id: string) {
    const card = await this.cardModel.findById(id);
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    await this.cardModel.deleteOne({ _id: id });

    let message = `Hemos eliminado la tarjeta: ${card.title}.`;

    const createdByUserId = card.createdBy.toString();
    const createdByUser = await this.userModel.getUserById(createdByUserId);
    if (createdByUser) {
      if (createdByUser.createdCards) {
        createdByUser.createdCards = createdByUser.createdCards.filter(
          (cardId) => cardId.toString() !== id,
        );
      }
      await createdByUser.save();
      message += `\nLa tarjeta también ha sido eliminada de las propiedades creadas de ${createdByUser.username}.`;
    }

    for (const assignedUserId of card.assignedUsers.map(String)) {
      const assignedUser = await this.userModel.getUserById(assignedUserId);
      if (assignedUser) {
        if(assignedUser.assignedCards) {
          assignedUser.assignedCards = assignedUser.assignedCards.filter(
            (cardId) => cardId.toString() !== id,
          );
        }
        await assignedUser.save();
        message += `\nLa tarjeta también ha sido eliminada de las propiedades asignadas a ${assignedUser.username}.`;
      }
    }

    return { message, card };
  }

  async getCardsWithUsername(): Promise<any[]> {
    const cardsWithUsername = await this.cardModel.aggregate([
      // {
      //   $match: {
      //     _id: new mongoose.Types.ObjectId(id)
      //   }
      // },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByUser',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedUsers',
          foreignField: '_id',
          as: 'assignedUsersArray',
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          section: 1,
          label: 1,
          isOnCalendar: 1,
          day: 1,
          createdBy: 1,
          assignedUsers: 1,
          createdByUsername: '$createdByUser.username',
          assignedUsersName: '$assignedUsersArray.username',
        },
      },
    ]);

    return cardsWithUsername;
  }
}
