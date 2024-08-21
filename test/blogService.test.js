
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
  // Retrieves blogs not owned by the given user ID
        it('should retrieve blogs not owned by the given user ID', async () => {
          const mockBlogs = [
            { _id: '1', owner: '123', tags: ['tag1'] },
            { _id: '2', owner: '456', tags: ['tag2'] }
          ];

          Blog.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            populate: jest.fn().mockResolvedValue(mockBlogs)
          });

          const result = await getBlogs('789');

          expect(Blog.find).toHaveBeenCalledWith({ owner: { $ne: '789' } });
          expect(result).toEqual(mockBlogs);
        });
            // Retrieves blogs not owned by the given user ID
    it('should retrieve blogs not owned by the given user ID', async () => {
      const mockBlogs = [
          { _id: '1', owner: 'user2', tags: ['tag1'] },
          { _id: '2', owner: 'user3', tags: ['tag2'] }
      ];

      Blog.find = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          populate: jest.fn().mockResolvedValue(mockBlogs)
      });

      const result = await getBlogs('user1');

      expect(Blog.find).toHaveBeenCalledWith({ owner: { $ne: 'user1' } });
      expect(result).toEqual(mockBlogs);
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
          // Successfully updates a blog with valid blogId and content
    it('should update the blog when given valid blogId and content', async () => {
      const mockBlogId = 'validBlogId';
      const mockTitle = 'New Title';
      const mockSubtitle = 'New Subtitle';
      const mockContent = 'New Content';

      const mockFindByIdAndUpdate = jest.spyOn(Blog, 'findByIdAndUpdate').mockResolvedValue({});

      await updateBlogById(mockBlogId, mockTitle, mockSubtitle, mockContent);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(mockBlogId, { title: mockTitle, subtitle: mockSubtitle, body: mockContent });

      mockFindByIdAndUpdate.mockRestore();
    });
        // Fetch blogs for a valid userId with valid pagination parameters
        it('should return blogs when given a valid userId and pagination parameters', async () => {
          const userId = 'validUserId';
          const page = 1;
          const limit = 10;

          const mockBlogs = [{ _id: '1', title: 'Blog 1' }, { _id: '2', title: 'Blog 2' }];
          Blog.aggregate = jest.fn().mockResolvedValue(mockBlogs);

          const result = await getUserBlogs(userId, page, limit);

          expect(Blog.aggregate).toHaveBeenCalledWith([
            { $match: { user_id: userId } },
            { $sample: { size: 1000 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ]);
          expect(result).toEqual(mockBlogs);
        });
            // Successfully increment like count when user has not liked the blog
    const { addorremovelike } = require('../services/blogservice');

    it('should increment like count when user has not liked the blog', async () => {
      const blogid = new mongoose.Types.ObjectId();
      const userid = new mongoose.Types.ObjectId();
      const blog = {
        _id: blogid,
        like: 0,
        likedby: [],
        save: jest.fn().mockResolvedValue(true)
      };

      Blog.findById.mockResolvedValue(blog);

      const status = await addorremovelike(blogid, userid);

      expect(blog.like).toBe(1);
      expect(blog.likedby).toContain(userid);
      expect(blog.save).toHaveBeenCalled();
      expect(status).toBe(201);
    });
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
 it('should return 201 when blog ID does not exist in the database', async () => {
      Blog.findById.mockResolvedValue(null);

      const result = await checklike('nonexistentBlog', 'user1');
      expect(result).toBe(201);
    });
    it('should return all tags when they exist in the database', async () => {
      const mockTags = [{ name: 'tag1' }, { name: 'tag2' }];
      jest.spyOn(BlogTag, 'find').mockResolvedValue(mockTags);

      const result = await gettags();

      expect(result).toEqual(mockTags);
      BlogTag.find.mockRestore();
    });
    it('should create a new BlogTag when valid name and slug are provided', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      BlogTag.mockImplementation(() => ({
        save: mockSave
      }));

      const name = 'Tech';
      const slug = 'tech';
      const result = await newtag(name, slug);

      expect(BlogTag).toHaveBeenCalledWith({ name, slug });
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ name, slug }));
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









        afterEach(() => {
          jest.clearAllMocks();
        });
