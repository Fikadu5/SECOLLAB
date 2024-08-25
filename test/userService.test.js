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
     
         


          // Successfully follows a user when no existing follow record is found
    it('should create a new follow record when no existing follow record is found', async () => {
        const follower_id = 'follower123';
        const following_id = 'following123';
    
        jest.spyOn(Follow, 'exists').mockResolvedValue(false);
        const saveMock = jest.spyOn(Follow.prototype, 'save').mockResolvedValue(true);
    
        const result = await followUser(follower_id, following_id);
    
        expect(Follow.exists).toHaveBeenCalledWith({
          follower: follower_id,
          following: following_id,
        });
        expect(saveMock).toHaveBeenCalled();
        expect(result).toBe(true);
      });

          // Successfully deletes a follow relationship between two users
    it('should successfully delete a follow relationship when valid follower and following IDs are provided', async () => {
        const follower = 'user1';
        const following = 'user2';
    
        const mockDeleteOne = jest.spyOn(Follow, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
    
        const result = await unfollow(follower, following);
    
        expect(mockDeleteOne).toHaveBeenCalledWith({ follower, following });
        expect(result).toEqual({ deletedCount: 1 });
    
        mockDeleteOne.mockRestore();
      });

          // Follower or following user ID does not exist
    it('should handle error when follower or following user ID does not exist', async () => {
        const follower = 'nonexistentUser';
        const following = 'user2';
    
        const mockDeleteOne = jest.spyOn(Follow, 'deleteOne').mockRejectedValue(new Error('User not found'));
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
        await unfollow(follower, following);
    
        expect(mockDeleteOne).toHaveBeenCalledWith({ follower, following });
        expect(consoleSpy).toHaveBeenCalledWith("error deleting the data from the database");
    
        mockDeleteOne.mockRestore();
        consoleSpy.mockRestore();
      });
     
          // Handles non-existent follower_id and following_id gracefully
    it('should return false when no follow record exists', async () => {
        const mockFollow = {
          findOne: jest.fn().mockResolvedValue(null)
        };
        jest.mock('../models/user', () => ({ Follow: mockFollow }));
        const { checkfollowing } = require('../services/userservice');
        const result = await checkfollowing('non_existent_follower_id', 'non_existent_following_id');
        expect(result).toBe(false);
      });
          // Successfully find an existing follow relationship
    it('should return the follow relationship when it exists', async () => {
        const follower = 'user1';
        const following = 'user2';
        const mockFollow = { follower, following };
    
        jest.spyOn(Follow, 'findOne').mockResolvedValue(mockFollow);
    
        const result = await follow(follower, following);
    
        expect(result).toEqual(mockFollow);
        expect(Follow.findOne).toHaveBeenCalledWith({ follower, following });
      });
          // Handle the case where the follow relationship does not exist
    it('should return null when the follow relationship does not exist', async () => {
        const follower = 'user1';
        const following = 'user2';
    
        jest.spyOn(Follow, 'findOne').mockResolvedValue(null);
    
        const result = await follow(follower, following);
    
        expect(result).toBeNull();
        expect(Follow.findOne).toHaveBeenCalledWith({ follower, following });
      });