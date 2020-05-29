import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'Igor Costa',
      email: 'igor@email.com',
      password: '123456',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'Teste 1',
      email: 'teste1@email.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Teste 2',
      email: 'teste2@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      userId: loggedUser.id,
    });
    expect(providers).toEqual([user1, user2]);
  });
});
