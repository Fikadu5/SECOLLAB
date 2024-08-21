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

// Mock controllers
jest.mock('../controllers/projectcontrollers', () => ({
  getProjects: jest.fn((req, res) => res.status(200).send('Projects List')),
  createProject: jest.fn((req, res) => res.status(201).send('Project Created')),
  getProjectById: jest.fn((req, res) => res.status(200).send('Project Details')),
  searchProjects: jest.fn((req, res) => res.status(200).send('Search Results')),
  getmyprojectwithid: jest.fn((req, res) => res.status(200).send('User Project')),
  getsearchresult: jest.fn((req, res) => res.status(200).send('Search Result')),
  searchResults: jest.fn((req, res) => res.status(200).send('Search Results')),
  getFollowingProjects: jest.fn((req, res) => res.status(200).send('Following Projects')),
  getMyProjects: jest.fn((req, res) => res.status(200).send('My Projects')),
  getmycollabration: jest.fn((req, res) => res.status(200).send('My Collaborations')),
  deleteproject: jest.fn((req, res) => res.status(200).send('Project Deleted')),
  newproject: jest.fn((req, res) => res.status(200).send('New Project Form')),
  getcatagories: jest.fn((req, res) => res.status(200).send('Project Categories')),
  registerInterestwithid: jest.fn((req, res) => res.status(200).send('Interest Registered')),
  acceptinterest: jest.fn((req, res) => res.status(200).send('Interest Accepted')),
}));

