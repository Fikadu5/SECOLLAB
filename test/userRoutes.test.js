const express = require('express');
const request = require('supertest');
const app = express();

// Import routes and controllers
const userRoutes = require('../routes/userroutes');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

beforeEach(() => {
  jest.clearAllMocks(); // or jest.resetAllMocks();
});

// Mock middleware
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock('../controllers/usercontrollers', () => ({
  getUsers: jest.fn((req, res) => res.status(200).send('Users List')),
  contactUser: jest.fn((req, res) => res.status(200).send('Contact User')),
  getProfile: jest.fn((req, res) => res.status(200).send('User Profile')),
  editProfile: jest.fn((req, res) => res.status(200).send('Edit Profile')),
  editProfileChange: jest.fn((req, res) => res.status(200).send('Profile Updated')),
  deleteUser: jest.fn((req, res) => res.status(200).send('Account Deleted')),
  getsearchresult: jest.fn((req, res) => res.status(200).send('Search Results')),
  getOtherUserProfile: jest.fn((req, res) => res.status(200).send('Other User Profile')),
  renderabout: jest.fn((req, res) => res.status(200).send('About Page')),
  SendCodeEmail: jest.fn((req, res) => res.status(200).send('Code Sent')),
  getcurrentuser: jest.fn((req, res) => res.status(200).send('Current User')),
  getMyProfile: jest.fn((req, res) => res.status(200).send('My Profile')),
  otherusers: jest.fn((req, res) => res.status(200).send('Other Users')),
  getMyFollowers: jest.fn((req, res) => res.status(200).send('My Followers')),
  getMyFollwing: jest.fn((req, res) => res.status(200).send('My Following')),
  followUser: jest.fn((req, res) => res.status(200).send('User Followed')),
  checkfollow: jest.fn((req, res) => res.status(200).send('Follow Check')),
  rendercontact: jest.fn((req, res) => res.status(200).send('Contact Page')),
  removefollower: jest.fn((req, res) => res.status(200).send('Follower Removed')),
  unfollow: jest.fn((req, res) => res.status(200).send('User Unfollowed')),
  explore: jest.fn((req, res) => res.status(200).send('Explore Page')),
  getFollowers: jest.fn((req, res) => res.status(200).send('Followers')),
  getFollowing: jest.fn((req, res) => res.status(200).send('Following')),
}));

// Use routes
app.use('/users', userRoutes);
describe('User Routes', () => {
	 it('GET /users should return a list of users', async () => {
    const res = await request(app).get('/users').expect(200);
    expect(res.text).toBe('Users List');
  });

  it('GET /users/contact should render the contact page', async () => {
    const res = await request(app).get('/users/contact').expect(200);
    expect(res.text).toBe('Contact Page');
  });

  it('GET /users/about should render the about page', async () => {
    const res = await request(app).get('/users/about').expect(200);
    expect(res.text).toBe('About Page');
  });

  it('GET /users/myprofile should return my profile', async () => {
    const res = await request(app).get('/users/myprofile').expect(200);
    expect(res.text).toBe('My Profile');
  });

  it('POST /users/removefollower/:id should remove a follower', async () => {
    const res = await request(app).post('/users/removefollower/123').expect(200);
    expect(res.text).toBe('Follower Removed');
  });
