import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all appointments from a provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'anotherUser',
      date: new Date(2020, 2, 20, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'anotherUser',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });
    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'anotherUser',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });
    const appointment4 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'anotherUser',
      date: new Date(2020, 4, 30, 8, 0, 0),
    });

    const availability = await listProviderAppointments.execute({
      providerId: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });
    expect(availability).toEqual(
      expect.arrayContaining([appointment2, appointment3]),
    );
  });
});
