import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to change user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Igor Costa',
      email: 'igor@email.com',
      password: '123456',
    });
    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'Igor V. Costa',
      email: 'igor.vc30@gmail.com',
    });
    expect(updatedUser.name).toBe('Igor V. Costa');
    expect(updatedUser.email).toBe('igor.vc30@gmail.com');
  });

  it('should not be able to change user profile', async () => {
    await expect(
      updateProfile.execute({
        userId: 'non-existing',
        name: 'Igor Costa',
        email: 'igor@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change user profile with an email in use ', async () => {
    await fakeUsersRepository.create({
      name: 'Igor Costa',
      email: 'igor@email.com',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Igor V. Costa',
        email: 'igor@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Igor Costa',
      email: 'igor@email.com',
      password: '123456',
    });
    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'Igor V. Costa',
      email: 'igor.vc30@gmail.com',
      oldPassword: '123456',
      password: '654321',
    });
    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to change the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Igor Costa',
      email: 'igor@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'Igor V. Costa',
        email: 'igor@email.com',
        password: '654321',
        oldPassword: 'wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
