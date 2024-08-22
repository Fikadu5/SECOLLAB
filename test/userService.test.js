const{User, Follow}= require('../models/user');
const {follow,getmyFollowers,getMyFollowing,
     getUsers,getuser, getUserById,deleteUserById,followUser,unfollow,
      currentuser} = require("../services/userservice")
const mongoose = require('mongoose');

jest.mock('../models/user');
    // Retrieve all users except the one with the given ID
    it('should retrieve all users except the one with the given ID', async () => {
        const mockId = '12345';
        const mockUsers = [{ _id: '67890' }, { _id: '54321' }];
        jest.spyOn(User, 'find').mockResolvedValue(mockUsers);
  
        const result = await getUsers(mockId);
  
        expect(User.find).toHaveBeenCalledWith({ _id: { $ne: mockId } });
        expect(result).toEqual(mockUsers);
      });
      it('should return user when valid ID is provided', async () => {
        const userId = new mongoose.Types.ObjectId();
        const mockUser = { _id: userId, name: 'John Doe' };
  
        User.findById.mockResolvedValue(mockUser);
  
        const result = await getUserById(userId);
  
        expect(result).toEqual(mockUser);
        expect(User.findById).toHaveBeenCalledWith(userId);
      });

          // Returns the user ID when a valid user is present in the request
    it('should return the user ID when a valid user is present in the request', async () => {
        const req = { user: { _id: '12345' } };
        const res = {};
        const id = await currentuser(req, res);
        expect(id).toBe('12345');
      });

        

