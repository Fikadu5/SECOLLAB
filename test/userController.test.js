const userService = require('../services/userservice');
const { rendercontact,getOtherUserProfile,removefollower,getMyFollwing,getMyFollowers,deleteUser,followUser,checkfollow,unfollow } = require('../controllers/usercontrollers');
const httpMocks = require('node-mocks-http');
    // Successfully updates user profile with valid details
    const { editProfileChange } = require('../controllers/usercontrollers');
   
    jest.mock('../services/userService');


        // Successfully removes a follower and redirects to /myfollowers
        it('should redirect to /myfollowers when follower is successfully removed', async () => {
          const req = {
            params: { id: 'followerId' },
            user: { _id: 'userId' }
          };
          const res = {
            redirect: jest.fn()
          };
          const userService = {
            removefollower: jest.fn().mockResolvedValue(true)
          };
          const removefollower = require('../controllers/usercontrollers').removefollower;
      
          await removefollower(req, res);
      
          expect(userService.removefollower).toHaveBeenCalledWith('userId', 'followerId');
          expect(res.redirect).toHaveBeenCalledWith('/myfollowers');
        });
    it('should update user profile when valid details are provided', async () => {
      const req = {
        body: { name: 'John Doe', email: 'john.doe@example.com' },
        user: { _id: '12345' }
      };
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      userService.editProfile.mockResolvedValue(true);

      await editProfileChange(req, res);

      expect(userService.editProfile).toHaveBeenCalledWith(req.body, req.user._id);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
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
        // Authenticated user successfully retrieves another user's profile
        it('should render the other user\'s profile when the user is authenticated', async () => {
          const req = {
            isAuthenticated: jest.fn().mockReturnValue(true),
            params: { id: '123' },
            user: { _id: '456' }
          };
          const res = {
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
          };
          const userService = {
            getUserById: jest.fn().mockResolvedValueOnce({ name: 'John Doe' }).mockResolvedValueOnce({ name: 'Jane Doe' })
          };
          await getOtherUserProfile(req, res);
          expect(userService.getUserById).toHaveBeenCalledWith('123');
          expect(userService.getUserById).toHaveBeenCalledWith('456');
          expect(res.render).toHaveBeenCalledWith('otherprofile', { user: { name: 'John Doe' }, currentuser: { name: 'Jane Doe' } });
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

