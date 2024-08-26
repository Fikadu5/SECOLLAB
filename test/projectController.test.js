const httpMocks = require('node-mocks-http');
const projectservice = require('../services/projectservice');
const { acceptinterest , newproject,getMyProjects,
  getProjects,getmycollabration,getProjectById,registerInterestwithid,
  getmyprojectwithid,getFollowingProjects,deleteproject,
} = require('../controllers/projectcontrollers'); // Ensure correct path
const userService = require("../services/userservice")
jest.mock('../services/projectservice');

projectservice.acceptinterest.mockResolvedValue(true);


   
   
    // Successfully deletes a project when a valid project ID is provided
    it('should successfully delete a project when a valid project ID is provided', async () => {
      const req = {
          params: { id: 'validProjectId' },
          flash: jest.fn(),
          user: { _id: 'userId' }
      };
      const res = {
          redirect: jest.fn()
      };
     
      projectservice.deleteproject = jest.fn().mockResolvedValue(true);

      await deleteproject(req, res);

      expect(projectservice.deleteproject).toHaveBeenCalledWith('validProjectId');
      expect(req.flash).toHaveBeenCalledWith('success', 'successfully deleted the project');
      expect(res.redirect).toHaveBeenCalledWith('/projects/myprojects');
  });
      // Handles the case where the project ID does not exist
      it('should handle the case where the project ID does not exist', async () => {
        const req = {
            params: { id: 'nonExistentProjectId' },
            flash: jest.fn(),
            user: { _id: 'userId' }
        };
        const res = {
            redirect: jest.fn()
        };
      
        projectservice.deleteproject = jest.fn().mockResolvedValue(false);

        await deleteproject(req, res);

        expect(projectservice.deleteproject).toHaveBeenCalledWith('nonExistentProjectId');
        expect(req.flash).toHaveBeenCalledWith('error', 'project deletion not successful');
        expect(res.redirect).toHaveBeenCalledWith('/projects/myprojects');
    });
    // Retrieves projects followed by the user
    it('should retrieve projects followed by the user when user has followed projects', async () => {
      const req = {
          user: { _id: 'user123' },
          flash: jest.fn()
      };
      const res = {
          render: jest.fn()
      };
      const mockProjects = [{ id: 'project1' }, { id: 'project2' }];
      
      jest.spyOn(projectservice, 'getfollowingprojects').mockResolvedValue(mockProjects);
      jest.spyOn(userService, 'getUserById').mockReturnValue({ id: 'user123', name: 'John Doe' });
  
      await getFollowingProjects(req, res);
  
      expect(projectservice.getfollowingprojects).toHaveBeenCalledWith('user123');
      expect(userService.getUserById).toHaveBeenCalledWith('user123');
      expect(res.render).toHaveBeenCalledWith('project', {
          projects: mockProjects,
          messages: {
              success: req.flash('success'),
              error: req.flash('error')
          },
          currentuser: { id: 'user123', name: 'John Doe' }
      });
  });
      // User has no followed projects
      it('should handle case when user has no followed projects', async () => {
        const req = {
            user: { _id: 'user123' },
            flash: jest.fn()
        };
        const res = {
            render: jest.fn()
        };
    
        jest.spyOn(projectservice, 'getfollowingprojects').mockResolvedValue([]);
        jest.spyOn(userService, 'getUserById').mockReturnValue({ id: 'user123', name: 'John Doe' });
    
        await getFollowingProjects(req, res);
    
        expect(projectservice.getfollowingprojects).toHaveBeenCalledWith('user123');
        expect(userService.getUserById).toHaveBeenCalledWith('user123');
        expect(res.render).toHaveBeenCalledWith('project', {
            projects: [],
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            },
            currentuser: { id: 'user123', name: 'John Doe' }
        });
    });
    // Project ID does not exist
    it('should handle non-existent project ID', async () => {
      const req = {
          params: { id: 'nonexistent' },
          user: { _id: 'user1' },
          flash: jest.fn().mockReturnValue([])
      };
      const res = {
          render: jest.fn()
      };
      const currentuser = { _id: 'user1', name: 'Test User' };

      jest.spyOn(projectservice, 'getProjectById').mockResolvedValue(null);
      jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);

      await getProjectById(req, res);

      expect(projectservice.getProjectById).toHaveBeenCalledWith('nonexistent');
      expect(userService.getUserById).toHaveBeenCalledWith('user1');
      expect(res.render).toHaveBeenCalledWith('specficproject', {
          project: null,
          messages: {
              success: [],
              error: []
          },
          currentuser
      });
  });
      // Successfully retrieves project by ID
      it('should render project details when project ID exists', async () => {
        const req = {
            params: { id: '123' },
            user: { _id: 'user1' },
            flash: jest.fn().mockReturnValue([])
        };
        const res = {
            render: jest.fn()
        };
        const project = { id: '123', name: 'Test Project' };
        const currentuser = { _id: 'user1', name: 'Test User' };

        jest.spyOn(projectservice, 'getMyProjectbyid').mockResolvedValue(project);
        jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);

        await getmyprojectwithid(req, res);

        expect(projectservice.getMyProjectbyid).toHaveBeenCalledWith('123');
        expect(userService.getUserById).toHaveBeenCalledWith('user1');
        expect(res.render).toHaveBeenCalledWith('interestinmyproject', {
            project,
            messages: {
                success: [],
                error: []
            },
            currentuser
        });
    });
        // Project ID does not exist
        it('should handle non-existent project ID gracefully', async () => {
          const req = {
              params: { id: 'nonexistent' },
              user: { _id: 'user1' },
              flash: jest.fn().mockReturnValue([])
          };
          const res = {
              render: jest.fn()
          };
          const currentuser = { _id: 'user1', name: 'Test User' };
  
          jest.spyOn(projectservice, 'getMyProjectbyid').mockResolvedValue(null);
          jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);
  
          await getmyprojectwithid(req, res);
  
          expect(projectservice.getMyProjectbyid).toHaveBeenCalledWith('nonexistent');
          expect(userService.getUserById).toHaveBeenCalledWith('user1');
          expect(res.render).toHaveBeenCalledWith('interestinmyproject', {
              project: null,
              messages: {
                  success: [],
                  error: []
              },
              currentuser
          });
      });

    // Retrieves project by ID successfully
    it('should return project when ID exists', async () => {
      const req = {
          params: { id: '123' },
          user: { _id: 'user1' },
          flash: jest.fn().mockReturnValue([])
      };
      const res = {
          render: jest.fn()
      };
      const project = { id: '123', name: 'Test Project' };
      const currentuser = { _id: 'user1', name: 'Test User' };

      jest.spyOn(projectservice, 'getProjectById').mockResolvedValue(project);
      jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);

      await getProjectById(req, res);

      expect(projectservice.getProjectById).toHaveBeenCalledWith('123');
      expect(userService.getUserById).toHaveBeenCalledWith('user1');
      expect(res.render).toHaveBeenCalledWith('specficproject', {
          project,
          messages: {
              success: [],
              error: []
          },
          currentuser
      });
  });











    // Successfully retrieves collaborations for the current user
    it('should retrieve collaborations for the current user when collaborations exist', async () => {
      const req = {
        user: { _id: 'user123' },
        flash: jest.fn().mockReturnValue(''),
      };
      const res = {
        render: jest.fn(),
      };
      const projects = [{ id: 'proj1' }, { id: 'proj2' }];
      const currentuser = { _id: 'user123', name: 'John Doe' };

      jest.spyOn(projectservice, 'getcollabration').mockResolvedValue(projects);
      jest.spyOn(userService, 'getUserById').mockResolvedValue(currentuser);

      await getmycollabration(req, res);

      expect(projectservice.getcollabration).toHaveBeenCalledWith('user123');
      expect(userService.getUserById).toHaveBeenCalledWith('user123');
      expect(res.render).toHaveBeenCalledWith('mycollabration', {
        projects,
        messages: {
          success: '',
          error: '',
        },
        currentuser,
      });
    });
    // Renders 'addproject' view with tags and current user
    it('should render "addproject" view with tags and current user when req.user is defined', async () => {
      const req = {
        user: { _id: '123' },
        flash: jest.fn().mockReturnValue(''),
      };
      const res = {
        render: jest.fn(),
      };
      const tags = ['tag1', 'tag2'];
      const currentuser = { _id: '123', name: 'John Doe' };

      jest.spyOn(projectservice, 'gettags').mockResolvedValue(tags);
      jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);

      await newproject(req, res);

      expect(projectservice.gettags).toHaveBeenCalled();
      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.render).toHaveBeenCalledWith('addproject', {
        tags,
        messages: {
          success: '',
          error: ''
        },
        currentuser
      });
    });
