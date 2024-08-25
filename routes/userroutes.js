const express = require('express');
const { getUsers, contactUser, getProfile, editProfile, editProfileChange,deleteUser,getsearchresult,
  getOtherUserProfile,renderabout,SendCodeEmail,getcurrentuser,getMyProfile,otherusers,
  getMyFollowers,getMyFollwing,followUser,checkfollow,rendercontact,removefollower,unfollow,explore,
getFollowers,getFollowing,delete_photo,
deleteaccount} = require('../controllers/usercontrollers');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { unFollowUser } = require('../controllers/usercontrollers');
const router = express.Router();




// User Routes

router.get('/', ensureAuthenticated,getUsers);
router.get("/contact",ensureAuthenticated,rendercontact);
router.get("/about",ensureAuthenticated,renderabout)
router.get("/myprofile",ensureAuthenticated,getMyProfile)
router.post("/removefollower/:id",ensureAuthenticated,removefollower)

router.get("/explore",ensureAuthenticated,explore)
router.post("/contact", contactUser);
router.post("/follow/:id", ensureAuthenticated,followUser);
router.post("/unfollowuser/:id",ensureAuthenticated,unfollow)


router.get("/about",renderabout)
router.get("/profile",ensureAuthenticated, getProfile);
router.get("/editprofile",ensureAuthenticated, editProfile);
router.post("/editprofile",ensureAuthenticated, editProfileChange);
router.get("/deleteaccount",ensureAuthenticated,deleteaccount);
router.get("/otherusers",ensureAuthenticated,getUsers)
router.post("/deleteaccount",ensureAuthenticated,deleteUser);
router.get("/otherprofile/:id",ensureAuthenticated, getOtherUserProfile);
router.get("/myfollowers", ensureAuthenticated, getMyFollowers);
router.get("/myfollowing",ensureAuthenticated,getMyFollwing );
router.get("/followers/:id",ensureAuthenticated,getFollowers);
router.get("/following/:id",ensureAuthenticated,getFollowing);
router.get("/searchuser/:text",ensureAuthenticated,getsearchresult);

router.post("/checkfollowing/:id",ensureAuthenticated,checkfollow)

router.get("/forgetpassword",ensureAuthenticated,getcurrentuser);
router.get("/users",ensureAuthenticated,otherusers)
router.post("/forgetpassword",ensureAuthenticated,SendCodeEmail)

router.post("/checkfollow/:id", checkfollow);


router.post("/deleteprofile",ensureAuthenticated,delete_photo)




module.exports = router;
