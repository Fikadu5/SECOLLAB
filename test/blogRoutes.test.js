<<<<<<< HEAD
const request = require('supertest');
const app = require('../app'); // Your Express app
const blogService = require('../services/blogservice'); // Assuming this is your service
const userService = require('../services/userservice'); // Assuming this is your service
const { getBlogById } = require('../controllers/blogcontroller'); // Your controller
const Blog = require('../models/blog'); // Your Blog model
const User = require('../models/user'); // Your User model

jest.mock('../services/blogService'); // Mock blogService
jest.mock('../services/userService'); // Mock userService
jest.mock('connect-flash'); // Mock req.flash
jest.mock('../models/Blog'); // Mock Blog model
jest.mock('../models/User'); // Mock User model

describe('GET /blogs/:id', () => {
  let mockBlog;
  let mockUser;
  beforeEach(() => {
    mockBlog = {
      _id: '123',
      title: 'Test Blog',
      // ... other blog properties
    };
    mockUser = {
      _id: '456',
      name: 'Test User',
      fname: 'John',
      lname: 'Doe',
      username: 'johndoe',
      twitter: 'johndoe_twitter',
      phone_number: '1234567890',
      age: 30,
      about_me: 'This is a test user',
      github: 'johndoe_github',
      profilephoto: 'https://example.com/profile.jpg',
      previous: 'Software Engineer',
      country: 'USA',
      city: 'New York',
      employment_status: 'Employed',
      education_status: 'Graduated',
      image: 'https://example.com/user-image.jpg',
      skills: 'JavaScript, Python, React',
      email: 'johndoe@example.com',
      followers: [] 
    };
    Blog.findById.mockResolvedValue(mockBlog);
    User.findById.mockResolvedValue(mockUser);
  });

  it('should return a 200 status code and render the specificblog template', async () => {
    const res = await request(app)
      .get('/blogs/123')
      .expect(200);
    expect(res.text).toContain('specficblog'); // Check for template name
  });

  it('should pass blog and user data to the template', async () => {
    const res = await request(app)
      .get('/blogs/123')
      .expect(200);
    expect(res.text).toContain(mockBlog.title); // Check for blog title
    expect(res.text).toContain(mockUser.name); // Check for user name
    expect(res.text).toContain(mockUser.fname); // Check for user's first name
    expect(res.text).toContain(mockUser.lname); // Check for user's last name
    // ... add more assertions for other user properties
  });

  it('should display flash messages if present', async () => {
    req.flash.mockReturnValueOnce(['Success message']);
    const res = await request(app)
      .get('/blogs/123')
      .expect(200);
    expect(res.text).toContain('Success message');
  });
});

