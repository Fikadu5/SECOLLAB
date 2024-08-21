const userService = require('../services/userservice');
const httpMocks = require('node-mocks-http');
const projectservice = require('../services/projectservice')
const {acceptinterest, gettags,getUserById} = require('../controllers/usercontrollers');

jest.mock('../services/userService');
jest.mock('../services/projectservice');
