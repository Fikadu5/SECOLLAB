const Project = require('../models/project');
const ProjectTag = require('../models/Projecttag')
const { deleteproject,getcollabration,getProjectById,
    getUserProjects,getMyProject,
    getProject,getProjects,get_catblogs,
    registerInterest,gettags,searchProjects,
    acceptinterest,createProject,
    getMyProjectbyid } = require('../services/projectservice');
const mongoose = require('mongoose')


    // Handle invalid or non-existent user ID
    it('should handle invalid or non-existent user ID', async () => {
      const mockId = 'invalidUserId';
  
      jest.spyOn(Project, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(new Error('User not found')),
      });
  
      console.log = jest.fn();
  
      await getProjects(mockId);
  
      expect(Project.find).toHaveBeenCalledWith({ owner: { $ne: mockId } });
      expect(console.log).toHaveBeenCalledWith(new Error('User not found'));
    });
    // Fetch projects successfully when valid ID is provided
    it('should fetch projects successfully when valid ID is provided', async () => {
      const mockId = 'validUserId';
      const mockProjects = [{ name: 'Project1' }, { name: 'Project2' }];
  
      jest.spyOn(Project, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProjects),
      });
  
      const result = await getProjects(mockId);
  
      expect(Project.find).toHaveBeenCalledWith({ owner: { $ne: mockId } });
      expect(result).toEqual(mockProjects);
    });
    // Handles missing project details gracefully
    it('should throw an error when project details are missing', async () => {
      const projectDetails = {
        name: '',
        description: '',
        date: null,
        lookingfor: '',
        requirment: ''
      };
      const user_id = 'user123';
      const checkedOptions = [];

      await expect(createProject(projectDetails, user_id, checkedOptions)).rejects.toThrow('Error creating project');
    });
    // Successfully creates a project with valid details
    it('should create a project successfully when provided with valid details', async () => {
      const projectDetails = {
        name: 'New Project',
        description: 'Project Description',
        date: new Date(),
        lookingfor: 'Developers',
        requirment: 'Experience in Node.js'
      };
      const user_id = 'user123';
      const checkedOptions = ['tag1', 'tag2'];

      const projectMock = {
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(Project.prototype, 'save').mockImplementation(projectMock.save);

      await createProject(projectDetails, user_id, checkedOptions);

      expect(projectMock.save).toHaveBeenCalled();
    });
    // searchProjects handles special characters in the query
    it('should handle special characters in the query', async () => {
      const mockProjects = [{ name: 'SpecialProject1' }];
      const query = '!@#$%^&*()';
  
      jest.spyOn(Project, 'find').mockResolvedValue(mockProjects);
  
      const result = await searchProjects(query);
  
      expect(Project.find).toHaveBeenCalledWith({ $text: { $search: query } });
      expect(result).toEqual(mockProjects);
    });
    // searchProjects returns projects matching the query
    it('should return projects matching the query', async () => {
      const mockProjects = [{ name: 'Project1' }, { name: 'Project2' }];
      const query = 'Project';
  
      jest.spyOn(Project, 'find').mockResolvedValue(mockProjects);
  
      const result = await searchProjects(query);
  
      expect(Project.find).toHaveBeenCalledWith({ $text: { $search: query } });
      expect(result).toEqual(mockProjects);
    });
describe('deleteproject', () => {
      // Successfully deletes a project by ID
      it('should delete a project when given a valid ID', async () => {
        const mockId = 'validProjectId';
        const mockResult = { deletedCount: 1 };
    
        jest.spyOn(Project, 'deleteOne').mockResolvedValue(mockResult);
    
        const result = await deleteproject(mockId);
    
        expect(Project.deleteOne).toHaveBeenCalledWith({ _id: mockId });
        expect(result).toEqual(mockResult);
      });
          // Project ID does not exist in the database
    it('should return zero deleted count when project ID does not exist', async () => {
      const mockId = 'nonExistentProjectId';
      const mockResult = { deletedCount: 0 };
  
      jest.spyOn(Project, 'deleteOne').mockResolvedValue(mockResult);
  
      const result = await deleteproject(mockId);
  
      expect(Project.deleteOne).toHaveBeenCalledWith({ _id: mockId });
      expect(result).toEqual(mockResult);
    });
        // Fetch projects with a valid tag name and owner ID
          // Retrieves projects where the user is a collaborator
     // Retrieve all project tags successfully
     it('should return all project tags when the database query is successful', async () => {
      const mockTags = [{ name: 'tag1' }, { name: 'tag2' }];
      jest.spyOn(ProjectTag, 'find').mockResolvedValue(mockTags);

      const result = await gettags();

      expect(result).toEqual(mockTags);
      expect(ProjectTag.find).toHaveBeenCalled();
    });
    // Handle database query failure
    it('should throw an error when the database query fails', async () => {
      const mockError = new Error('Database query failed');
      jest.spyOn(ProjectTag, 'find').mockRejectedValue(mockError);

      await expect(gettags()).rejects.toThrow('Database query failed');
      expect(ProjectTag.find).toHaveBeenCalled();
    });


})