const express = require('express');
const { getBlogs, getBlogById, createBlog, editBlog, updateBlog, getotherUsersblogs,
   getFollowingBlogs, getMyBlogs, newRoute, deleteBlog, getTopBlogs, getRandomBlogs, getcatagories,
  newtag, tags, getcatblogs, getc, checklike,
  addorremovelike } = require('../controllers/blogcontroller');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { authenticateToken  } = require('../middleware/tokenauthenticationmiddleware');
const { getsearchresult } = require('../services/userservice');
const { getUserBlogs } = require('../services/blogservice');
const router = express.Router();

// Blog Routes

// Route to get the blogs that the user is following
router.get('/followingblogs', ensureAuthenticated, getFollowingBlogs);

// Route to get all blogs
router.get('/', ensureAuthenticated, getBlogs);

// Route to search for blogs
router.get("/searchblog/:query", ensureAuthenticated, getsearchresult);

// Route to get random blogs
router.get('/rand', ensureAuthenticated, getRandomBlogs);

// Route to get the blogs of the current user
router.get("/myblogs", ensureAuthenticated, getMyBlogs);

// Route to get the page for creating a new blog
router.get('/new', ensureAuthenticated, (req, res, next) => {
  console.log("Accessing /blogs/new");
  next();
}, newRoute);

// Route to create a new blog
router.post('/new', ensureAuthenticated, (req, res, next) => {
  console.log("Posting to /blogs/new");
  next();
}, createBlog);

// Route to get the page for creating a new category
router.get("/catagories/new", ensureAuthenticated, getc);

// Route to get blogs by category
router.get("/catagories/:name", ensureAuthenticated, getcatblogs);

// Route to get all categories
router.get("/catagories", ensureAuthenticated, getcatagories);

// Route to create a new category
router.post("/catagories/add", ensureAuthenticated, newtag);

// Route to get the top blogs
router.get('/top', ensureAuthenticated, (req, res, next) => {
  console.log("Accessing /blogs/top");
  next();
}, getTopBlogs);

// Route to get a specific blog by ID
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  console.log(`Accessing /blogs/${req.params.id}`);
  next();
}, getBlogById);

// Route to get the page for editing a blog
router.get('/edit/:id', ensureAuthenticated, (req, res, next) => {
  console.log(`Accessing /blogs/edit/${req.params.id}`);
  next();
}, editBlog);

// Route to update a blog
router.post('/edit/:id', ensureAuthenticated, (req, res, next) => {
  console.log(`Posting to /blogs/edit/${req.params.id}`);
  next();
}, updateBlog);

// Route to delete a blog
router.post("/delete/:id", ensureAuthenticated, deleteBlog);

// Route to get the blogs of another user
router.get("/userblogs/:id", ensureAuthenticated, getotherUsersblogs);

// Route to add or remove a like on a blog
router.post("/addorremovelike/:id", ensureAuthenticated, addorremovelike);

// Route to check if the current user has liked a blog
router.post("/checklike/:id", ensureAuthenticated, checklike);

module.exports = router;