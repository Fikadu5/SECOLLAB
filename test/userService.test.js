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
  // Handles cases where the user ID has no followers
    it('should return empty results when user ID has no followers', async () => {
        const mockId = 'user123';
        const mockFollowers = [];
        const mockCount = 0;

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
        expect(result.totalPages).toBe(0);
        expect(result.totalResults).toBe(mockCount);
      });
          // Retrieves a paginated list of followings for a given user ID
    it('should return paginated list of followings for a valid user ID', async () => {
        const mockId = 'validUserId';
        const mockPage = 1;
        const mockLimit = 10;
        const mockTotalFollowingCount = 15;
        const mockTotalFollowing = [{ following: 'user1' }, { following: 'user2' }];

        jest.spyOn(Follow, 'countDocuments').mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockTotalFollowingCount),
        });
        jest.spyOn(Follow, 'find').mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockTotalFollowing),
        });

        const result = await getMyFollowing(mockId, mockPage, mockLimit);

        expect(result).toEqual({
          results: mockTotalFollowing,
          currentPage: mockPage,
          totalPages: Math.ceil(mockTotalFollowingCount / mockLimit),
          totalResults: mockTotalFollowingCount,
          limit: mockLimit,
        });
      });
          // User ID does not exist in the Follow collection
    it('should return empty results when user ID does not exist', async () => {
        const mockId = 'nonExistentUserId';
        const mockPage = 1;
        const mockLimit = 10;
        const mockTotalFollowingCount = 0;
        const mockTotalFollowing = [];

        jest.spyOn(Follow, 'countDocuments').mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockTotalFollowingCount),
        });
        jest.spyOn(Follow, 'find').mockReturnValue({
          populate: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockTotalFollowing),
        });

        const result = await getMyFollowing(mockId, mockPage, mockLimit);

        expect(result).toEqual({
          results: mockTotalFollowing,
          currentPage: mockPage,
          totalPages: Math.ceil(mockTotalFollowingCount / mockLimit),
          totalResults: mockTotalFollowingCount,
          limit: mockLimit,
        });
      });

