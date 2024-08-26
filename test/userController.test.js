const userService = require('../services/userservice');
const { rendercontact,getOtherUserProfile,removefollower,
  getMyFollwing,getMyFollowers,deleteUser,followUser,
  checkfollow,unfollow } = require('../controllers/usercontrollers');
  const {getBlogById, getUserBlogs,} = require("../services/blogservice")
const httpMocks = require('node-mocks-http');
const { mockRequest, mockResponse } = httpMocks;
    // Successfully updates user profile with valid details
    const { editProfileChange } = require('../controllers/usercontrollers');
   
    jest.mock('../services/userService');


it('should render contact page with a valid user', async () => {
    const req = httpMocks.createRequest({
        user: { _id: 'validUserId' }
    });
    const res = httpMocks.createResponse();
    const user = { _id: 'validUserId', name: 'John Doe' };

    userService.getUserById = jest.fn().mockResolvedValue(user);

    await rendercontact(req, res);

    expect(userService.getUserById).toHaveBeenCalledWith('validUserId');
    expect(res._getRenderView()).toBe('contact');
    expect(res._getRenderData()).toEqual({ currentuser: user });
});
it('should render deleteaccount with the current user when user ID is found', async () => {
  const req = { user: { _id: '123' } };
  const res = { render: jest.fn() };
  const currentuser = { _id: '123', name: 'John Doe' };


  jest.spyOn(userService, 'getUserById').mockResolvedValue(currentuser);

  const { deleteaccount } = require('../controllers/usercontrollers');
  await deleteaccount(req, res);

  expect(userService.getUserById).toHaveBeenCalledWith('123');
  expect(res.render).toHaveBeenCalledWith('deleteaccount', { currentuser });
});
    // Logout function returns an error
    it('should handle error when logout function returns an error', async () => {
      const req = {
        logout: jest.fn((callback) => callback(new Error('Logout error'))),
        user: { _id: '123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
    
      await deleteUser(req, res);
  
      expect(req.logout).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
      
            // Unauthenticated user is redirected to the login page
    it('should redirect to login when the user is not authenticated', async () => {
      const req = {
        isAuthenticated: jest.fn().mockReturnValue(false)
      };
      const res = {
        redirect: jest.fn()
      };
      await getOtherUserProfile(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/login');
    });
        // User successfully follows another user
        it('should return 200 and success message when user successfully follows another user', async () => {
          const req = {
            user: { _id: 'user1' },
            params: { id: 'user2' }
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
          };
          const followUserMock = jest.spyOn(userService, 'followUser').mockResolvedValue(true);
    
          await followUser(req, res);
    
          expect(followUserMock).toHaveBeenCalledWith('user1', 'user2');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: "successfully subscribed" });
        });
            // User tries to follow themselves
    it('should return 400 and failure message when user tries to follow themselves', async () => {
      const req = {
        user: { _id: 'user1' },
        params: { id: 'user1' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const followUserMock = jest.spyOn(userService, 'followUser').mockResolvedValue(false);

      await followUser(req, res);

      expect(followUserMock).toHaveBeenCalledWith('user1', 'user1');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Failed to follow user" });
    });


    // Successfully unfollows a user when valid follower and following IDs are provided
    it('should return 200 and success message when valid follower and following IDs are provided', async () => {
      const req = {
        params: { id: 'followingId123' },
        user: { _id: 'followerId123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
     
      userService.unfollow = jest.fn().mockResolvedValue(true);

      await unfollow(req, res);

      expect(userService.unfollow).toHaveBeenCalledWith('followerId123', 'followingId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ "message": "sucessfully unfollowed" });
    });
        
            // User follows another user successfully
    it('should return 200 and success message when user follows another user successfully', async () => {
      const req = {
        user: { _id: 'followerId' },
        params: { id: 'followingId' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
     
      userService.checkfollowing = jest.fn().mockResolvedValue(true);

      await checkfollow(req, res);

      expect(userService.checkfollowing).toHaveBeenCalledWith('followerId', 'followingId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "follows the user" });
    });
        // Invalid user ID format
        it('should return 400 and error message when user ID format is invalid', async () => {
          const req = {
            user: { _id: 'followerId' },
            params: { id: 'invalidId' }
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
          };
        
          userService.checkfollowing = jest.fn().mockResolvedValue(false);
    
          await checkfollow(req, res);
    
          expect(userService.checkfollowing).toHaveBeenCalledWith('followerId', 'invalidId');
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: "does not follow the userS" });
        });
            // Fetch followers successfully when valid user ID is provided
    it('should fetch followers successfully when valid user ID is provided', async () => {
      const req = {
        query: { page: '1', limit: '10' },
        user: { _id: 'validUserId' },
        flash: jest.fn()
      };
      const res = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const paginatedFollowers = [{ id: 1, name: 'Follower1' }];
      const currentuser = { id: 'validUserId', name: 'CurrentUser' };
  
      userService.getmyFollowers = jest.fn().mockResolvedValue(paginatedFollowers);
      userService.getUserById = jest.fn().mockReturnValue(currentuser);
  
      await getMyFollowers(req, res);
  
      expect(userService.getmyFollowers).toHaveBeenCalledWith('validUserId', 1, 10);
      expect(userService.getUserById).toHaveBeenCalledWith('validUserId');
      expect(res.render).toHaveBeenCalledWith("myfollowers", { 
        paginatedFollowers, 
        messages: { success: undefined, error: undefined }, 
        currentuser 
      });
    });
       