describe('getBlogById', () => {
  it('should call Blog.findById with the correct blogId', async () => {
    const blogId = '789';
    await getBlogById({ params: { id: blogId } }, { render: jest.fn() });
    expect(Blog.findById).toHaveBeenCalledWith(blogId);
  });

  it('should handle errors gracefully', async () => {
    Blog.findById.mockRejectedValue(new Error('Error fetching blog'));
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    await getBlogById({ params: { id: '789' } }, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});
=======
const express = require('express');
const request = require('supertest');
const app = express();

// Import routes and controllers
const blogRoutes = require('../routes/blogroutes');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
beforeEach(() => {
  jest.clearAllMocks(); // or jest.resetAllMocks();
});
// Mock middleware
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock('../controllers/blogcontroller', () => ({
  getBlogs: jest.fn((req, res) => res.status(200).send('Blogs List')),
  getBlogById: jest.fn((req, res) => res.status(200).send('Blog Details')),
  createBlog: jest.fn((req, res) => res.status(201).send('Blog Created')),
  editBlog: jest.fn((req, res) => res.status(200).send('Edit Blog Form')),
  updateBlog: jest.fn((req, res) => res.status(200).send('Blog Updated')),
  getotherUsersblogs: jest.fn((req, res) => res.status(200).send('Other Users Blogs')),
  getFollowingBlogs: jest.fn((req, res) => res.status(200).send('Following Blogs')),
  getMyBlogs: jest.fn((req, res) => res.status(200).send('My Blogs')),
  newRoute: jest.fn((req, res) => res.status(200).send('New Blog Form')),
  deleteBlog: jest.fn((req, res) => res.status(200).send('Blog Deleted')),
  getTopBlogs: jest.fn((req, res) => res.status(200).send('Top Blogs')),
  getRandomBlogs: jest.fn((req, res) => res.status(200).send('Random Blog')),
  getcatagories: jest.fn((req, res) => res.status(200).send('Categories List')),
  newtag: jest.fn((req, res) => res.status(201).send('Category Added')),
  getcatblogs: jest.fn((req, res) => res.status(200).send('Category Blogs')),
  getc: jest.fn((req, res) => res.status(200).send('New Category Form')),
  addorremovelike: jest.fn((req, res) => res.status(200).send('Like Added/Removed')),
}));

// Use routes
app.use('/blogs', blogRoutes);

describe('Blog Routes', () => {
  it('GET /blogs should return a list of blogs', async () => {
    const res = await request(app).get('/blogs').expect(200);
    expect(res.text).toBe('Blogs List');
  });

  it('GET /blogs/rand should return a random blog', async () => {
    const res = await request(app).get('/blogs/rand').expect(200);
    expect(res.text).toBe('Random Blog');
  });

  it('GET /blogs/myblogs should return a list of user blogs', async () => {
    const res = await request(app).get('/blogs/myblogs').expect(200);
    expect(res.text).toBe('My Blogs');
  });

  it('GET /blogs/new should render the new blog form', async () => {
    const res = await request(app).get('/blogs/new').expect(200);
    expect(res.text).toBe('New Blog Form');
  });

  it('POST /blogs/new should create a new blog post', async () => {
    const res = await request(app).post('/blogs/new').expect(201);
    expect(res.text).toBe('Blog Created');
  });

  it('GET /blogs/:id should return the blog with the given ID', async () => {
    const res = await request(app).get('/blogs/456').expect(200);
    expect(res.text).toBe('Blog Details');
  });

  it('GET /blogs/edit/:id should render the edit blog form', async () => {
    const res = await request(app).get('/blogs/edit/456').expect(200);
    expect(res.text).toBe('Edit Blog Form');
  });

  it('POST /blogs/edit/:id should update the blog with the given ID', async () => {
    const res = await request(app).post('/blogs/edit/456').expect(200);
    expect(res.text).toBe('Blog Updated');
  });

  it('POST /blogs/delete/:id should delete the blog with the given ID', async () => {
    const res = await request(app).post('/blogs/delete/456').expect(200);
    expect(res.text).toBe('Blog Deleted');
  });

  it('GET /blogs/top should return a list of top blogs', async () => {
    const res = await request(app).get('/blogs/top').expect(200);
    expect(res.text).toBe('Top Blogs');
  });



  it('GET /blogs/userblogs/:id should return a list of blogs from a specific user', async () => {
    const res = await request(app).get('/blogs/userblogs/123').expect(200);
    expect(res.text).toBe('Other Users Blogs');
  });

  it('POST /blogs/addorremovelike/:id should add or remove a like from a blog', async () => {
    const res = await request(app).post('/blogs/addorremovelike/456').expect(200);
    expect(res.text).toBe('Like Added/Removed');
  });

  

  it('GET /blogs/catagories/new should render the new category form', async () => {
    const res = await request(app).get('/blogs/catagories/new').expect(200);
    expect(res.text).toBe('New Category Form');
  });

  it('GET /blogs/catagories/:name should return a list of blogs from a specific category', async () => {
    const res = await request(app).get('/blogs/catagories/Test%20Category').expect(200);
    expect(res.text).toBe('Category Blogs');
  });

  it('GET /blogs/catagories should return a list of all categories', async () => {
    const res = await request(app).get('/blogs/catagories').expect(200);
    expect(res.text).toBe('Categories List');
  });

  it('POST /blogs/catagories/add should create a new category', async () => {
    const res = await request(app).post('/blogs/catagories/add').expect(201);
    expect(res.text).toBe('Category Added');
  });
});

>>>>>>> de6d6d1facab50192802e6d17a7acaa406250bb7
