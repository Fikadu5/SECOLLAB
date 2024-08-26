const Blog = require('../models/blog');
const User = require("../models/user");
const blogService = require('../services/blogservice');

const multer = require('multer');
const path = require('path');
const xss = require('xss');

const flash = require('connect-flash');
const userService = require('../services/userservice');



// Controller function to handle search result
exports.getSearchResult = async (req, res) => {
  try {
    console.log("In the search result controller");
    // Sanitize the query parameter using xss
    const query = xss(req.params.query);
    // Call the getsearchresult method from the blogService
    const blogs = await blogService.getSearchResult(query);
    console.log('Blogs data:', blogs); // Log the blogs data to inspect it

    if (blogs) {
      // Render the 'allblog' view and pass the blogs, success, and error messages
      res.render("allblog", {
        blogs,
        messages: {
          success: req.flash('success'),
          error: req.flash('error')
        }
      });
    } else {
      console.log("Error with blogs");
    }
  } catch (err) {
    console.log(err);
  }
};

// Controller function to get the following blogs
exports.getFollowingBlogs = async (req, res) => {
  // Call the getFollowingBlogs method from the blogService and pass the user ID
  const blogs = await blogService.getFollowingBlogs(req.user._id);

  // Get the current user
  const currentUser = await userService.getUserById(req.user._id);
  // Render the 'allblog' view and pass the blogs, success, error, and current user
  res.render("allblog", {
    blogs,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },
    currentUser
  });
};

// Controller function to get all blogs
exports.getBlogs = async (req, res) => {
  console.log("In getBlogs controller");
  try {
    // Call the getBlogs method from the blogService and pass the user ID
    const blogs = await blogService.getBlogs(req.user._id);
    const currentuser = await userService.getUserById(req.user._id);
    
    // Render the 'allblog' view and pass the blogs, current user, success, and error messages
    res.render('allblog', {
      blogs,
      currentuser,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      currentUser
    });
  } catch (err) {
    console.error("Error rendering 'blogs' view:", err);
    res.status(500).send("Error occurred while rendering the blogs view.");
  }
};

// Controller function to delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    // Sanitize the ID parameter using xss
    const id = xss(req.params.id);
    const userId = req.user._id;
    // Call the deleteBlog method from the blogService and pass the ID and user ID
    const deleteBlog = await blogService.deleteBlog(id, userId);
    const currentUser = await userService.getUserById(req.user._id);
    if (deleteBlog) {
      // Set a success flash message and redirect to the 'myblogs' route
      req.flash('success', 'Successfully deleted the blog');
      console.log("Successfully deleted the blog");
      res.redirect("/blogs/myblogs");
    } else {
      console.log("Deletion was not successful");
    }
  } catch (err) {
    console.log(`Internal server error ${err}`);
  }
};

// Controller function to get the user's blogs
exports.getMyBlogs = async (req, res) => {
  console.log("In my blogs controller");
  try {
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default limit to 10 if not provided
    // Get the total count of blogs for the user
    const totalBlogsCount = await Blog.countDocuments({ owner: req.user._id }).exec();
    const currentUser = await userService.getUserById(req.user._id);
    // Call the getMyBlogs method from the blogService and pass the user ID, page, and limit
    const blogs = await blogService.getMyBlogs(req.user._id, page, limit);

    // Prepare the pagination information
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    // Render the 'myblogs' view and pass the blogs, pagination, success, error, and current user
    res.render("myblogs", {
      blogs,
      pagination,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      currentUser
    });
  } catch (e) {
    console.log(`Error: ${e}`);
    res.status(500).send("Error occurred while fetching your blogs");
  }
};

