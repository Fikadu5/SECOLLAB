const express = require('express');
const router = express.Router();


router.get('/', ensureAuthenticated,getUsers);
router.get("/contact",ensureAuthenticated,rendercontact);
router.get("/about",ensureAuthenticated,renderabout)
router.get("/myprofile",ensureAuthenticated,getMyProfile);
router.get("/explore",ensureAuthenticated,explore)
router.post("/contact", contactUser);




module.exports = router;
