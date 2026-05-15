import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'asdf',
          } as User,
        ]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
          ...attrs,
        } as User);
      },
    };
    fakeAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('finAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });
  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('whoAmI returns the current user', () => {
    const user = { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User;
    const result = controller.whoAmI(user);
    expect(result).toEqual(user);
  });

  it('signOut sets session.userId to null', () => {
    const session = { userId: 1 };
    controller.signOut(session);
    expect(session.userId).toBeNull();
  });

  it('createUser updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.createUser(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('removeUser calls usersService.remove with the correct id', async () => {
    const removeSpy = jest.spyOn(fakeUsersService, 'remove' as any);
    const user = await controller.removeUser('1');
    expect(removeSpy).toHaveBeenCalledWith(1);
    expect(user).toBeDefined();
  });

  it('updateUser calls usersService.update with the correct id and body', async () => {
    const updateSpy = jest.spyOn(fakeUsersService, 'update' as any);
    const body: any = { email: 'test@test.com' };
    const user = await controller.updateUser('1', body);
    expect(updateSpy).toHaveBeenCalledWith(1, body);
    expect(user.email).toEqual('test@test.com');
  });
});
