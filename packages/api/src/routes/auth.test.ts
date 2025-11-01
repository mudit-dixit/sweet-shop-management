import request from 'supertest';
import { app } from '../index';

describe('Auth Routes', () => {
  it('should return 400 when registering a user with no data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});

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