it('should return 200 and message "added to the team" when interest is successfully accepted', async () => {
  const req = httpMocks.createRequest({
    params: {
      userid: 'validUserId',
      projectid: 'validProjectId'
    }
  });
  const res = httpMocks.createResponse();
  projectservice.acceptinterest.mockResolvedValue(true);

  await acceptinterest(req, res);

  expect(res.statusCode).toBe(200);
  expect(res._getJSONData()).toEqual({ message: 'added to the team' });
});
      
        // Successfully retrieves and renders user's projects
        it('should retrieve and render users projects when user has projects', async () => {
          const req = {
              user: { _id: 'user123' },
              flash: jest.fn().mockReturnValue(''),
          };
          const res = {
              render: jest.fn(),
          };
          const project = [{ id: 'project1', name: 'Project 1' }];
          const currentuser = { _id: 'user123', name: 'John Doe' };
  
          jest.spyOn(projectservice, 'getMyProject').mockResolvedValue(project);
          jest.spyOn(userService, 'getUserById').mockReturnValue(currentuser);
  
          await getMyProjects(req, res);
  
          expect(projectservice.getMyProject).toHaveBeenCalledWith('user123');
          expect(userService.getUserById).toHaveBeenCalledWith('user123');
          expect(res.render).toHaveBeenCalledWith('myproject', {
              project,
              messages: {
                  success: '',
                  error: ''
              },
              currentuser
          });
      });