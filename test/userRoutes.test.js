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

  it('GET /users/explore should render the explore page', async () => {
    const res = await request(app).get('/users/explore').expect(200);
    expect(res.text).toBe('Explore Page');
  });

  it('POST /users/contact should contact a user', async () => {
    const res = await request(app).post('/users/contact').expect(200);
    expect(res.text).toBe('Contact User');
  });

  it('POST /users/follow/:id should follow a user', async () => {
    const res = await request(app).post('/users/follow/123').expect(200);
    expect(res.text).toBe('User Followed');
  });


  it('GET /users/profile should return the user profile', async () => {
    const res = await request(app).get('/users/profile').expect(200);
    expect(res.text).toBe('User Profile');
  });

  it('GET /users/editprofile should render the edit profile page', async () => {
    const res = await request(app).get('/users/editprofile').expect(200);
    expect(res.text).toBe('Edit Profile');
  });

  it('POST /users/editprofile should update the profile', async () => {
    const res = await request(app).post('/users/editprofile').expect(200);
    expect(res.text).toBe('Profile Updated');
  });

  
  it('POST /users/deleteaccount should delete the account', async () => {
    const res = await request(app).post('/users/deleteaccount').expect(200);
    expect(res.text).toBe('Account Deleted');
  });



  it('GET /users/otherprofile/:id should return the other user profile', async () => {
    const res = await request(app).get('/users/otherprofile/123').expect(200);
    expect(res.text).toBe('Other User Profile');
  });

  it('GET /users/myfollowers should return my followers', async () => {
    const res = await request(app).get('/users/myfollowers').expect(200);
    expect(res.text).toBe('My Followers');
  });

  it('GET /users/myfollowing should return my following', async () => {
    const res = await request(app).get('/users/myfollowing').expect(200);
    expect(res.text).toBe('My Following');
  });

  it('GET /users/followers/:id should return followers of user with given ID', async () => {
    const res = await request(app).get('/users/followers/123').expect(200);
    expect(res.text).toBe('Followers');
  });

  it('GET /users/following/:id should return following of user with given ID', async () => {
    const res = await request(app).get('/users/following/123').expect(200);
    expect(res.text).toBe('Following');
  });

  it('GET /users/searchuser/:text should return search results for users', async () => {
    const res = await request(app).get('/users/searchuser/test').expect(200);
    expect(res.text).toBe('Search Results');
  });

  it('POST /users/checkfollow/:id should check if a user is followed', async () => {
    const res = await request(app).post('/users/checkfollow/123').expect(200);
    expect(res.text).toBe('Follow Check');
  });

  it('GET /users/forgetpassword should return current user information', async () => {
    const res = await request(app).get('/users/forgetpassword').expect(200);
    expect(res.text).toBe('Current User');
  });

  it('POST /users/forgetpassword should send a code email for password reset', async () => {
    const res = await request(app).post('/users/forgetpassword').expect(200);
    expect(res.text).toBe('Code Sent');
  });
});

