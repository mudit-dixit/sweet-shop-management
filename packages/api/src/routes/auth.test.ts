import request from 'supertest';
import { app } from '../index';
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from '../test-setup/setup';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';

describe('Auth Routes', () => {
  // --- Database Hooks ---
  beforeAll(async () => {
    await connectTestDB();
  });

  // Create a test user before each test
  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    await User.create({ email: 'test@example.com', password: hashedPassword });
  });

  // Clear the database after each test
  afterEach(async () => {
    await clearTestDB();
  });

  // Disconnect from the database after all tests run
  afterAll(async () => {
    await disconnectTestDB();
  });
  // --- End of Hooks ---

  // --- Registration Tests (Existing) ---
  it('should return 400 when registering a user with no data', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('should return 201 when registering a user with valid data', async () => {
    // Note: The beforeEach user is cleared, so we register a *new* user
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(201);
  });

  // --- NEW: Login Tests ---
  it('should return 200 and a token on successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token'); // Check if a token is returned
  });

  it('should return 401 for a user that does not exist', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
  });
});