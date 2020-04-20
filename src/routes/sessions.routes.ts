import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUserService = new AuthenticateUserService();
  const { token, user } = await authenticateUserService.execute({
    email,
    password,
  });
  return response.json({ token, user });
});

export default sessionsRouter;
