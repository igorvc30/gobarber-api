import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);
    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}
export default CreateUserService;
