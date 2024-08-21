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
