const userService = require('../services/userservice');
const httpMocks = require('node-mocks-http');
const projectservice = require('../services/projectservice')
const {acceptinterest, gettags,getUserById} = require('../controllers/usercontrollers');

jest.mock('../services/userService');
jest.mock('../services/projectservice');

    // Successfully retrieves tags from projectservice
    it('should render addproject with tags when projectservice.gettags() returns tags', async () => {
        const req = {
          user: { _id: '123' },
          flash: jest.fn().mockReturnValue(''),
        };
        const res = {
          render: jest.fn(),
        };
        const tags = ['tag1', 'tag2'];
        jest.spyOn(projectservice, 'gettags').mockResolvedValue(tags);
        jest.spyOn(userService, 'getUserById').mockReturnValue({ id: '123', name: 'Test User' });

        await newproject(req, res);

        expect(projectservice.gettags).toHaveBeenCalled();
        expect(userService.getUserById).toHaveBeenCalledWith('123');
        expect(res.render).toHaveBeenCalledWith('addproject', {
          tags,
          messages: {
            success: '',
            error: ''
          },
          currentuser: { id: '123', name: 'Test User' }
        });
      });

    // projectservice.gettags() returns an empty array
    it('should render addproject with empty tags when projectservice.gettags() returns an empty array', async () => {
        const req = {
          user: { _id: '123' },
          flash: jest.fn().mockReturnValue(''),
        };
        const res = {
          render: jest.fn(),
        };
        const tags = [];
        jest.spyOn(projectservice, 'gettags').mockResolvedValue(tags);
        jest.spyOn(userService, 'getUserById').mockReturnValue({ id: '123', name: 'Test User' });

        await newproject(req, res);

        expect(projectservice.gettags).toHaveBeenCalled();
        expect(userService.getUserById).toHaveBeenCalledWith('123');
        expect(res.render).toHaveBeenCalledWith('addproject', {
          tags,
          messages: {
            success: '',
            error: ''
          },
          currentuser: { id: '123', name: 'Test User' }
        });
      });

