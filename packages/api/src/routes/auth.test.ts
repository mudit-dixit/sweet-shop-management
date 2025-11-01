import request from 'supertest';
import { app } from '../index';

// --- IMPORT OUR TEST DB HELPERS ---
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from '../test-setup/setup';

describe('Auth Routes', () => {
  // --- ADD THESE HOOKS ---
  // Connect to the in-memory database before all tests run
  beforeAll(async () => {
    await connectTestDB();
  });

  // Clear the database after each test
  afterEach(async () => {
    await clearTestDB();
  });

  // Disconnect from the database after all tests run
  afterAll(async () => {
    await disconnectTestDB();
  });
  // --- END OF HOOKS ---

  it('should return 400 when registering a user with no data', async () => {
    const res = await request(app).post('/api/auth/register').send({});

    expect(res.statusCode).toBe(400);
  });

  it('should return 201 when registering a user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201); // We expect '201 Created'
    expect(res.body.message).toBe('User registered successfully');
  });
});