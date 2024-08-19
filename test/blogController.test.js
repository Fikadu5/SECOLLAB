const { getBlogById } = require('../controllers/blogcontroller'); // Your controller
const Blog = require('../models/blog'); // Your Blog model

jest.mock('../models/Blog'); // Mock Blog model

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
