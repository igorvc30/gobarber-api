import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { classToClass } from 'class-transformer';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const showProfile = container.resolve(ShowProfileService);
    const user = await showProfile.execute({ userId });
    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, password, oldPassword } = request.body;
    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      name,
      email,
      password,
      oldPassword,
      userId,
    });

    return response.json({ user: classToClass(user) });
  }
}
