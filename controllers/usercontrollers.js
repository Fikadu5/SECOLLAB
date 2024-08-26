const { updateOne } = require('../models/project');
const userService = require('../services/userservice');
const blogsService =require('../services/blogservice');
const projectService =require('../services/projectservice');
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const xss = require('xss');

// This is the controller function for the search result route
exports.getsearchresult = async(req,res) => {
  // Sanitize the search query to prevent XSS attacks
  const query = xss(req.params.text);
  // Call the getUsersSearchResult service function to get the search results
  const users = userService.getsearchresult(query);
  // Fetch the current user's information
  const currentuser = await userService.getUserById(req.user._id);
  
  // If there are search results, render the "otherusers" view and pass the results and current user
  if(users) {
    res.render("otherusers",{users,currentuser});
  }
}

// This is the controller function for the home page route
exports.getUsers = async (req, res) => {
  try {
    // Fetch the blogs and projects for the current user
    const blogs = await blogsService.getBlogs(req.user._id);
    const projects = await projectService.getProjects(req.user._id);
    // Fetch all users except the current user
    const users = await userService.getuser(req.user._id);
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);

    // Render the "index" view and pass the fetched data, flash messages, and authentication status
    res.render("index", {
      users,
      blogs,
      projects,
      currentuser,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      logged_in: req.isAuthenticated()
    });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error in getUsers controller:', error);
    res.status(500).send("Internal Server Error");
  }
};

// This is the controller function for the my followers route
exports.getMyFollowers = async (req, res) => {
  try {
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // Call the getmyFollowers service function to get the paginated followers
    const paginatedFollowers = await userService.getmyFollowers(req.user._id, page, limit);
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);
    // Render the "myfollowers" view and pass the paginated followers, flash messages, and current user
    res.render("myfollowers", { paginatedFollowers, messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, currentuser });
  } catch (err) {
    // Log the error and send a 500 Internal Server Error response
    console.log(err);
    res.status(500).json({ message: "Error fetching followers" });
  }
};

// This is the controller function for the my following route
exports.getMyFollwing = async (req, res) => {
  try {
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // Call the getMyFollowing service function to get the paginated following
    const following = await userService.getMyFollowing(req.user._id, page, limit);
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);
    // Render the "myfollowing" view and pass the following, flash messages, and current user
    res.render("myfollowing", {
      following,
      currentuser,
      messages: {
        success: req.flash('success'),
        error: req.flash('error'),
      },currentuser
    });
  } catch (err) {
    // Log the error
    console.log(err);
  }
};

// This is the controller function for the remove follower route
exports.removefollower = async(req,res) => {
  try {
    // Sanitize the follower ID to prevent XSS attacks
    const follower_id = xss(req.params.id);
    const userid = req.user._id;
    // Call the removefollower service function to remove the follower
    const remove = userService.removefollower(userid,follower_id);
    if(remove){
      // If the follower was removed successfully, redirect to the my followers page
      console.log("sucessfully removed");
      res.redirect("/myfollowers");
    } else {
      // If the follower was not removed, redirect to the my followers page
      console.log("user not removed");
      res.redirect("/myfollowers");
    }
  } catch(err) {
    // Log the error
    console.log(err);
  }
}

// This is the controller function for the other user's following route
exports.getFollowing = async(req,res) => {
  try {
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // Sanitize the user ID to prevent XSS attacks
    const id = xss(req.params.id);
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);
    // Call the getFollowing service function to get the paginated following
    const following = await userService.getFollowing(id,page,limit);
    // Render the "otherfollowing" view and pass the following and current user
    res.render("otherfollowing", {following,currentuser});
  } catch(err) {
    // Log the error
    console.log(err);
  }
}

// This is the controller function for the other user's followers route
exports.getFollowers = async(req,res) => {
  try {
    // Sanitize the user ID to prevent XSS attacks
    const id = xss(req.params.id);
    // Get the page and limit parameters from the query string
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // Call the getFollowers service function to get the paginated followers
    const paginatedFollowers = await userService.getFollowers(id,page,limit);
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);
    // Render the "otherfollowers" view and pass the paginated followers and current user
    res.render("otherfollowers",{paginatedFollowers,currentuser});
  } catch(err) {
    // Log the error
    console.log(err);
  }
}

// This is the controller function for the about page
exports.renderabout = async(req,res) => {
  try {
    // Fetch all users
    const users = await userService.getUsers();
    // Fetch the current user's information
    const currentuser = await userService.getUserById(req.user._id);
    // Render the "about" view and pass the users, authentication status, and current user
    res.render("about", {
      users,
      logged_in: req.isAuthenticated(),
      currentuser
    });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

// This is the controller function for the contact route
exports.contactUser = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    // Call the saveUserComment service function to save the user's comment
    await userService.saveUserComment(email, message);
    // Redirect the user to the home page
    res.redirect('/');
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error saving comment:', error);
    res.status(500).send('Internal Server Error');
  }
};

