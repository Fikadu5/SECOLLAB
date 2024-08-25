const Blog = require('../models/blog');
const User = require("../models/user");
const blogService = require('../services/blogservice');

const multer = require('multer');
const path = require('path');

const flash = require('connect-flash');
const userService = require('../services/userservice');





exports.getsearchresult = async(req,res) =>
{
  try{
  const query = req.params.query;
  const blogs = await blogService.getsearchresult(query);
  const currentuser =  await userService.getUserById(req.user._id);
  if(blogs)
  {
    res.render("searchblogs",{ blogs ,
       messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, currentuser})

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
  const currentuser =  userService.getUserById(req.user._id);
  res.render("allblog",{blogs,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, 
      currentuser
    })
}
exports.getBlogs = async (req, res) => {

  console.log("In getBlogs controller");
  try {
    const blogs = await blogService.getBlogs(req.user._id);
    const currentUser = await userService.getUserById(req.user._id)
    const currentuser =  userService.getUserById(req.user._id);
    res.render('allblog', { blogs, currentUser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, 
      currentuser});
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
      const currentuser =  userService.getUserById(req.user._id);
      if(deleteblog)
      {
        req.flash('success', 'Successfully deleted the blog');
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
    const currentuser =  userService.getUserById(req.user._id);
    
    const blogs = await blogService.getMyBlogs(req.user._id, page, limit);
    
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    res.render("myblogs", { blogs, pagination,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, currentuser});
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
    const blogs = await blogService.getTopBlogs(page, limit,req.user._id)
    const currentuser =  userService.getUserById(req.user._id);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    res.render('allblog', { blogs, pagination,currentuser, messages: {
      success: req.flash('success'),
      error: req.flash('error')
    }  });
  } catch (error) {
    console.log("Error rendering top blogs,", error);
    res.status(500).send("Error occurred while rendering the blogs view");
  }
};

exports.checklike = async(req,res) =>
{
  const userid = req.user._id;
  const id = req.params.id;
  const blog = await blogService.checklike(id,userid);
  if(blog == 200)
  {
    res.status(200).json({"message":"already liked"})
  }
  else if (blog == 201)
  {
    res.status(201).json({"message":"not liked"})
  }
}

exports.addorremovelike = async(req,res) =>
{
  try{
    console.log("in the controller of the like")

    const blogid = req.params.id;
    const userid = req.user._id;
   
  const liked = await blogService.addorremovelike(blogid,userid);
  if(liked == 201)
  {

    
    res.status(201).json({"message":"like added"})
  }
  else if(liked == 200){
    res.status(200).json({"message":"like removed"})
  }
  else{
    res.status(500).json({"message":"Blog not found"})
  }
}
catch(err)
{
  console.log(err);
  res.status(500).json({"message":"An error has occured"})
}



}



exports.newRoute = async (req, res) => {
  console.log("In newRoute controller");
  const tags = await blogService.gettags();
  const currentuser =  userService.getUserById(req.user._id);
  res.render('newblog',{tags,
    messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
   });
};
exports.getBlogById = async (req, res) => {
  try {
    console.log("In getBlogById controller");

    const id = req.params.id;
    if (!id) {
      return res.status(400).send('Blog ID is required');
    }
    
    const blog = await blogService.getBlogById(id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    const user = req.user ? await userService.getUserById(req.user._id) : null;
    res.render('specficblog', { 
      blog, 
      user,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      currentuser: user
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
};


const storage = multer.diskStorage({
  destination: 'public/uploads/blog',
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
  try {
    console.log("In createBlog controller");

    // Handle file upload and blog creation
    upload(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).send('File upload error');
      }

      const checkedOptions = req.body.myCheckboxes || [];
      const { title, content, subtitle } = req.body;
      const imageFilename = req.file ? req.file.filename : false; // Check if file exists

      try {
        // Create blog with or without image
        await blogService.createBlog(
          title,
          subtitle,
          content,
          req.user._id,
          checkedOptions,
          imageFilename
        );

        // Redirect after successful creation
        res.redirect('/blogs/myblogs');
      } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (error) {
    console.error('Error in createBlog controller:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.editBlog = async (req, res) => {
  console.log("In editBlog controller");
    
    const id = req.params.id;
    try {
      const blog = await blogService.getBlogById(id);
      const currentuser =  userService.getUserById(req.user._id);
      if (blog.owner.equals(req.user._id)) {
        res.render('editblog', { blog,
          messages: {
          success: req.flash('success'),
          error: req.flash('error')
      },currentuser
          });
      } else {
        res.status(403).send('Unauthorized');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
    }
  }
 

exports.updateBlog = async (req, res) => {
  try{
  console.log("In updateBlog controller");

    const id = req.params.id;
    const { title, subtitle, content } = req.body;
    try {
      const blog = await blogService.getBlogById(id);
      if (blog.owner.equals(req.user._id)) {
        await blogService.updateBlogById(id, title, subtitle, content);
        res.redirect('/blogs/myblogs');
      } else {
        res.status(403).send('Unauthorized');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  catch(err)
  {
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
 
};
exports.getotherUsersblogs = async(req,res) =>
{
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const blogs = await blogService.getUserBlogs(req.params.id,page,limit);
    const currentuser = await  userService.getUserById(req.user._id);

    const totalBlogsCount = await Blog.countDocuments({ owner: { $ne: req.params.id } }).exec();
    
   

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };
    res.render('allblog', { pagination,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
     });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }

}
exports.getUserBlogs = async (req, res) => {
  console.log("In getUserBlogs controller");
  const currentuser =  userService.getUserById(req.user._id);

    try {
      const blogs = await blogService.getUserBlogs(req.user._id);
      res.render('myblogs', { blogs,
       messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
       });
    } catch (error) {
      console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
    }
 
};

exports.getRandomBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; 
    const totalBlogsCount = await Blog.countDocuments({ owner: { $ne: userId } }).exec();
    const currentuser = await userService.getUserById(req.user._id); 

    const blogs = await blogService.getRandomBlogs(userId, page, limit);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    res.render('allblog', { blogs, pagination,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, currentuser
    });
  } catch (err) {
    console.error('Error fetching blog:', err); // Log the correct error
    res.status(500).send('Internal Server Error');
  }
};



exports.getcatagories = async(req,res) =>
{
  const tags = await blogService.gettags();
  const currentuser =  userService.getUserById(req.user._id);
  res.render("Blogcatagories",{ tags,currentuser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, } )
}


exports.getc= async(req,res) =>
{
  console.log("in the controller function")
  res.render("newtag")
}
exports.newtag = async(req,res) =>
{
  try{
  console.log("in the new catagories")

  const name = blogService.newtag(req.body.name,req.body.slug);
  res.redirect("/blogs/catagories")
  }
  catch(err)
  {
    res.status(500).send('Error occurred');
  }
}



exports.getcatblogs = async(req,res) =>
{
  const blogs = await blogService.getcatblogs(req.params.name);
  const currentuser =  userService.getUserById(req.user._id);
  res.render("allblog",{
    blogs,
    messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
})
  }

