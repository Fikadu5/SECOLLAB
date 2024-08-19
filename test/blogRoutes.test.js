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