// This is the controller function for the profile page
exports.getProfile = (req, res) => {
  // Render the "profile" view
  res.render("profile");
}

// This is the controller function for the forget password route
exports.getcurrentuser = async(req,res) => {
  // Fetch the current user's information
  const user = await userService.getUserById(req.user._id);
  const currentuser = await userService.getUserById(req.user._id);
  // Render the "forgetpassword" view and pass the user, current user, and flash messages
  res.render("forgetpassword",{user,currentuser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },});
}

// This is the controller function for the my profile route
exports.getMyProfile = async(req,res) => {
  // Fetch the current user's information
  const user = await userService.getUserById(req.user._id);
  const currentuser = await userService.getUserById(req.user._id);
  const currentDirectory = process.cwd();
  // Render the "myprofile" view and pass the user, current user, and current directory
  res.render("myprofile",{user,currentuser,currentDirectory});
}

// This is the controller function for the other users route
exports.otherusers = async(req,res) => {
  // Fetch all users except the current user
  const users = await userService.getUsers(req.user._id);
  // Fetch the current user's information
  const currentuser = await userService.getUserById(req.user._id);
  // Render the "otherusers" view and pass the users and current user
  res.render("otherusers",{users,currentuser});
}

// This is the controller function for the edit profile route
exports.editProfile = async (req, res) => {
  try {
    // Fetch the current user's information
    const user = await userService.getUserById(req.user._id);
    const currentuser = await userService.getUserById(req.user._id);
    // Render the "editprofile" view and pass the user, current user, and flash messages
    res.render("editprofile", { user,currentuser,messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },currentuser });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
}

// This is the controller function for the explore route
exports.explore = async(req,res) => {
  // Render the "explore" view
  res.render("explore");
}
// Render the contact page
exports.rendercontact = async(req,res) => {
  // Get the current user
  const currentuser = await userService.getUserById(req.user._id);
  // Render the 'contact' view and pass the current user
  res.render("contact",{currentuser})
}

// Configure Multer storage settings
const storage = multer.diskStorage({
  destination: 'public/uploads/', // Set the destination folder for uploaded files
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Set the filename based on the file field name and current timestamp
  }
});

// Initialize Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: function(req, file, cb){
      checkFileType(file, cb); // Check the file type
  }
}).single('image'); // Accept a single 'image' file field

