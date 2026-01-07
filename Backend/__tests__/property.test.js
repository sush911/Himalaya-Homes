import request from 'supertest';
import express from 'express';
import propertyRoutes from '../routes/propertyRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import PropertyRequest from '../models/PropertyRequest.js';
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
app.use('/api/properties', propertyRoutes);

describe('Property Tests', () => {
  let userToken;
  let adminToken;
  let userId;
  let propertyId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/himalaya-homes-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Clean up before tests
    await User.deleteMany({ email: { $regex: /test\.com$/ } });
    await Property.deleteMany({});
    await PropertyRequest.deleteMany({});

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Property',
        lastName: 'Tester',
        email: 'property@test.com',
        password: 'Test123!@#',
        phone: '9812345679',
        citizenshipNumber: '12345679'
      });
    userToken = userResponse.body.token;
    // Get userId from the token response (_id field)
    userId = userResponse.body._id;

    // Create admin user with hashed password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('Admin123!@#', 10);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: hashedPassword,
      phone: '9812345680',
      citizenshipNumber: '12345680',
      role: 'admin'
    });
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin123!@#'
      });
    adminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    await Property.deleteMany({});
    await PropertyRequest.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/properties/requests', () => {
    it('should create a property request', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A beautiful test property',
        price: 5000000,
        propertyType: 'house',
        listingType: 'sale',
        bedrooms: 3,
        bathrooms: 2,
        location: {
          address: 'Test Address',
          city: 'Kathmandu',
          province: 'Bagmati',
          coordinates: { lat: 27.7172, lng: 85.3240 }
        },
        media: {
          propertyPhotos: ['test.jpg']
        }
      };

      const response = await request(app)
        .post('/api/properties/requests')
        .set('Authorization', `Bearer ${userToken}`)
        .send(propertyData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test Property');
      expect(response.body).toHaveProperty('status', 'pending');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/properties/requests')
        .send({ title: 'Test' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/properties', () => {
    it('should list all approved properties', async () => {
      const response = await request(app)
        .get('/api/properties');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter properties by listing type', async () => {
      const response = await request(app)
        .get('/api/properties?listingType=sale');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter properties by property type', async () => {
      const response = await request(app)
        .get('/api/properties?propertyType=house');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/properties/nearby/overpass', () => {
    it('should fetch nearby places', async () => {
      const response = await request(app)
        .post('/api/properties/nearby/overpass')
        .send({ lat: 27.7172, lng: 85.3240 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('education');
      expect(response.body).toHaveProperty('food');
      expect(response.body).toHaveProperty('health');
    }, 60000); // 60 second timeout for API call with retries

    it('should fail without coordinates', async () => {
      const response = await request(app)
        .post('/api/properties/nearby/overpass')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/properties/:id/favorite', () => {
    beforeAll(async () => {
      // Wait for userId to be available, then create a test property
      // userId comes from the register response in the parent beforeAll
      if (!userId) {
        // Fallback: get user from database
        const user = await User.findOne({ email: 'property@test.com' });
        userId = user._id.toString();
      }
      
      const property = await Property.create({
        title: 'Favorite Test Property',
        description: 'Test property for favorite testing',
        price: 1000000,
        propertyType: 'house',
        listingType: 'sale',
        location: {
          address: 'Test Address',
          city: 'Kathmandu',
          coordinates: { lat: 27.7172, lng: 85.3240 }
        },
        postedBy: userId,
        isApproved: true,
        media: {
          lalpurjaPhotos: [],
          propertyPhotos: [],
          propertyVideos: [],
          roadPhotos: [],
          roadVideos: []
        }
      });
      propertyId = property._id.toString();
    });

    it('should toggle favorite status', async () => {
      const response = await request(app)
        .post(`/api/properties/${propertyId}/favorite`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('added');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/properties/${propertyId}/favorite`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/properties/:id/report', () => {
    it('should report a property', async () => {
      const response = await request(app)
        .post(`/api/properties/${propertyId}/report`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reason: 'fraudulent' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Reported');
    });

    it('should fail with invalid reason', async () => {
      const response = await request(app)
        .post(`/api/properties/${propertyId}/report`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ reason: 'invalid' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/properties/:id/reviews', () => {
    it('should add a review', async () => {
      const response = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 5, comment: 'Great property!' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should fail with invalid rating', async () => {
      const response = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ rating: 6 });

      expect(response.status).toBe(400);
    });
  });
});
