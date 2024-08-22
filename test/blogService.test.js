 const { getMyBlogs,getFollowingBlogs,
      checklike,gettags,getcatblogs ,getBlogById,
    getUserBlogs,updateBlogById,getsearchresult} = require('../services/blogservice');
    const Blog = require('../models/blog');
    const BlogTag = require('../models/Blogtag')
    const mongoose = require('mongoose');
    const Follow = require("../models/user")

    jest.mock('../models/blog');

    beforeEach(() => {
      jest.clearAllMocks();
    });
        // Handles updates when all fields (title, subtitle, content) are provided
        it('should handle updates when all fields are provided', async () => {
          const mockUpdatedBlog = { _id: '1', title: 'Updated Title', subtitle: 'Updated Subtitle', body: 'Updated Content' };
          const Blog = require('../models/blog');
          Blog.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBlog);
    
          const updatedBlog = await updateBlogById('1', 'Updated Title', 'Updated Subtitle', 'Updated Content');
    
          expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'Updated Title', subtitle: 'Updated Subtitle', body: 'Updated Content' }, { new: true });
          expect(updatedBlog).toEqual(mockUpdatedBlog);
        });
        // Returns the updated blog document after a successful update
        it('should return updated blog when update is successful', async () => {
          const mockUpdatedBlog = { _id: '1', title: 'Updated Title', subtitle: 'Updated Subtitle', body: 'Updated Content' };
          const Blog = require('../models/blog');
          Blog.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBlog);
    
          const updatedBlog = await updateBlogById('1', 'Updated Title', 'Updated Subtitle', 'Updated Content');
    
          expect(updatedBlog).toEqual(mockUpdatedBlog);
        });
    it('should update the blog when given a valid blogId and content', async () => {
      const mockBlog = { _id: '123', title: 'New Title', subtitle: 'New Subtitle', body: 'New Content' };
      const Blog = require('../models/blog');
      jest.spyOn(Blog, 'findByIdAndUpdate').mockResolvedValue(mockBlog);

      const result = await updateBlogById('123', 'New Title', 'New Subtitle', 'New Content');

      expect(result).toEqual(mockBlog);
      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { title: 'New Title', subtitle: 'New Subtitle', body: 'New Content' },
        { new: true }
      );
    });
        // returns blogs matching the search query
        it('should return blogs matching the search query', async () => {
          const query = 'test';
          const expectedBlogs = [{ title: 'test blog' }];
      
          jest.spyOn(Blog, 'find').mockResolvedValue(expectedBlogs);
      
          const result = await getsearchresult(query);
      
          expect(result).toEqual(expectedBlogs);
          expect(Blog.find).toHaveBeenCalledWith({ $title: { $search: query } });
        });