// Check the file type
function checkFileType(file, cb){
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check the file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check the MIME type
  const mimetype = filetypes.test(file.mimetype);

  // If the file is an allowed image, return true
  if(mimetype && extname){
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
}

// Handle the profile edit request
exports.editProfileChange = async(req, res) => {
  try {
    // Process the uploaded file
    upload(req, res, (err) => {
      if(err){
        return res.status(400).send(err);
      } 
      // If no file is uploaded, set the imageFilename to false
      if (!req.file) {
        return false
      }
    })
      
    console.log("in the controller function")
    // Get the updated details from the request body
    const details = req.body;
    // Get the user ID from the request
    const userid = req.user._id;
    // Get the uploaded file name, or set it to false if no file is uploaded
    const imageFilename = req.file ? req.file.filename : false;

    // Call the editProfile service to update the user's profile
    await userService.editProfile(details, userid, imageFilename);
    
    // Redirect the user to the home page
    res.redirect("/");
  } catch (error) {
    console.error('Error processing profile edit:', error);
    res.status(500).send('An error occurred while updating the profile');
  }
}

// Render the delete account page
exports.deleteaccount = async(req,res) => {
  // Get the current user
  const currentuser = await userService.getUserById(req.user._id);
  // Render the 'deleteaccount' view and pass the current user
  res.render("deleteaccount",{currentuser})
}

// Handle the user deletion request
exports.deleteUser = async (req, res) => {
  // Delete the user from the database
  await userService.deleteUserById(req.user._id);
  try {
    // Log the user out
    req.logout((err,succ) => {
      if(err) {
        console.log("error logging out")
      } else {
        console.log(succ)
      }
    });
    
    // Redirect the user to the home page
    res.redirect("/");
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Render the other user's profile
exports.getOtherUserProfile = async (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // Get the user ID from the request parameters
    const userId = req.params.id;
    try {
      // Fetch the user and the current user's profile
      const user = await userService.getUserById(userId);
      const currentuser = await userService.getUserById(req.user._id);
      // Render the 'otherprofile' view and pass the user and current user
      res.render("otherprofile", { user, currentuser });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    // Redirect the user to the login page if not authenticated
    res.redirect("/login");
  }
};

// Handle the password reset email request
exports.SendCodeEmail = async (req, res) => {
  try {
    // Generate a new random password
    const new_password = Math.floor(100000 + Math.random() * 900000).toString();
    // Hash the new password with a salt
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(new_password, salt);

    // Update the user's password and salt in the database
    await User.updateOne(
      { _id: req.user._id },
      { $set: { password: hashedpassword, salt: salt } }
    );

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Set the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "recipient_email@gmail.com",
      subject: 'Regarding your new password',
      text: `Your new password is ${new_password}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    console.error('Error in SendCodeEmail:', error);
    res.status(500).send('Internal Server Error');
  }
};
// Controller function for following a user
exports.followUser = async (req, res) => {
  const follower_id = req.user._id; // Get the ID of the user who is following
  const following_id = req.params.id; // Get the ID of the user being followed

  console.log(`Received follow request from ${follower_id} to follow ${following_id}`);

  try {
    // Call the followUser service function to handle the follow logic
    const follow = await userService.followUser(follower_id, following_id);
    if (follow) {
      // If the follow was successful, log a success message and send a success response
      console.log(`User ${follower_id} successfully followed ${following_id}`);
      res.status(200).json({ message: "successfully subscribed" });
    } else {
      // If the follow failed, log an error message and send a failure response
      console.error(`Failed to follow ${following_id}`);
      res.status(400).json({ message: "Failed to follow user" });
    }
  } catch (error) {
    // If there is an error, log the error and send a 500 Internal Server Error response
    console.error(`Error in followUser controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for unfollowing a user
exports.unfollow = async (req, res) => {
  try {
    console.log("in the controller of the unfollow user");

    const following_id = xss(req.params.id); // Get the ID of the user being unfollowed
    const follower_id = req.user._id; // Get the ID of the user who is unfollowing

    console.log(`Received unfollow request from ${follower_id} to unfollow ${following_id}`);

    // Call the unfollow service function to handle the unfollow logic
    const unfollow = await userService.unfollow(follower_id, following_id);

    if (unfollow) {
      // If the unfollow was successful, log a success message and send a success response
      console.log(`User ${follower_id} successfully unfollowed ${following_id}`);
      res.status(200).json({ "message": "successfully unfollowed" });
    } else {
      // If the unfollow failed, log an error message and send a 500 Internal Server Error response
      console.error(`Failed to unfollow ${following_id}`);
      res.status(500).json({ "message": "successfully unfollowed" });
    }
  } catch (error) {
    // If there is an error, log the error and send a 500 Internal Server Error response
    console.error(`Error in unFollowUser controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for checking if a user is following another user
exports.checkfollow = async (req, res) => {
  try {
    console.log("in the user controller for check following");
    const follower = req.user._id; // Get the ID of the user who is checking
    const following = xss(req.params.id); // Get the ID of the user being checked
    console.log("In the followers controller");
    // Call the checkfollowing service function to check if the user is following
    const isFollowing = await userService.checkfollowing(follower, following);
    if (isFollowing) {
      // If the user is following, send a success response
      res.status(200).json({ message: "follows the user" });
    } else {
      // If the user is not following, send a failure response
      res.status(400).json({ message: "does not follow the user" });
    }
  } catch (err) {
    // If there is an error, log the error and send a 500 Internal Server Error response
    console.error(`Error in checkfollow controller: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function for following a user
exports.follow = async (req, res) => {
  const following = xss(req.params.id); // Get the ID of the user being followed
  const follower = req.user._id; // Get the ID of the user who is following
  if (follower == following) {
    // If the follower is trying to follow themselves, log a message and send a failure response
    console.log("you can't follow yourself");
    res.status(400).json({ message: "you can't follow yourself" });
  }
  // Call the followUser service function to handle the follow logic
  const followResult = await userService.followUser(follower, following);
  if (followResult) {
    // If the follow was successful, log a success message and send a success response
    console.log(`Saved follow record for ${follower} following ${following}`);
    res.status(200).json({ message: "successfully subscribed" });
  } else {
    // If the follow failed, send a failure response
    res.status(400).json({ message: "User already follows the other user" });
  }
};

// Controller function for deleting a user's profile photo
exports.delete_photo = async (req, res) => {
  try {
    const currentuser = await userService.getUserById(req.user._id); // Get the currently logged-in user

    // Ensure the profile photo exists
    if (!currentuser || currentuser.image.length === 0) {
      return res.status(400).json({ message: "No profile photo found" });
    }

    // Construct the file path
    const filePath = path.join('public/uploads', path.basename(currentuser.image));

    // Log the file path for debugging
    console.log('File Path:', filePath);

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        // Handle file deletion errors
        console.error('Error deleting the file:', err);
        return res.status(500).json({ message: "Error deleting photo" });
      }
      // Remove the photo information from the user's profile
      const filepath = userService.removeinfophoto(req.user._id);
      res.status(200).json({ message: "Successfully deleted photo" });
    });
  } catch (error) {
    // If there is an error, log the error and send a 500 Internal Server Error response
    console.error('Error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};