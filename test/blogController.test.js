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
