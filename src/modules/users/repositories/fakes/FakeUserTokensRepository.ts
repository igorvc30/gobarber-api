import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/User';
import UserToken from '../../infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokenRepository';

class UserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );

    return userToken;
  }
}

export default UserTokensRepository;
