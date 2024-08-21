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

