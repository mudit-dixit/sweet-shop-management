import request from 'supertest';
import { app } from '../index';
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from '../test-setup/setup';
import User from '../models/user.model';
import Sweet from '../models/sweet.model';
import bcrypt from 'bcryptjs';

const getAuthToken = async (role: 'USER' | 'ADMIN' = 'USER') => {
  const email = role === 'ADMIN' ? 'admin@example.com' : 'user@example.com';
  const password = 'password123';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.create({
    email,
    password: hashedPassword,
    role,
  });

  const res = await request(app).post('/api/auth/login').send({
    email,
    password,
  });
  return res.body.token;
};

describe('Sweets Routes', () => {
  let userToken: string;
  let adminToken: string;

  // --- Database Hooks ---
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    userToken = await getAuthToken('USER');
    adminToken = await getAuthToken('ADMIN');

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

  it('should return 200 and a list of sweets for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Gummy Bears');
  });

  it('should return 201 and the new sweet when creating one', async () => {
    const newSweet = {
      name: 'Sour Patch Kids',
      category: 'Candy',
      price: 2.99,
      quantity: 75,
    };
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newSweet);
    expect(res.statusCode).toBe(201);
  });

  it('should return 200 and filtered sweets when searching by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=Gummy')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should return 200 and filtered sweets when searching by category', async () => {
    const res = await request(app)
      .get('/api/sweets/search?category=Chocolate')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should return 200 and filtered sweets when searching by price range', async () => {
    const res = await request(app)
      .get('/api/sweets/search?minPrice=2.00&maxPrice=3.00')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should return 200 and the updated sweet when updating a sweet', async () => {
    const sweetToUpdate = await Sweet.findOne({ name: 'Gummy Bears' });
    const sweetId = sweetToUpdate?._id;
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 2.25, quantity: 110 });
    expect(res.statusCode).toBe(200);
  });

  it('should return 403 (Forbidden) if a regular user tries to delete a sweet', async () => {
    const sweetToDelete = await Sweet.findOne({ name: 'Gummy Bears' });
    const sweetId = sweetToDelete?._id;
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`); // <-- Regular user token
    expect(res.statusCode).toBe(403);
  });

  it('should return 200 if an admin deletes a sweet', async () => {
    const sweetToDelete = await Sweet.findOne({ name: 'Gummy Bears' });
    const sweetId = sweetToDelete?._id;
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sweet deleted successfully');
    const deletedSweet = await Sweet.findById(sweetId);
    expect(deletedSweet).toBeNull();
  });

  it('should return 200 and decrease quantity when a user purchases a sweet', async () => {
  const sweetToPurchase = await Sweet.findOne({ name: 'Gummy Bears' }); // quantity: 100
  const sweetId = sweetToPurchase?._id;

  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set('Authorization', `Bearer ${userToken}`); // Regular user token

  expect(res.statusCode).toBe(200);
  expect(res.body.quantity).toBe(99); // Quantity should decrease by 1

  // Check the database
  const updatedSweet = await Sweet.findById(sweetId);
  expect(updatedSweet?.quantity).toBe(99);
});

it('should return 400 if a user tries to purchase an out-of-stock sweet', async () => {
  // Find a sweet and set its quantity to 0
  const sweetToPurchase = await Sweet.findOne({ name: 'Gummy Bears' });
  sweetToPurchase!.quantity = 0;
  await sweetToPurchase!.save();
  const sweetId = sweetToPurchase?._id;

  const res = await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set('Authorization', `Bearer ${userToken}`);

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('Sweet is out of stock');
});
});