const express = require('express');
const { getBlogs, getBlogById, createBlog, editBlog, updateBlog,getotherUsersblogs,
   getFollowingBlogs, getMyBlogs,newRoute,deleteBlog,getTopBlogs,getRandomBlogs } = require('../controllers/blogcontroller');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { authenticateToken  } = require('../middleware/tokenauthenticationmiddleware');
const { getsearchresult } = require('../services/userservice');
const { getUserBlogs } = require('../services/blogservice');
const router = express.Router();




// Blog Routes
router.get('/',ensureAuthenticated, getBlogs);
router.get("/searchblog/:id",ensureAuthenticated,getsearchresult)
router.get('/rand', ensureAuthenticated,  getRandomBlogs
);
// router.post("/addorremovelike/:id",authenticateToken ,addorremovelike);
router.get("/myblogs",ensureAuthenticated,getMyBlogs);
router.get('/new', ensureAuthenticated, (req, res, next) => {
  console.log("Accessing /blogs/new");
  next();
}, newRoute);

router.post('/new', ensureAuthenticated, (req, res, next) => {
  console.log("Posting to /blogs/new");
  next();
}, createBlog);

router.get('/top',ensureAuthenticated, (req, res, next) => {
  console.log("Accessing /blogs/top");
  next();
}, getTopBlogs);

router.get('/:id', ensureAuthenticated, (req, res, next) => {
  console.log(`Accessing /blogs/${req.params.id}`);
  next();
}, getBlogById);

router.get('/edit/:id', ensureAuthenticated, (req, res, next) => {
  console.log(`Accessing /blogs/edit/${req.params.id}`);
  next();
}, editBlog);

router.post('/edit/:id', ensureAuthenticated, (req, res, next) => {
  console.log(`Posting to /blogs/edit/${req.params.id}`);
  next();
}, updateBlog);


router.get('/followingblogs',ensureAuthenticated,getFollowingBlogs)

router.post("/delete/:id",ensureAuthenticated,deleteBlog)

router.get("/userblogs/:id",ensureAuthenticated,getotherUsersblogs)


module.exports = router;
