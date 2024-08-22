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

        
     // Retrieve all users except the one with the given ID
    it('should retrieve all users except the one with the given ID', async () => {
        const mockUser = { _id: '123', name: 'John Doe' };
        const mockUsers = [
            { _id: '124', name: 'Jane Doe' },
            { _id: '125', name: 'Jim Beam' }
        ];
        User.find = jest.fn().mockResolvedValue(mockUsers);
    
        const result = await getuser(mockUser._id);
    
        expect(User.find).toHaveBeenCalledWith({ _id: { $ne: mockUser._id } });
        expect(result).toEqual(mockUsers);
    });
        // Successfully deletes a user by their ID
        it('should delete the user and their follow relationships when the user ID exists', async () => {
            const userId = 'existingUserId';
            const mockFindByIdAndDelete = jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(true);
            const mockDeleteMany = jest.spyOn(Follow, 'deleteMany').mockResolvedValue(true);
      
            await deleteUserById(userId);
      
            expect(mockFindByIdAndDelete).toHaveBeenCalledWith(userId);
            expect(mockDeleteMany).toHaveBeenCalledWith({ follower: userId });
            expect(mockDeleteMany).toHaveBeenCalledWith({ following: userId });
      
            mockFindByIdAndDelete.mockRestore();
            mockDeleteMany.mockRestore();
          });

  
          // Retrieves followers for a given user ID
    it('should retrieve followers for a given user ID', async () => {
        const mockId = 'user123';
        const mockFollowers = [
          { follower: 'follower1', following: mockId },
          { follower: 'follower2', following: mockId }
        ];
        const mockCount = 2;
  
        jest.spyOn(Follow, 'find').mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockFollowers)
        });
        jest.spyOn(Follow, 'countDocuments').mockResolvedValue(mockCount);
  
        const result = await getmyFollowers(mockId);
  
        expect(result.results).toEqual(mockFollowers);
        expect(result.currentPage).toBe(1);
        expect(result.totalPages).toBe(1);
        expect(result.totalResults).toBe(mockCount);
      });
