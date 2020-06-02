import Appointment from '../infra/typeorm/entities/Appointment';
import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider: string;
  user: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider,
    date,
    user,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment at a past date");
    }

    if (user === provider) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can't only create appointments between 8:00 and 17:00",
      );
    }

    const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentsInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id: provider,
      date: appointmentDate,
      user_id: user,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    await this.notificationsRepository.create({
      recipient_id: provider,
      content: `Novo agendamento para dia 20 ${dateFormatted}`,
    });
    return appointment;
  }
}

export default CreateAppointmentService;
