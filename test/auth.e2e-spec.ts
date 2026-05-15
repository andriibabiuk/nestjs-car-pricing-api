import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'asdasda4211@akl.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'asdf',
      })
      .expect(201)
      .then((res) => {
        const { id, email: returnedEmail } = res.body;
        expect(id).toBeDefined();
        expect(returnedEmail).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie || [])
      .expect(200);

    expect(body.email).toEqual(email);
  });

  it('handles a signin request', async () => {
    const email = 'signin@test.com';
    const password = 'password';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password })
      .expect(201);

    expect(res.body.email).toEqual(email);
  });

  afterEach(async () => {
    await app.close();
  });
});
