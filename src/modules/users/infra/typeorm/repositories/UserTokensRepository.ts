import { getRepository, Repository } from 'typeorm';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;
  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken || undefined;
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id: userId,
    });
    await this.ormRepository.save(userToken);
    return userToken;
  }
}

export default UserTokensRepository;
