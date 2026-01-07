import request from 'supertest';
import express from 'express';
import contactRoutes from '../routes/contactRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import mongoose from 'mongoose';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment BEFORE creating app
dotenv.config({ path: join(__dirname, '..', '.env.test') });

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

describe('Contact Tests', () => {
  let userToken;
  let adminToken;
  let contactId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/himalaya-homes-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Clean up before tests
    await User.deleteMany({ email: { $regex: /test\.com$/ } });
    await Contact.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Contact',
        lastName: 'Tester',
        email: 'contact@test.com',
        password: 'Test123!@#',
        phone: '9812345681',
        citizenshipNumber: '12345681'
      });
    userToken = userResponse.body.token;

    // Create admin with hashed password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('Admin123!@#', 10);
    await User.create({
      firstName: 'Admin',
      lastName: 'Contact',
      email: 'admincontact@test.com',
      password: hashedPassword,
      phone: '9812345682',
      citizenshipNumber: '12345682',
      role: 'admin'
    });
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admincontact@test.com',
        password: 'Admin123!@#'
      });
    adminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    await Contact.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/contact', () => {
    it('should submit contact form', async () => {
      const response = await request(app)
        .post('/api/contact')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test User',
          email: 'contact@test.com',
          phone: '9812345681',
          message: 'Test message'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('contact');
      contactId = response.body.contact._id;
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test',
          message: 'Test'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/contact', () => {
    it('should get all contact messages (admin)', async () => {
      const response = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail for non-admin users', async () => {
      const response = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
