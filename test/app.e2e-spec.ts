import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import { describe } from 'node:test';
import { Card } from '../src/schemas/card.model';

describe('Card & Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${`test-db`}`,
    ),
      function () {
        mongoose.connection.db.dropDatabase;
      };
  });

  afterAll(() => mongoose.disconnect());

  let newCard = {
    title: 'New Card',
    description: 'new',
    section: 'no section',
    label: 'indigo',
    isOnCalendar: false,
    day: null,
    createdBy: '',
    assignedUsers: [],
  };
  const mockCreatedByUser = {
    _id: '',
    username: 'CreatedUser test e2e with valid password second',
    password: 'asdasd123',
    email: 'createduser@example.com',
    avatarDataUri: 'data:image/svg+',
    createdCards: [],
    assignedCards: [],
  };

  const mockAssignedToUser = {
    _id: '',
    username: 'CreatedUser test e2e with valid password second',
    password: 'asdasd123',
    email: 'createduser@example.com',
    avatarDataUri: 'data:image/svg+',
    createdCards: [],
    assignedCards: [],
  };

  describe('Auth', () => {
    let jwtToken: string;

    const newUser = {
      username: 'CreatedUser test e2e with valid password second',
      password: 'asdasd123',
      email: 'createduser@example.com',
      avatarDataUri: 'data:image/svg+',
      createdCards: [],
      assignedCards: [],
    };

    // it('(POST) - Register a new user', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(newUser)
    //     .expect(201);

    //   const isPasswordValid = await bcrypt.compare(
    //     newUser.password,
    //     response.body.password,
    //   );
    //   expect(isPasswordValid).toBe(true);

    //   const { password , ...expectedUserWithoutPassword } = newUser;
    //   expect(response.body).toMatchObject(expectedUserWithoutPassword);
    // });

    it('(POST) - Login user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: newUser.username, password: newUser.password })
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });

    it('(GET) - Get user logged', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/userLogged')
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body.username).toEqual(newUser.username);
          newCard = {
            ...newCard,
            createdBy: res.body.id,
            assignedUsers: [res.body.id],
          };
          mockCreatedByUser._id = res.body.id;
          mockAssignedToUser._id = res.body.id;
        });
    });
  });

  describe('Cards', () => {
    let cardCreated: Card;

    it('(POST) - Create new card', async () => {
      const response = await request(app.getHttpServer())
        .post('/cards')
        .send(newCard)
        .expect(201);

      expect(response.body._id).toBeDefined();
      expect(response.body.title).toEqual(newCard.title);
      cardCreated = response.body;
    });

    it('(GET) - Get single Card', async () => {
      const response = await request(app.getHttpServer())
        .get(`/cards/${cardCreated?._id}`)
        .expect(200);

      expect(response.body._id).toEqual(cardCreated._id);
    });

    it('(PATCH) - Update Card', async () => {
      const cardUpdate = { title: 'Updated title' };

      await request(app.getHttpServer())
        .patch(`/cards/${cardCreated?._id}`)
        .send({ title: cardUpdate.title })
        .expect(200)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body.title).toEqual(cardUpdate.title);
          cardCreated.title = cardUpdate.title;
        });
    });

    it('(Delete) - Delete Card', async () => {

      let message = `Hemos eliminado la tarjeta: ${cardCreated?.title}.`;
      message += `\nLa tarjeta también ha sido eliminada de las propiedades creadas de ${mockCreatedByUser.username}.`;
      message += `\nLa tarjeta también ha sido eliminada de las propiedades asignadas a ${mockAssignedToUser.username}.`;

      const response = await request(app.getHttpServer())
        .delete(`/cards/${cardCreated?._id}`)
        .expect(200);
      expect(response.body).toEqual({ message, card: cardCreated });
    });
  });
});
