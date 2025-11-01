import request from 'supertest';
import { app } from '../index';
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from '../test-setup/setup';
import User from '../models/user.model';
import Sweet from '../models/sweet.model';

// --- Test Helper: Get a valid token ---
const getAuthToken = async () => {
  // We need a user to log in
  await request(app).post('/api/auth/register').send({
    email: 'testuser@example.com',
    password: 'password123',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser@example.com',
    password: 'password123',
  });
  return res.body.token;
};

describe('Sweets Routes', () => {
  let token: string;

  // --- Database Hooks ---
  beforeAll(async () => {
    await connectTestDB();
  });

  // Seed the DB before each test
  beforeEach(async () => {
    await clearTestDB();
    // Get a token for a new user
    token = await getAuthToken();

    // Create some sweets
    await Sweet.create([
      { name: 'Gummy Bears', category: 'Candy', price: 1.99, quantity: 100 },
      { name: 'Chocolate Bar', category: 'Chocolate', price: 2.49, quantity: 50 },
    ]);
  });

  afterAll(async () => {
    await disconnectTestDB();
  });
  // --- End of Hooks ---

  it('should return 401 if a user is not authenticated', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toBe(401);
  });

  // --- NEW TEST ---
  it('should return 200 and a list of sweets for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`); // Use the token

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // We expect the 2 sweets we created
    expect(res.body[0].name).toBe('Gummy Bears');
  });
});