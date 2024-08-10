const express = require('express');
const router = express.Router();


router.get('/', ensureAuthenticated,getUsers);
router.get("/contact",ensureAuthenticated,rendercontact);
router.get("/about",ensureAuthenticated,renderabout)
router.get("/myprofile",ensureAuthenticated,getMyProfile);
router.get("/explore",ensureAuthenticated,explore)
router.post("/contact", contactUser);
router.get("/otherusers",ensureAuthenticated,getUsers)
router.post("/deleteaccount",ensureAuthenticated,deleteUser);
router.get("/otherprofile/:id",ensureAuthenticated, getOtherUserProfile);
router.get("/myfollowers", ensureAuthenticated, getMyFollowers);
router.get("/myfollowing",ensureAuthenticated,getMyFollwing );
router.get("/followers/:id",ensureAuthenticated,getFollowers);
router.get("/following/:id",ensureAuthenticated,getFollowing);
router.get("/searchuser/:text",ensureAuthenticated,getsearchresult);
router.post("/follow/:id", ensureAuthenticated,followUser);
router.post("/unfollowuser/:id",ensureAuthenticated,unfollow)


module.exports = router;
