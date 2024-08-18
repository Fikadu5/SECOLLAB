const express = require('express');


router.get('/',ensureAuthenticated, getProjects);
router.get('/addproject', ensureAuthenticated,newproject);
router.get("/mycollabration",ensureAuthenticated,getmycollabration)
router.post('/addproject', ensureAuthenticated,createProject);
router.get("/projectcatagories",ensureAuthenticated,getcatagories);
router.get('/searchproject', ensureAuthenticated,searchProjects);

router.post("/searchproject/:text",ensureAuthenticated,searchResults);
router.get("/projects/:id",ensureAuthenticated,getProjectById);



module.exports = router;
