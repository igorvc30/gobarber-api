import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
interface IRequest {
  userId: string;
}
@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ userId }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${userId}`,
    );

    if (!users) {
      users = await this.userRepository.findAllProviders({
        exceptUserId: userId,
      });
      await this.cacheProvider.save(
        `providers-list:${userId}`,
        JSON.stringify(users),
      );
    }

    return users;
  }
}

export default ListProvidersService;
