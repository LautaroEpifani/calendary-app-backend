import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.NODE_ENV === 'test' ? `mongodb+srv://${configService.get('MONGO_USERNAME')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_CLUSTER')}/${`test-db`}` : `mongodb+srv://${configService.get('MONGO_USERNAME')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_CLUSTER')}/${configService.get('MONGO_DATABASE')}`,  
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CardsModule,
    AuthModule,
  ],
})
export class AppModule {}