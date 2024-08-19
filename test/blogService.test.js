const blogService = require('../services/blogservice'); // Your service
const Blog = require('../models/blog'); // Your Blog model

jest.mock('../models/Blog'); // Mock Blog model

describe('blogService', () => {
  it('should call Blog.find() to get all blogs', async () => {
    await blogService.getAllBlogs();
    expect(Blog.find).toHaveBeenCalled();
  });

  // Add more tests for specific service functions
  // ...
});
