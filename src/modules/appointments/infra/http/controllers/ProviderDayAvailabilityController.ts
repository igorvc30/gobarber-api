import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { month, year, day } = request.body;
    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const availability = await listProviderDayAvailability.execute({
      providerId,
      month,
      year,
      day,
    });
    return response.json(availability);
  }
}
