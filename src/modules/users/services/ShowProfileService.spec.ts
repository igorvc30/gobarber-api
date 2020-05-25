import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Igor Costa',
      email: 'igor@email.com',
      password: '123456',
    });
    const profile = await showProfile.execute({
      userId: user.id,
    });
    expect(profile.name).toBe('Igor Costa');
    expect(profile.email).toBe('igor@email.com');
  });

  it('should not be able to show user profile', async () => {
    await expect(
      showProfile.execute({
        userId: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
