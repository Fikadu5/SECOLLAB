const express = require('express');
const { getProjects, createProject, getProjectById, searchProjects, getmyprojectwithid, 
    getsearchresult,searchResults,getFollowingProjects ,getMyProjects,getmycollabration,deleteproject,newproject  
  ,getcatagories,registerInterestwithid}= require('../controllers/projectcontrollers');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');



router.post('/registerinterest/:id',ensureAuthenticated, registerInterestwithid);

router.get('/',ensureAuthenticated, getProjects);
router.get('/addproject', ensureAuthenticated,newproject);
router.get("/mycollabration",ensureAuthenticated,getmycollabration)
router.post('/addproject', ensureAuthenticated,createProject);
router.get("/projectcatagories",ensureAuthenticated,getcatagories);
router.get('/searchproject', ensureAuthenticated,searchProjects);


router.post("/searchproject/:text",ensureAuthenticated,searchResults);
router.get("/projects/:id",ensureAuthenticated,getProjectById);
router.get("/searchresult/:text",ensureAuthenticated,getsearchresult);

router.get('/myprojects', ensureAuthenticated,getMyProjects);


router.get("/projects",ensureAuthenticated,getProjects);
router.get("/myprojects/:id",ensureAuthenticated,getmyprojectwithid)
router.get("/followingprojects",ensureAuthenticated,getFollowingProjects );
router.post("/delete/:id",ensureAuthenticated,deleteproject)


module.exports = router;

