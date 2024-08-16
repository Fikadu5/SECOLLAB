const express = require('express');


router.get('/',ensureAuthenticated, getProjects);
router.get('/addproject', ensureAuthenticated,newproject);
router.get("/mycollabration",ensureAuthenticated,getmycollabration)
router.post('/addproject', ensureAuthenticated,createProject);
router.get("/projectcatagories",ensureAuthenticated,getcatagories);
router.get('/searchproject', ensureAuthenticated,searchProjects);




module.exports = router;
