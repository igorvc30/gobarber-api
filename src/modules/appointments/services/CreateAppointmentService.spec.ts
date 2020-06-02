import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 20, 16),
      provider: '123456',
      user: 'userId',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider: '123456',
      user: 'userId',
    });
    await expect(
      createAppointment.execute({
        date: new Date(),
        provider: '123456',
        user: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 9),
        provider: '123456',
        user: 'userId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user and provider id', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 15),
        provider: '123456',
        user: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8:00 and after 18h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 19),
        provider: '123456',
        user: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 21, 6),
        provider: '123456',
        user: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
