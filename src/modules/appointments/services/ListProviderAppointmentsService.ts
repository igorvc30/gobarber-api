import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}
  public async execute({
    providerId,
    month,
    year,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cachedKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cachedKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          providerId,
          year,
          month,
          day,
        },
      );
      await this.cacheProvider.save(cachedKey, appointments);
    }
    return appointments;
  }
}

export default ListProviderAppointmentsService;
