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

