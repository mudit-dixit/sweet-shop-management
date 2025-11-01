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
    .set('Authorization', `Bearer ${token}`) // Use the token
    .send(newSweet);

  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe('Sour Patch Kids');
  expect(res.body.quantity).toBe(75);

  // Check the database directly
  const sweetInDb = await Sweet.findById(res.body._id);
  expect(sweetInDb?.name).toBe('Sour Patch Kids');
});
it('should return 200 and filtered sweets when searching by name', async () => {
  const res = await request(app)
    .get('/api/sweets/search?name=Gummy') // Search for 'Gummy'
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('Gummy Bears');
});
it('should return 200 and filtered sweets when searching by category', async () => {
  // Note: The beforeEach hook created 'Gummy Bears' (Candy) and 'Chocolate Bar' (Chocolate)
  const res = await request(app)
    .get('/api/sweets/search?category=Chocolate') // Search for 'Chocolate'
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('Chocolate Bar');
});

// --- ADD THIS NEW TEST (PRICE RANGE) ---
it('should return 200 and filtered sweets when searching by price range', async () => {
  // 'Gummy Bears' (1.99), 'Chocolate Bar' (2.49)
  const res = await request(app)
    .get('/api/sweets/search?minPrice=2.00&maxPrice=3.00') // Search between 2.00 and 3.00
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('Chocolate Bar');
});
it('should return 200 and the updated sweet when updating a sweet', async () => {
  // Find a sweet to update (created in beforeEach)
  const sweetToUpdate = await Sweet.findOne({ name: 'Gummy Bears' });
  const sweetId = sweetToUpdate?._id;

  const updatedData = {
    price: 2.25,
    quantity: 110,
  };

  const res = await request(app)
    .put(`/api/sweets/${sweetId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedData);

  expect(res.statusCode).toBe(200);
  expect(res.body.price).toBe(2.25);
  expect(res.body.quantity).toBe(110);
  expect(res.body.name).toBe('Gummy Bears'); // Name should be unchanged
});
});