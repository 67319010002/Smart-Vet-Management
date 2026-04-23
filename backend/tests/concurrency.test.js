const request = require('supertest');
const app = require('../index');
const { sequelize, Vet, Pet, Owner, Appointment } = require('../models');

describe('Concurrency Test - No Double Booking', () => {
  let testVet, testPet, testOwner;

  beforeAll(async () => {
    // We assume the DB is running locally or via docker-compose for this test.
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Reset DB

    testOwner = await Owner.create({ name: 'Test Owner', phone: '0812345678' });
    testPet = await Pet.create({ name: 'Buddy', species: 'Dog', ownerId: testOwner.id });
    testVet = await Vet.create({ name: 'Dr. Smith', specialty: 'General' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should prevent double booking when two users book the same slot concurrently', async () => {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1); // 1 hour from now
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    const payload = {
      vetId: testVet.id,
      petId: testPet.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      reason: 'Checkup'
    };

    // Simulate concurrent requests
    const request1 = request(app).post('/api/appointments/book').send(payload);
    const request2 = request(app).post('/api/appointments/book').send(payload);

    const [response1, response2] = await Promise.all([request1, request2]);

    // One should succeed (201) and one should fail (409 Conflict or 500)
    const statusCodes = [response1.status, response2.status];
    expect(statusCodes).toContain(201);
    expect(statusCodes).toContain(409);

    // Verify DB only has 1 appointment
    const appointments = await Appointment.findAll();
    expect(appointments.length).toBe(1);
  });
});
