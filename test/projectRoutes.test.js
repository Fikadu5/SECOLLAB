const express = require('express');
const request = require('supertest');
const app = express();

// Import routes and controllers
const projectRoutes = require('../routes/projectroute');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

beforeEach(() => {
  jest.clearAllMocks(); // or jest.resetAllMocks();
});

// Mock middleware
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => next()),
}));
