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

      // Returns without error when the blog is updated successfully
        it('should throw an error when an invalid blogId is provided', async () => {
          const blogId = 'invalidBlogId';
          const title = 'New Title';
          const subtitle = 'New Subtitle';
          const content = 'New Content';
      
          Blog.findByIdAndUpdate.mockRejectedValueOnce(new Error('Error updating blog'));
      
          await expect(updateBlogById(blogId, title, subtitle, content)).rejects.toThrow('Error updating blog');
        });

    it('should return blogs when given a valid user ID and pagination parameters', async () => {
      const userId = 'validUserId';
      const page = 1;
      const limit = 10;
      const mockBlogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
  
      Blog.aggregate.mockResolvedValue(mockBlogs);
  
      const result = await getUserBlogs(userId, page, limit);
  
      expect(result).toEqual(mockBlogs);
      expect(Blog.aggregate).toHaveBeenCalledWith([
        { $match: { user_id: userId } },
        { $sample: { size: 1000 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);
    });
    it('should throw an error when given an invalid user ID', async () => {
      const userId = 'invalidUserId';
      const page = 1;
      const limit = 10;
  
      Blog.aggregate.mockRejectedValue(new Error('Error fetching user blogs'));
  
      await expect(getUserBlogs(userId, page, limit)).rejects.toThrow('Error fetching user blogs');
    });
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

      // Successfully creates a blog with valid title, subtitle, content, userId, image, and checkedOptions
      it('should create a blog when all parameters are valid', async () => {
        const Blog = require('../models/blog');
        const { createBlog } = require('../services/blogservice');
    
        const mockSave = jest.fn().mockResolvedValue({});
        Blog.prototype.save = mockSave;
    
        const title = 'Test Title';
        const subtitle = 'Test Subtitle';
        const content = 'Test Content';
        const userId = '12345';
        const image = 'testimage.jpg';
        const checkedOptions = ['option1', 'option2'];
    
        await createBlog(title, subtitle, content, userId, image, checkedOptions);
    
        expect(mockSave).toHaveBeenCalled();
        expect(mockSave).toHaveBeenCalledTimes(1);
      });
     
    const { addorremovelike } = require('../services/blogservice');
    
    it('should throw error when blog is not found', async () => {
      const blogid = new mongoose.Types.ObjectId();
      const userid = new mongoose.Types.ObjectId();

      Blog.findById.mockResolvedValue(null);

      await expect(addorremovelike(blogid, userid)).rejects.toThrow('Blog not found');
    });
    it('should return 200 when user ID is in the likedby array', async () => {
      const mockBlog = { likedby: ['user1', 'user2'] };
      Blog.findById.mockResolvedValue(mockBlog);

      const result = await checklike('blog1', 'user1');
      expect(result).toBe(200);
    });
    it('should return all tags when tags are found in the database', async () => {
      const mockTags = [{ name: 'tag1' }, { name: 'tag2' }];
      jest.spyOn(BlogTag, 'find').mockResolvedValue(mockTags);

      const result = await gettags();

      expect(result).toEqual(mockTags);
    });
    
  
    it('should return all tags when they exist in the database', async () => {
      const mockTags = [{ name: 'tag1' }, { name: 'tag2' }];
      jest.spyOn(BlogTag, 'find').mockResolvedValue(mockTags);
  
      const result = await gettags();
  
      expect(result).toEqual(mockTags);
      BlogTag.find.mockRestore();
    });
  
        // Retrieve blogs associated with a valid tag name
        it('should return blogs when a valid tag name is provided', async () => {
          const mockTag = { _id: 'validObjectId' };
          const mockBlogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
      
          // Mock BlogTag.findOne to return the mock tag
          jest.spyOn(BlogTag, 'findOne').mockResolvedValue(mockTag);
      
          // Mock Blog.find to return a query object that supports chaining methods
          const mockQuery = {
            sort: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(mockBlogs),
          };
          jest.spyOn(Blog, 'find').mockReturnValue(mockQuery);
      
          // Call the function
          const result = await getcatblogs('validTagName');
      
          // Assertions
          expect(BlogTag.findOne).toHaveBeenCalledWith({ name: 'validTagName' });
          expect(Blog.find).toHaveBeenCalledWith({ tags: { $in: [mockTag._id] } });
          expect(mockQuery.sort).toHaveBeenCalledWith({ created_at: 1 });
          expect(mockQuery.populate).toHaveBeenCalledWith('tags');
          expect(result).toEqual(mockBlogs);
        });



               
