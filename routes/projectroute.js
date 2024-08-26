const express = require('express');
const { getProjects, createProject, getProjectById, searchProjects, getmyprojectwithid, getUserProjects,
    getsearchresult, searchResults, getFollowingProjects, getMyProjects, getmycollabration, deleteproject, newproject,
    getcatagories, registerInterestwithid, acceptinterest, getcatprojects
} = require('../controllers/projectcontrollers');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Get all projects for the current user
router.get("/userproject/:id", ensureAuthenticated, getUserProjects);

// Register interest in a project
router.post('/registerinterest/:id', ensureAuthenticated, registerInterestwithid);

// Get all project categories
router.get('/', ensureAuthenticated, getcatagories);

// Render the "add project" page
router.get('/addproject', ensureAuthenticated, newproject);

// Get all the user's collaborations
router.get("/mycollabration", ensureAuthenticated, getmycollabration);

// Create a new project
router.post('/addproject', ensureAuthenticated, createProject);

// Get all project categories
router.get("/projectcatagories", ensureAuthenticated, getcatagories);

// Accept an interest in a project
router.post("/acceptinterest/:projectid/:userid", ensureAuthenticated, acceptinterest);

// Register interest in a project
router.post("/projects/registerinterest/:id", ensureAuthenticated, registerInterestwithid);

// Search for projects
router.post("/searchproject/:text", ensureAuthenticated, searchResults);

// Get a project by its ID
router.get("/projects/:id", ensureAuthenticated, getProjectById);

// Get search results
router.get("/searchresult/:text", ensureAuthenticated, getsearchresult);

// Get all the user's projects
router.get('/myprojects', ensureAuthenticated, getMyProjects);

// Get all projects
router.get("/projects", ensureAuthenticated, getProjects);

// Get a specific user's project
router.get("/myprojects/:id", ensureAuthenticated, getmyprojectwithid);

// Get all the projects the user is following
router.get("/followingprojects", ensureAuthenticated, getFollowingProjects);

// Delete a project
router.post("/delete/:id", ensureAuthenticated, deleteproject);

// Render the search projects page
router.get('/searchproject', ensureAuthenticated, searchProjects);

// Get projects by category
router.get("/:name", ensureAuthenticated, getcatprojects);

module.exports = router;