import { Router } from 'express';
import ProvidersController from '../controllers/ProvidersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProvideMonthAvailabilityController from '../controllers/ProvideMonthAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const provideMonthAvailabilityController = new ProvideMonthAvailabilityController();
providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:providerId/day-availability',
  providerDayAvailabilityController.index,
);
providersRouter.get(
  '/:providerId/month-availability',
  provideMonthAvailabilityController.index,
);

export default providersRouter;
