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
    
    // Successfully retrieves blogs followed by the user
    it('should retrieve blogs followed by the user when user is following blogs', async () => {
      const req = {
        user: { _id: 'user123' },
        flash: jest.fn().mockReturnValue([])
      };
      const res = {
        render: jest.fn()
      };
      const blogs = [{ title: 'Blog 1' }, { title: 'Blog 2' }];
      const currentuser = { name: 'John Doe' };

      jest.spyOn(blogService, 'getFollowingBlogs').mockResolvedValue(blogs);
      jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);

      await getFollowingBlogs(req, res);

      expect(blogService.getFollowingBlogs).toHaveBeenCalledWith('user123');
      expect(userService.getUserById).toHaveBeenCalledWith('user123');
      expect(res.render).toHaveBeenCalledWith('allblog', {
        blogs,
        messages: {
          success: [],
          error: []
        },
        currentuser
      });
    });
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
            messages: {
              success: [],
              error: []
            },
            currentuser
          });
        });
            // User has already liked the blog post
    it('should return 200 status and "already liked" message when user has already liked the blog post', async () => {
      const req = {
        user: { _id: 'user123' },
        params: { id: 'blog123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    
      jest.spyOn(blogService, 'checklike').mockResolvedValue(200);

      await checklike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ "message": "already liked" });
    });


        // User ID is missing or invalid
        it('should handle missing or invalid user ID', async () => {
          const req = {
            user: { _id: null },
            params: { id: 'blog123' }
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
          };
         
          jest.spyOn(blogService, 'checklike').mockResolvedValue(201);
    
          await checklike(req, res);
    
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith({ "message": "not liked" });
        });