// Controller function to get the top blogs
exports.getTopBlogs = async (req, res) => {
  try {
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5; // Default limit to 5 if not provided
    // Get the total count of blogs
    const totalBlogsCount = await Blog.countDocuments().exec();
    // Call the getTopBlogs method from the blogService and pass the page, limit, and user ID
    const blogs = await blogService.getTopBlogs(page, limit, req.user._id);
    const currentUser = await userService.getUserById(req.user._id);

    // Prepare the pagination information
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    // Render the 'allblog' view and pass the blogs, pagination, current user, success, and error messages
    res.render('allblog', {
      blogs,
      pagination,
      currentUser,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  } catch (error) {
    console.log("Error rendering top blogs,", error);
    res.status(500).send("Error occurred while rendering the blogs view");
  }
};

// Controller function to check if a blog is liked
exports.checklike= async (req, res) => {
  const userId = req.user._id;
  const id = xss(req.params.id);
  const blog = await blogService.checkLike(id, userId);
  if (blog === 200) {
    res.status(200).json({ "message": "already liked" });
  } else if (blog === 201) {
    res.status(201).json({ "message": "not liked" });
  }
};

// Controller function to add or remove a like on a blog
exports.addorremovelike = async (req, res) => {
  try {
    console.log("In the controller of the like");
    // Sanitize the blog ID parameter using xss
    const blogId = xss(req.params.id);
    const userId = req.user._id;
    // Call the addOrRemoveLike method from the blogService and pass the blog ID and user ID
    const liked = await blogService.addOrRemoveLike(blogId, userId);
    if (liked === 201) {
      res.status(201).json({ "message": "like added" });
    } else if (liked === 200) {
      res.status(200).json({ "message": "like removed" });
    } else {
      res.status(500).json({ "message": "Blog not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ "message": "An error has occurred" });
  }
};

// Controller function for creating a new blog post
exports.newRoute = async (req, res) => {
  console.log("In newRoute controller");
  // Fetch all the tags from the blogService
  const tags = await blogService.gettags();
  // Get the current user from the userService
  const currentuser = await userService.getUserById(req.user._id);
  // Render the 'newblog' view and pass the tags, success/error messages, and the current user
  res.render('newblog', {
    tags,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },
    currentuser
  });
};

// Controller function for retrieving a specific blog post
exports.getBlogById = async (req, res) => {
  try {
    console.log("In getBlogById controller");

    // Extract the blog ID from the request parameters and sanitize it
    const id = xss(req.params.id);
    if (!id) {
      return res.status(400).send('Blog ID is required');
    }

    // Fetch the blog post by ID from the blogService
    const blog = await blogService.getBlogById(id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // Get the current user from the userService
    const user = req.user ? await userService.getUserById(req.user._id) : null;

    // Render the 'specficblog' view and pass the blog, user, and success/error messages
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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: 'public/uploads/blog',
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb){
      checkFileType(file, cb);
  }
}).single('image');

// Function to check the file type
function checkFileType(file, cb){
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  // Check file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
}

// Controller function for creating a new blog post
exports.createBlog = async (req, res) => {
  try {
    console.log("In createBlog controller");

    // Handle file upload and blog creation
    upload(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).send('File upload error');
      }

      // Extract the form data from the request
      const checkedOptions = req.body.myCheckboxes || [];
      const { title, content, subtitle } = req.body;
      const imageFilename = req.file ? req.file.filename : false; // Check if file exists

      try {
        // Create a new blog post using the blogService
        await blogService.createBlog(
          title,
          subtitle,
          content,
          req.user._id,
          checkedOptions,
          imageFilename
        );
        req.flash('success',"blog created successfully")
        // Redirect to the 'myblogs' page after successful creation
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

// Controller function for editing a blog post
exports.editBlog = async (req, res) => {
  console.log("In editBlog controller");
    
  // Extract the blog ID from the request parameters and sanitize it
  const id = xss(req.params.id);
  try {
    // Fetch the blog post by ID from the blogService
    const blog = await blogService.getBlogById(id);
    // Get the current user from the userService
    const currentuser = await userService.getUserById(req.user._id);

    // Check if the current user is the owner of the blog post
    if (blog.owner.equals(req.user._id)) {
      // Render the 'editblog' view and pass the blog, success/error messages, and the current user
      res.render('editblog', {
        blog,
        messages: {
          success: req.flash('success'),
          error: req.flash('error')
        },
        currentuser
      });
    } else {
      // If the current user is not the owner, return a 403 Forbidden response
      res.status(403).send('Unauthorized');
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
}
// This controller function is responsible for updating a blog post
exports.updateBlog = async (req, res) => {
  try {
    console.log("In updateBlog controller");

    // Get the blog ID from the request parameters
    const id = req.params.id;
    // Get the updated title, subtitle, and content from the request body
    const { title, subtitle, content } = req.body;

    try {
      // Fetch the blog post by its ID
      const blog = await blogService.getBlogById(id);
      // Check if the current user is the owner of the blog post
      if (blog.owner.equals(req.user._id)) {
        // Update the blog post with the new title, subtitle, and content
        await blogService.updateBlogById(id, title, subtitle, content);
        // Redirect the user to the "myblogs" page
        res.redirect('/blogs/myblogs');
      } else {
        // If the user is not the owner, send a 403 Forbidden response
        res.status(403).send('Unauthorized');
      }
    } catch (error) {
      // Log the error and send a 500 Internal Server Error response
      console.error('Error updating blog:', error);
      res.status(500).send('Internal Server Error');
    }
  } catch (err) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
};

// This controller function is responsible for rendering the page that displays blogs of other users
exports.getotherUsersblogs = async (req, res) => {
  try {
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // Fetch the blogs of the user specified in the request parameters
    const blogs = await blogService.getUserBlogs(req.params.id, page, limit);
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);

    // Get the total count of blogs for the specified user
    const totalBlogsCount = await Blog.countDocuments({ owner: req.params.id }).exec();
    console.log(req.params.id)

    // Create the pagination object
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    // Render the "allblog" view with the retrieved data
    res.render('allblog', { 
      blogs,
      pagination,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      currentuser
    });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
};

// This controller function is responsible for rendering the page that displays the current user's blogs
exports.getUserBlogs = async (req, res) => {
  console.log("In getUserBlogs controller");
  // Fetch the current user's information
  const currentuser = await userService.getUserById(req.user._id);

  try {
    // Fetch the blogs of the current user
    const blogs = await blogService.getUserBlogs(req.user._id);
    // Render the "myblogs" view with the retrieved data
    res.render('myblogs', { blogs,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser
    });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
};

// This controller function is responsible for rendering the page that displays random blogs (not owned by the current user)
exports.getRandomBlogs = async (req, res) => {
  try {
    // Get the current user's ID
    const userId = req.user._id;
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // Get the total count of blogs not owned by the current user
    const totalBlogsCount = await Blog.countDocuments({ owner: { $ne: userId } }).exec();
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);

    // Fetch the random blogs
    const blogs = await blogService.getRandomBlogs(userId, page, limit);

    // Create the pagination object
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalBlogsCount / limit),
      limit: limit,
      totalResults: totalBlogsCount
    };

    // Render the "allblog" view with the retrieved data
    res.render('allblog', { blogs, pagination,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, currentuser
    });
  } catch (err) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error fetching blog:', err);
    res.status(500).send('Internal Server Error');
  }
};

// This controller function is responsible for rendering the page that displays the available blog categories
exports.getcatagories = async (req, res) => {
  // Fetch the available blog tags
  const tags = await blogService.gettags();
  // Fetch the current user's information
  const currentuser = await userService.getUserById(req.user._id);
  // Render the "Blogcatagories" view with the retrieved data
  res.render("Blogcatagories", { tags, currentuser, messages: {
    success: req.flash('success'),
    error: req.flash('error')
  }});
};

// This controller function is responsible for rendering the page to create a new blog category
exports.getc = async (req, res) => {
  console.log("in the controller function");
  // Render the "newtag" view
  res.render("newtag");
};

// This controller function is responsible for creating a new blog category
exports.newtag = async (req, res) => {
  try {
    console.log("in the new catagories");
    // Create a new blog tag using the blogService
    const name = blogService.newtag(req.body.name, req.body.description);
    // Redirect the user to the "catagories" page
    res.redirect("/blogs/catagories");
  } catch (err) {
    // Send a 500 Internal Server Error response
    res.status(500).send('Error occurred');
  }
};

// This controller function is responsible for rendering the page that displays blogs for a specific category
exports.getcatblogs = async (req, res) => {
  // Fetch the blogs for the specified category and the current user
  const blogs = await blogService.getcatblogs(req.params.name, req.user._id);
  // Fetch the current user's information
  const currentuser = await userService.getUserById(req.user._id);
  // Render the "allblog" view with the retrieved data
  res.render("allblog", {
    blogs,
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    }, currentuser
  });
};