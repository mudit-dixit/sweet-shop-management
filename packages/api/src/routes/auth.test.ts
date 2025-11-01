import request from 'supertest';
import { app } from '../index';

describe('Auth Routes', () => {
  it('should return 400 when registering a user with no data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(res.statusCode).toBe(400); 
  });
});