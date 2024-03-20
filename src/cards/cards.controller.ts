import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createCardDto: CreateCardDto) {
    try {
      return await this.cardsService.createCard(createCardDto);;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Card already exists');
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.cardsService.getAllCards();
  }

  @Get('cardsWithUsernames')
  getCardsWithUsername() {
    return this.cardsService.getCardsWithUsername();
  }

   // @Get(':id/withUsername')
  // getCardsWithUsername(@Param('id') id: string) {
  //   return this.cardsService.getCardsWithUsername(id);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.getCardById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cardsService.deleteCard(id);
  }


 
}
