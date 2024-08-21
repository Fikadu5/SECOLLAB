
    const { getMyBlogs,checklike,newtag,gettags,getcatblogs } = require('../services/blogservice');
    const Blog = require('../models/blog');
    const BlogTag = require('../models/Blogtag')
    const mongoose = require('mongoose');

    jest.mock('../models/blog');

    it('should fetch blogs successfully when given a valid user ID', async () => {
      const mockBlogs = [
        { _id: new mongoose.Types.ObjectId(), title: 'Blog 1', owner: 'user1' },
        { _id: new mongoose.Types.ObjectId(), title: 'Blog 2', owner: 'user1' }
      ];

      Blog.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBlogs)
      });

      const result = await getMyBlogs('user1', 1, 10);

      expect(result).toEqual(mockBlogs);
      expect(Blog.find).toHaveBeenCalledWith({ owner: 'user1' });
    });
