const express = require('express');
const { getBlogs, getBlogById, createBlog, editBlog, updateBlog,getotherUsersblogs,
   getFollowingBlogs, getMyBlogs,newRoute,deleteBlog,getTopBlogs,getRandomBlogs, getcatagories,
  newtag,tags,getcatblogs, getc,checklike,
  addorremovelike} = require('../controllers/blogcontroller');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const { getsearchresult } = require('../services/userservice');
const { getUserBlogs } = require('../services/blogservice');
const router = express.Router();




// Blog Routes
router.get('/followingblogs',ensureAuthenticated,getFollowingBlogs)
router.get('/',ensureAuthenticated, getBlogs);
router.get("/searchblog/:query",ensureAuthenticated,getsearchresult);
router.get('/rand', ensureAuthenticated,  getRandomBlogs);
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
router.get("/catagories/new",ensureAuthenticated,getc)
router.get("/catagories/:name",ensureAuthenticated,getcatblogs)
router.get("/catagories",ensureAuthenticated,getcatagories);
// router.get("/catagories/new/add",tags)
router.post("/catagories/add",ensureAuthenticated,newtag)

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




router.post("/delete/:id",ensureAuthenticated,deleteBlog)

router.get("/userblogs/:id",ensureAuthenticated,getotherUsersblogs)
router.post("/addorremovelike/:id",ensureAuthenticated,addorremovelike);
router.post("/checklike/:id",ensureAuthenticated,checklike);
module.exports = router;
