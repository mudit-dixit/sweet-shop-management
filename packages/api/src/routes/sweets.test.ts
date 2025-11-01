import request from 'supertest';
import { app } from '../index';
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from '../test-setup/setup';

describe('Sweets Routes', () => {
  // --- Database Hooks ---
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });
  // --- End of Hooks ---

  // --- NEW TEST ---
  it('should return 401 if a user is not authenticated', async () => {
    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(401);
  });
});