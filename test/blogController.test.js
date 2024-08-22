 const {getFollowingBlogs,
      checklike,getsearchresult,updateBlog,
      getcatblogs, getcatagories,getRandomBlogs} =require("../controllers/blogcontroller")
    const blogService = require("../services/blogservice");
    const userService = require("../services/userservice")
    const httpMocks = require('node-mocks-http');
    const { mockRequest, mockResponse } = httpMocks;

    const Blog = require('../models/blog');


    jest.mock('../services/projectservice');


        // User has no blogs they are following
        it('should handle case when user is not following any blogs', async () => {
          const req = {
            user: { _id: 'user123' },
            flash: jest.fn().mockReturnValue([])
          };
          const res = {
            render: jest.fn()
          };
          const blogs = [];
          const currentuser = { name: 'John Doe' };
    
          jest.spyOn(blogService, 'getFollowingBlogs').mockResolvedValue(blogs);
          jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);
    
          await getFollowingBlogs(req, res);
    
          expect(blogService.getFollowingBlogs).toHaveBeenCalledWith('user123');
          expect(userService.getUserById).toHaveBeenCalledWith('user123');
          expect(res.render).toHaveBeenCalledWith('allblog', {
            blogs,
            messages: { success: [], error: [] },
            currentuser
          });
        });
    // Handles scenario where no blogs are found
    it('should handle scenario where no blogs are found', async () => {
      const req = {
        params: { text: 'test' },
        user: { _id: 'user123' },
        flash: jest.fn().mockReturnValue([])
      };
      const res = {
        render: jest.fn()
      };
  
      jest.spyOn(blogService, 'getsearchresult').mockReturnValue(null);
      jest.spyOn(userService, 'getUserById').mockReturnValue({ name: 'Test User' });
      console.log = jest.fn();

      await getsearchresult(req, res);

      expect(blogService.getsearchresult).toHaveBeenCalledWith('test');
      expect(console.log).toHaveBeenCalledWith('error with blogs');
    });

        // Retrieves search results based on query parameter
        it('should retrieve search results based on query parameter', async () => {
          const req = {
            params: { text: 'test' },
            user: { _id: 'user123' },
            flash: jest.fn().mockReturnValue([])
          };
          const res = {
            render: jest.fn()
          };

          jest.spyOn(blogService, 'getsearchresult').mockReturnValue([{ title: 'Test Blog' }]);
          jest.spyOn(userService, 'getUserById').mockReturnValue({ name: 'Test User' });
    
          await getsearchresult(req, res);
    
          expect(blogService.getsearchresult).toHaveBeenCalledWith('test');
          expect(userService.getUserById).toHaveBeenCalledWith('user123');
          expect(res.render).toHaveBeenCalledWith('searchblogs', {
            blogs: [{ title: 'Test Blog' }],
            messages: { success: [], error: [] },
            currentuser: { name: 'Test User' }
          });
        });
 // Handles unauthorized user trying to update a blog
        it('should return 403 when the user is unauthorized', async () => {
          const req = {
            params: { id: '123' },
            body: { title: 'New Title', subtitle: 'New Subtitle', content: 'New Content' },
            user: { _id: 'user123' }
          };
          const res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
          };

          jest.spyOn(blogService, 'getBlogById').mockResolvedValue({ user_id: { equals: jest.fn().mockReturnValue(false) } });

          await updateBlog(req, res);

          expect(blogService.getBlogById).toHaveBeenCalledWith('123');
          expect(res.status).toHaveBeenCalledWith(403);
          expect(res.send).toHaveBeenCalledWith('Unauthorized');
        });
    // Successfully updates a blog when user is authorized
    it('should update the blog when the user is authorized', async () => {
      const req = {
        params: { id: '123' },
        body: { title: 'New Title', subtitle: 'New Subtitle', content: 'New Content' },
        user: { _id: 'user123' }
      };
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      jest.spyOn(blogService, 'getBlogById').mockResolvedValue({ user_id: { equals: jest.fn().mockReturnValue(true) } });
      jest.spyOn(blogService, 'updateBlogById').mockResolvedValue();

      await updateBlog(req, res);

      expect(blogService.getBlogById).toHaveBeenCalledWith('123');
      expect(blogService.updateBlogById).toHaveBeenCalledWith('123', 'New Title', 'New Subtitle', 'New Content');
      expect(res.redirect).toHaveBeenCalledWith('/myblogs');
    });

    // Handles case when there are no blogs available
    it('should render the view with empty blogs and pagination when no blogs are available', async () => {
      const req = {
        user: { _id: 'userId' },
        query: { page: '1', limit: '10' },
        flash: jest.fn()
      };
      const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const mockUser = { name: 'Test User' };
  
      jest.spyOn(Blog, 'countDocuments').mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(blogService, 'getRandomBlogs').mockResolvedValue([]);
  
      await getRandomBlogs(req, res);
  
      expect(Blog.countDocuments).toHaveBeenCalledWith({ owner: { $ne: 'userId' } });
      expect(userService.getUserById).toHaveBeenCalledWith('userId');
      expect(blogService.getRandomBlogs).toHaveBeenCalledWith('userId', 1, 10);
      expect(res.render).toHaveBeenCalledWith('allblog', {
        blogs: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          limit: 10,
          totalResults: 0
        },
        messages: {
          success: req.flash('success'),
          error: req.flash('error')
        },
        currentuser: mockUser
      });
    });
        // Successfully fetches random blogs for a user
        it('should fetch random blogs and render the view with pagination when blogs are available', async () => {
          const req = {
            user: { _id: 'userId' },
            query: { page: '1', limit: '10' },
            flash: jest.fn()
          };
          const res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
          };
          const mockBlogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
          const mockUser = { name: 'Test User' };
      
          jest.spyOn(Blog, 'countDocuments').mockReturnValue({ exec: jest.fn().mockResolvedValue(20) });
          jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
          jest.spyOn(blogService, 'getRandomBlogs').mockResolvedValue(mockBlogs);
      
          await getRandomBlogs(req, res);
      
          expect(Blog.countDocuments).toHaveBeenCalledWith({ owner: { $ne: 'userId' } });
          expect(userService.getUserById).toHaveBeenCalledWith('userId');
          expect(blogService.getRandomBlogs).toHaveBeenCalledWith('userId', 1, 10);
          expect(res.render).toHaveBeenCalledWith('allblog', {
            blogs: mockBlogs,
            pagination: {
              currentPage: 1,
              totalPages: 2,
              limit: 10,
              totalResults: 20
            },
            messages: {
              success: req.flash('success'),
              error: req.flash('error')
            },
            currentuser: mockUser
          });
        });
    // blogService.gettags() returns an empty array
    it('should render Blogcatagories with empty tags array and currentuser when blogService.gettags() returns an empty array', async () => {
      const req = { user: { _id: '123' } };
      const res = { render: jest.fn() };
      const tags = [];
      const currentuser = { name: 'John Doe' };

      jest.spyOn(blogService, 'gettags').mockResolvedValue(tags);
      jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);

      await getcatagories(req, res);

      expect(blogService.gettags).toHaveBeenCalled();
      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.render).toHaveBeenCalledWith('Blogcatagories', { tags, currentuser });
    });
    // Successfully retrieves tags from blogService

