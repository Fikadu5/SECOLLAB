const Project = require('../models/project');
const { deleteproject,getcollabration,getProjectById,
    getUserProjects,
    getProject,
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
	 it('should return project when given a valid ID', async () => {
            const mockProject = {
              _id: new mongoose.Types.ObjectId(),
              owner: {},
              tags: [],
              requests: [],
              collaborators: []
            };

            Project.findById.mockResolvedValue(mockProject);

            const result = await getProjectById(mockProject._id);

            expect(result).toEqual(mockProject);
            expect(Project.findById).toHaveBeenCalledWith(mockProject._id);
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
    it('should return project when ID is valid', async () => {
        const mockProject = { _id: 'validId', name: 'Test Project', collaborators: [], requests: [] };
        jest.spyOn(Project, 'findById').mockResolvedValue(mockProject);

        const result = await getMyProjectbyid('validId');

        expect(result).toEqual(mockProject);
        expect(Project.findById).toHaveBeenCalledWith('validId');
      });


});


