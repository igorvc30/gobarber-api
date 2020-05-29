import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviders: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviders = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list day availability from providers', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'anotherUser',
      date: new Date(2020, 5, 20, 8, 0, 0),
    });

    const availability = await listProviders.execute({
      providerId: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });
    expect(availability).toEqual(
      expect.arrayContaining([{ hour: 8, available: false }]),
    );
  });
});
