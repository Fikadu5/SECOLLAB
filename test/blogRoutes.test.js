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
  checklike: jest.fn((req, res) => res.status(200).send('check liked/not liked'))
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

