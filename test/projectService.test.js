const Project = require('../models/project');
const { deleteproject,getcollabration,getProjectById,
    getUserProjects,getMyProject,
    getProject,getProjects,
    registerInterest,
    acceptinterest,
    getMyProjectbyid } = require('../services/projectservice');
const mongoose = require('mongoose')

describe('deleteproject', () => {
  it('should delete the project when given a valid ID', async () => {
    const mockId = 'validProjectId';
    const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    // Replace Project.deleteOne with the mock implementation
    Project.deleteOne = mockDeleteOne;

    // Call the deleteproject function
    const result = await deleteproject(mockId);

    // Check if the mock was called with the correct arguments
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: mockId });
    expect(result).toEqual({ deletedCount: 1 });
  });
  it('should return projects where the collaborator ID is in the collaborators array', async () => {
    const collaboratorId = 'collabId';
    const projects = [
      { _id: '1', collaborators: ['collabId', 'otherId'] },
      { _id: '2', collaborators: ['anotherId'] },
      { _id: '3', collaborators: ['collabId'] }
    ];

    // Mock Project.find to return the predefined projects
    const mockFind = jest.fn().mockResolvedValue(projects);
    Project.find = mockFind;

    // Call the function being tested
    const result = await getcollabration(collaboratorId);

    // Expected result
    const expectedProjects = [
      { _id: '1', collaborators: ['collabId', 'otherId'] },
      { _id: '3', collaborators: ['collabId'] }
    ];

    // Assert that the mock was called and the result is as expected
    expect(mockFind).toHaveBeenCalled();
    expect(result).toEqual(expectedProjects);
  });

  it('should return an empty array if no projects contain the collaborator ID', async () => {
    const collaboratorId = 'nonExistentId';
    const projects = [
      { _id: '1', collaborators: ['anotherId'] },
      { _id: '2', collaborators: ['yetAnotherId'] }
    ];

    // Mock Project.find to return the predefined projects
    const mockFind = jest.fn().mockResolvedValue(projects);
    Project.find = mockFind;

    // Call the function being tested
    const result = await getcollabration(collaboratorId);

    // Expected result
    const expectedProjects = [];

    // Assert that the mock was called and the result is as expected
    expect(mockFind).toHaveBeenCalled();
    expect(result).toEqual(expectedProjects);
  });

  it('should handle errors from Project.find gracefully', async () => {
    const collaboratorId = 'anyId';
    
    // Mock Project.find to throw an error
    const mockFind = jest.fn().mockRejectedValue(new Error('Database Error'));
    Project.find = mockFind;

    // Call the function being tested
    const result = await getcollabration(collaboratorId);

    // Assert that the mock was called and no projects were returned
    expect(mockFind).toHaveBeenCalled();
    expect(result).toBeUndefined(); // or handle errors accordingly if you have error handling
  });
  
 
      // Successfully registers interest when project exists and user is not already registered
      it('should register interest successfully when project exists and user is not already registered', async () => {
        const projectId = 'projectId';
        const userId = 'userId';
    
        const project = {
          _id: projectId,
          requests: [],
          collaborators: [],
          save: jest.fn().mockResolvedValue(true)
        };
    
        jest.spyOn(Project, 'findById').mockResolvedValue(project);
    
        const result = await registerInterest(projectId, userId);
    
        expect(Project.findById).toHaveBeenCalledWith(projectId);
        expect(project.requests).toContain(userId);
        expect(project.save).toHaveBeenCalled();
        expect(result).toBe(true);
      });
          // Returns false when project does not exist
    it('should return false when project does not exist', async () => {
        const projectId = 'validProjectId';
        const userId = 'validUserId';
        Project.findById = jest.fn().mockResolvedValue(null);

        const result = await registerInterest(projectId, userId);

        expect(result).toBe(false);
    });
        // Returns false when user is already a collaborator
        it('should return false when user is already a collaborator', async () => {
            const projectId = 'validProjectId';
            const userId = 'validUserId';
            const mockProject = {
                requests: [],
                collaborators: [userId],
                save: jest.fn().mockResolvedValue(true)
            };
            Project.findById = jest.fn().mockResolvedValue(mockProject);
    
            const result = await registerInterest(projectId, userId);
    
            expect(result).toBe(false);
        });
       
          it('should return projects when given a valid user ID', async () => {
            const mockProjects = [{ name: 'Project1' }, { name: 'Project2' }];
            Project.find.mockResolvedValue(mockProjects);
        
            const userId = 'validUserId';
            const result = await getUserProjects(userId);
        
            expect(Project.find).toHaveBeenCalledWith({ user_id: userId });
            expect(result).toEqual(mockProjects);
          });
       // Retrieve project by valid ID
      
    
       it('should return projects when given a valid user ID', async () => {
        const mockProjects = [{ name: 'Project1' }, { name: 'Project2' }];
        Project.find = jest.fn().mockResolvedValue(mockProjects);
    
        const userId = 'validUserId';
        const result = await getUserProjects(userId);
    
        expect(Project.find).toHaveBeenCalledWith({ user_id: userId });
        expect(result).toEqual(mockProjects);
      });
          // handle invalid user ID format
   
    it('should throw an error when given an invalid user ID format', async () => {
      const invalidUserId = null;
  
      await expect(getUserProjects(invalidUserId)).rejects.toThrow('Error fetching user projects');
    });
        // return an empty array if the user has no projects
        it('should return an empty array when user has no projects', async () => {
          const userId = 'user123';
          const expectedProjects = [];
  
          jest.spyOn(Project, 'find').mockResolvedValue(expectedProjects);
  
          const result = await getUserProjects(userId);
  
          expect(result).toEqual(expectedProjects);
      });
      it('should handle multiple projects for a single user', async () => {
        const userId = 'user456';
        const userProjects = [{ name: 'Project A' }, { name: 'Project B' }];

        jest.spyOn(Project, 'find').mockResolvedValue(userProjects);

        const result = await getUserProjects(userId);

        expect(result).toEqual(userProjects);
    });
        // Fetch projects successfully when valid owner ID is provided
        it('should return projects when valid owner ID is provided', async () => {
          const mockProjects = [{ name: 'Project1' }, { name: 'Project2' }];
          const mockId = 'validOwnerId';
      
          jest.spyOn(Project, 'find').mockResolvedValue(mockProjects);
      
          const result = await getMyProject(mockId);
      
          expect(Project.find).toHaveBeenCalledWith({ owner: mockId });
          expect(result).toEqual(mockProjects);
        });
            // Handle scenario when no projects exist for the given owner ID
    it('should handle no projects found for given owner ID', async () => {
      const mockId = 'ownerWithNoProjects';
  
      jest.spyOn(Project, 'find').mockResolvedValue(null);
  
      const result = await getMyProject(mockId);
  
      expect(Project.find).toHaveBeenCalledWith({ owner: mockId });
      expect(result).toBeUndefined();
    });
});

