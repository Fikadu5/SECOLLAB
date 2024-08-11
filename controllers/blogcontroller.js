const blog = require('../models/blog');
const User = require("../models/user");
const blogService = require('../services/blogservice');
const userService = require('../services/userservice');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
exports.getsearchresult = async(req,res) =>
{
  try{
  const query = req.params.text;
  const blogs = blogService.getsearchresult(query);
  if(blogs)
  {
    res.render("searchblogs",{blogs})

  }
  else{
    console.log("error with blogs")
  }
}
catch(err)
{
  console.log(err);
}
}

exports.getFollowingBlogs = async(req,res) =>
{
  const blogs = await blogService.getFollowingBlogs(req.user._id);
  res.render("allblog",{blogs})
}
exports.getBlogs = async (req, res) => {

  console.log("In getBlogs controller");
  try {
    const blogs = await blogService.getBlogs(req.user._id);
    const currentUser = await userService.getUserById(req.user._id)
    res.render('allblog', { blogs, currentUser });
  } catch (err) {
    console.error("Error rendering 'blogs' view:", err);
    res.status(500).send("Error occurred while rendering the blogs view.");
  }
};
exports.deleteBlog = async(req,res) => {
    try{
      const id = req.params.id;
      const userid = req.user._id;
      const deleteblog = await blogService.deleteBlog(id,userid);
      if(deleteblog)
      {
        console.log("successfully deleted the blog");
        res.redirect("/blogs/myblogs")
      }
      else{
        console.log("deletion was not sucessfull");
        
      }

    }
    catch(err)
    {
      console.log(`internal server error ${err}`)
    }

}
exports.getMyBlogs = async (req, res) => {
  console.log("in my blogs controller");
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default limit to 10 if not provided
    const totalBlogsCount = await Blog.countDocuments({ owner: req.user._id }).exec();
    
    const blogs = await blogService.getMyBlogs(req.user._id, page, limit);
    
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    res.render("myblogs", { blogs, pagination });
  } catch (e) {
    console.log(`error: ${e}`);
    res.status(500).send("Error occurred while fetching your blogs");
  }
};
exports.getTopBlogs = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5; // Default limit to 5 if not provided
    const totalBlogsCount = await Blog.countDocuments().exec();
    const blogs = await blogService.getTopBlogs(page, limit);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    res.render('allblog', { blogs, pagination });
  } catch (err) {
    console.log("Error rendering top blogs,", err);
    res.status(500).send("Error occurred while rendering the blogs view");
  }
};



exports.addorremovelike = (req,res) =>
{
  try{
    console.log("in the controller of the like")

  const blogid = req.params.id;
  const userid = req.user._id;
  const liked = blogService.addorremovelike(blogid,userid);
  if(liked)
  {

    
    res.status(200).json({"message":"like added"})
  }
  else{
    res.status(201).json({"message":"like removed"})
  }
}
catch(err)
{
  console.log(err);
  res.status(500).json({"message":"An error has occured"})
}



}



exports.newRoute = (req, res) => {
  console.log("In newRoute controller");
  res.render('newblog');
};

exports.getBlogById = async (req, res) => {
  console.log("In getBlogById controller");

    const id = req.params.id;
    try {
      const blog = await blogService.getBlogById(id);
      const user = await userService.getUserById(blog.user_id);
      res.render('specficblog', { blog, user });
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).send('Internal Server Error');
    }
 
};



const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb){
      checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
}
exports.createBlog = async (req, res) => {

  console.log("In createBlog controller");
  upload (req, res, (err) => {
    if(err){
      return res.status(400).send(err);
    }
    
    const { title, content, subtitle } = req.body;
    try {
      blogService.createBlog(title, subtitle, content, req.user._id, req.file.filename);
      res.redirect('/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).send('Internal Server Error');
    }

    
  });
    
};

exports.editBlog = async (req, res) => {
  console.log("In editBlog controller");
  if (req.isAuthenticated()) {
    const id = req.params.id;
    try {
      const blog = await blogService.getBlogById(id);
      if (blog.owner.equals(req.user._id)) {
        res.render('editblog', { blog });
      } else {
        res.status(403).send('Unauthorized');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
};

exports.updateBlog = async (req, res) => {
  console.log("In updateBlog controller");
  if (req.isAuthenticated()) {
    const id = req.params.id;
    const { title, subtitle, content } = req.body;
    try {
      const blog = await blogService.getBlogById(id);
      if (blog.user_id.equals(req.user._id)) {
        await blogService.updateBlogById(id, title, subtitle, content);
        res.redirect('/myblogs');
      } else {
        res.status(403).send('Unauthorized');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
};
exports.getotherUsersblogs = async(req,res) =>
{
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const blogs = await blogService.getUserBlogs(req.params.id,page,limit);

    const totalBlogsCount = await Blog.countDocuments({ owner: { $ne: req.params.id } }).exec();
    
   

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };
    res.render('allblog', { pagination });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).send('Internal Server Error');
  }

}
exports.getUserBlogs = async (req, res) => {
  console.log("In getUserBlogs controller");
  if (req.isAuthenticated()) {
    try {
      const blogs = await blogService.getUserBlogs(req.user._id);
      res.render('myblogs', { blogs });
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
};


exports.getRandomBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 3; // Default limit to 3 if not provided
    const totalBlogsCount = await Blog.countDocuments({ owner: { $ne: userId } }).exec();
    
    const blogs = await blogService.getRandomBlogs(userId, page, limit);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    res.render('allblog', { blogs, pagination });
  } catch (err) {
    console.log("Error rendering random blogs,", err);
    res.status(500).send("Error occurred while rendering the blogs view");
  }
};

