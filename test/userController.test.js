const userService = require('../services/userservice');
const { rendercontact,getOtherUserProfile,removefollower,getMyFollwing,getMyFollowers,deleteUser,followUser,checkfollow,unfollow } = require('../controllers/usercontrollers');
const httpMocks = require('node-mocks-http');
    // Successfully updates user profile with valid details
    const { editProfileChange } = require('../controllers/usercontrollers');
   
    jest.mock('../services/userService');


