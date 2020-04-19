import { getRepository } from 'typeorm';
import path from 'path';
import User from '../models/User';
import uploadConfig from '../config/upload';
import fs from 'fs';

interface Request {
  userId: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new Error('Only authenticated users can chance avatar.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFilename;
    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
