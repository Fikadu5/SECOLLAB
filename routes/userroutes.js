const express = require('express');
const { getUsers, contactUser, getProfile, editProfile, editProfileChange, deleteUser, getsearchresult,
  getOtherUserProfile, renderabout, SendCodeEmail, getcurrentuser, getMyProfile, otherusers,
  getMyFollowers, getMyFollwing, followUser, checkfollow, rendercontact, removefollower, unfollow, explore,
  getFollowers, getFollowing, delete_photo,
  deleteaccount } = require('../controllers/usercontrollers');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { unFollowUser } = require('../controllers/usercontrollers');
const router = express.Router();

// User Routes

// Get all users
router.get('/', ensureAuthenticated, getUsers);

// Render the contact page
router.get("/contact", ensureAuthenticated, rendercontact);

// Render the about page
router.get("/about", ensureAuthenticated, renderabout);

// Get the current user's profile
router.get("/myprofile", ensureAuthenticated, getMyProfile);

// Remove a follower
router.post("/removefollower/:id", ensureAuthenticated, removefollower);

// Render the explore page
router.get("/explore", ensureAuthenticated, explore);

// Contact a user
router.post("/contact", contactUser);

// Follow a user
router.post("/follow/:id", ensureAuthenticated, followUser);

// Unfollow a user
router.post("/unfollowuser/:id", ensureAuthenticated, unfollow);

// Render the about page
router.get("/about", renderabout);

// Get a user's profile
router.get("/profile", ensureAuthenticated, getProfile);

// Render the edit profile page
router.get("/editprofile", ensureAuthenticated, editProfile);

// Update the user's profile
router.post("/editprofile", ensureAuthenticated, editProfileChange);

// Render the delete account page
router.get("/deleteaccount", ensureAuthenticated, deleteaccount);

// Get all other users
router.get("/otherusers", ensureAuthenticated, getUsers);

// Delete the user's account
router.post("/deleteaccount", ensureAuthenticated, deleteUser);

// Get another user's profile
router.get("/otherprofile/:id", ensureAuthenticated, getOtherUserProfile);

// Get the current user's followers
router.get("/myfollowers", ensureAuthenticated, getMyFollowers);

// Get the current user's following
router.get("/myfollowing", ensureAuthenticated, getMyFollwing);

// Get the followers of a user
router.get("/followers/:id", ensureAuthenticated, getFollowers);

// Get the following of a user
router.get("/following/:id", ensureAuthenticated, getFollowing);

// Search for a user
router.get("/searchuser/:text", ensureAuthenticated, getsearchresult);

// Check if the current user is following another user
router.post("/checkfollowing/:id", ensureAuthenticated, checkfollow);

// Render the forget password page
router.get("/forgetpassword", ensureAuthenticated, getcurrentuser);

// Get all other users
router.get("/users", ensureAuthenticated, otherusers);

// Send a code to the user's email for password reset
router.post("/forgetpassword", ensureAuthenticated, SendCodeEmail);

// Check if the current user is following another user
router.post("/checkfollow/:id", checkfollow);

// Delete the user's profile picture
router.post("/deleteprofile", ensureAuthenticated, delete_photo);

module.exports = router;