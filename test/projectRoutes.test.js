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

// Use routes
app.use('/projects', projectRoutes);

describe('Project Routes', () => {
  it('GET /projects should return a list of projects', async () => {
    const res = await request(app).get('/projects').expect(200);
    expect(res.text).toBe('Projects List');
  });

  it('GET /projects/addproject should render the new project form', async () => {
    const res = await request(app).get('/projects/addproject').expect(200);
    expect(res.text).toBe('New Project Form');
  });

  it('POST /projects/addproject should create a new project', async () => {
    const res = await request(app).post('/projects/addproject').expect(201);
    expect(res.text).toBe('Project Created');
  });



  it('POST /projects/delete/:id should delete the project with the given ID', async () => {
    const res = await request(app).post('/projects/delete/123').expect(200);
    expect(res.text).toBe('Project Deleted');
  });

  it('GET /projects/myprojects should return a list of my projects', async () => {
    const res = await request(app).get('/projects/myprojects').expect(200);
    expect(res.text).toBe('My Projects');
  });

  it('GET /projects/myprojects/:id should return the project of the user with the given ID', async () => {
    const res = await request(app).get('/projects/myprojects/123').expect(200);
    expect(res.text).toBe('User Project');
  });

  it('GET /projects/followingprojects should return a list of following projects', async () => {
    const res = await request(app).get('/projects/followingprojects').expect(200);
    expect(res.text).toBe('Following Projects');
  });

  it('GET /projects/searchproject should return search results for projects', async () => {
    const res = await request(app).get('/projects/searchproject').expect(200);
    expect(res.text).toBe('Search Results');
  });

  it('GET /projects/searchresult/:text should return search result for text', async () => {
    const res = await request(app).get('/projects/searchresult/test').expect(200);
    expect(res.text).toBe('Search Result');
  });

  it('GET /projects/projectcatagories should return a list of project categories', async () => {
    const res = await request(app).get('/projects/projectcatagories').expect(200);
    expect(res.text).toBe('Project Categories');
  });

  it('POST /projects/registerinterest/:id should register interest in a project', async () => {
    const res = await request(app).post('/projects/registerinterest/123').expect(200);
    expect(res.text).toBe('Interest Registered');
  });

  it('POST /projects/acceptinterest/:projectid/:userid should accept interest in a project', async () => {
    const res = await request(app).post('/projects/acceptinterest/123/456').expect(200);
    expect(res.text).toBe('Interest Accepted');
  });

  it('GET /projects/mycollabration should return a list of collaborations', async () => {
    const res = await request(app).get('/projects/mycollabration').expect(200);
    expect(res.text).toBe('My Collaborations');
  });
});

