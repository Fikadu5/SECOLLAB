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


exports.getsearchresult = async(req,res) =>
  {
    const query = xss(req.params.text);
    const users = userService.getsearchresult(query)
    const currentuser = await  userService.getUserById(req.user._id);
    if(users)
    {
      res.render("searchprofile",{users,currentuser})
    }

  
  }

  
exports.getUsers = async (req, res) => {
  try {
    const blogs = await blogsService.getBlogs(req.user._id);
    const projects = await projectService.getProjects(req.user._id);

    const users = await userService.getuser(req.user._id)
    // Assuming you want to fetch all users except the current user
    const currentuser =  await userService.getUserById(req.user._id);


    res.render("index", {
      users,
      blogs,
      projects,
      currentuser ,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },
      currentuser,
      logged_in: req.isAuthenticated()
    });
  } catch (error) {
    console.error('Error in getUsers controller:', error);
  
    res.status(500).send("Internal Server Error");
  }
};




exports.getMyFollowers = async (req, res) => {
  try {
    console.log("in the user controller");
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    console.log(req.user._id)
    const paginatedFollowers = await userService.getmyFollowers(req.user._id, page, limit);
    const currentuser =  userService.getUserById(req.user._id);
    res.render("myfollowers", { paginatedFollowers, messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, currentuser});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching followers" });
  }
};




exports.getMyFollwing = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const following = await userService.getMyFollowing(req.user._id, page, limit);
    const currentuser =  userService.getUserById(req.user._id);
    
    res.render("myfollowing", {
      following,
      currentuser,
      messages: {
        success: req.flash('success'),
        error: req.flash('error'),
      },currentuser
    });
  } catch (err) {
    console.log(err);
  }
};





exports.removefollower = async(req,res) =>
{
  try{
    console.log("in the controller of remove function")
  const follower_id = xss(req.params.id);
  const userid = req.user._id;
  const remove = userService.removefollower(userid,follower_id);
  if(remove){
    console.log("sucessfully removed")

    res.redirect("/myfollowers")
  }
  else{
    console.log("user not removed")
    res.redirect("/myfollowers")
  }
}
catch(err)
{
  console.log(err);
}

}




exports.getFollowing = async(req,res)=>
{
  try{
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const id = xss(req.params.id);
    const currentuser =  userService.getUserById(req.user._id);
     const following = await userService.getFollowing(id,page,limit);
     
      res.render("otherfollowing", {following,currentuser})
  }
  catch(err)
  {
      console.log(err)
  }
}


exports.getFollowers = async(req,res) =>
{
  try{
    const id = xss(req.params.id);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const  paginatedFollowers = await userService.getFollowers(id,page,limit);
    const currentuser =  userService.getUserById(req.user._id);
      res.render("otherfollowers",{paginatedFollowers,currentuser})
  }
  catch(err)
  {
    console.log(err);
  }
}

exports.renderabout = async(req,res)=>
{
  try {
    const users = await userService.getUsers();
    const currentuser =  userService.getUserById(req.user._id);
    res.render("about", {
      users,
      logged_in: req.isAuthenticated(),
      currentuser

    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

exports.contactUser = async (req, res) => {
  const { name, email, phone, message } = xss(req.body);
  try {
    await userService.saveUserComment(email, message);
    res.redirect('/');
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getProfile = (req, res) => {

    res.render("profile");
 
};

exports.getcurrentuser = async(req,res) =>
{
  const user = await userService.getUserById(req.user._id);
  const currentuser =  userService.getUserById(req.user._id);
  res.render("forgetpassword",{user,currentuser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },})
}

exports.getMyProfile = async(req,res)=>
{
  const user = await userService.getUserById(req.user._id);
  const currentuser =  userService.getUserById(req.user._id);
  const currentDirectory = process.cwd();
  res.render("myprofile",{user,currentuser,currentDirectory})
}
exports.otherusers = async(req,res)=>
{
  const users = await userService.getUsers(req.user._id);
  const currentuser =  userService.getUserById(req.user._id);
  res.render("otherusers",{users,currentuser})
}


exports.editProfile = async (req, res) => {
 
    try {
      const user = await userService.getUserById(req.user._id);
      
      const currentuser = await userService.getUserById(req.user._id);
      res.render("editprofile", { user,currentuser,messages: {
        success: req.flash('success'),
        error: req.flash('error')
      },currentuser });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Internal Server Error');
    }
  }

exports.explore = async(req,res) =>
{
  res.render("explore")
}
exports.rendercontact = async(req,res) =>
{
  
    const currentuser=  await userService.getUserById(req.user._id);
    res.render("contact",{currentuser})

  }
 
  
const storage = multer.diskStorage({
  destination: 'public/uploads/',
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

exports.editProfileChange = async(req, res) => {
  try {
    upload(req, res, (err) => {
      if(err){
        return res.status(400).send(err);
      } 
      if (!req.file) {
        return false
      } })
      
    console.log("in the controller function")
    const details = req.body;
    const userid = req.user._id;
    const imageFilename = req.file ? req.file.filename : false; // Check if file exists

    await userService.editProfile(details, userid, imageFilename);
    
    res.redirect("/");
  } catch (error) {
    console.error('Error processing profile edit:', error);
    res.status(500).send('An error occurred while updating the profile');
  }
}
exports.deleteaccount = async(req,res) =>
{
  const currentuser=  await userService.getUserById(req.user._id);
  res.render("deleteaccount",{currentuser})
}


exports.deleteUser = async (req, res) => {
  await userService.deleteUserById(req.user._id);
    try {
      req.logout((err,succ) =>
      {
        if(err)
        {
          console.log("error logging out")
        }
        else{
          console.log(succ)
        }
      });
      
      
      res.redirect("/");
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
    }
  
};

exports.getOtherUserProfile = async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.id;
    try {
      const user = await userService.getUserById(userId);
      const currentuser =  userService.getUserById(req.user._id);
      res.render("otherprofile", { user,currentuser });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect("/login");
  }
};

exports.SendCodeEmail = async (req, res) => {
  try {
    const new_password = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(new_password, salt);

    await User.updateOne(
      { _id: req.user._id },
      { $set: { password: hashedpassword, salt: salt } }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "recipient_email@gmail.com",
      subject: 'Regarding your new password',
      text: `Your new password is ${new_password}`
    };

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
  const follower_id = req.user._id;
  const following_id = req.params.id;

  console.log(`Received follow request from ${follower_id} to follow ${following_id}`);

  try {
    const follow = await userService.followUser(follower_id, following_id);
    if (follow) {
      console.log(`User ${follower_id} successfully followed ${following_id}`);
      res.status(200).json({ message: "successfully subscribed" });
    } else {
      console.error(`Failed to follow ${following_id}`);
      res.status(400).json({ message: "Failed to follow user" });
    }
  } catch (error) {
    console.error(`Error in followUser controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.unfollow = async(req,res) =>
{
  try {
    console.log("in the controller of the unfollow user");

    const following_id = xss(req.params.id);
    const follower_id = req.user._id;

    console.log(`Received unfollow request from ${follower_id} to unfollow ${following_id}`);

    const unfollow = await userService.unfollow(follower_id, following_id);

    if (unfollow) {
      console.log(`User ${follower_id} successfully unfollowed ${following_id}`);
      res.status(200).json({"message":"sucessfully unfollowed"})
    } else {
      console.error(`Failed to unfollow ${following_id}`);
      res.status(500).json({"message":"sucessfully unfollowed"})
    }
  } catch (error) {
    console.error(`Error in unFollowUser controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }

}


exports.unFollowUser = async (req, res) => {
  try {
    console.log("in the controller of the unfollow user");

    const following_id = xss(req.params.id);
    const follower_id = req.user._id;

    console.log(`Received unfollow request from ${follower_id} to unfollow ${following_id}`);

    const unfollow = await userService.unfollow(follower_id, following_id);

    if (unfollow) {
      console.log(`User ${follower_id} successfully unfollowed ${following_id}`);
      res.redirect("/myfollowing")
    } else {
      console.error(`Failed to unfollow ${following_id}`);
      res.redirect("/myfollowing")
    }
  } catch (error) {
    console.error(`Error in unFollowUser controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.checkfollow = async (req, res) => {
 
  try {
    console.log("in the user controller for check following")
    const follower = req.user._id;
    const following = xss(req.params.id);
    console.log("In the followers controller");
    const isFollowing = await userService.checkfollowing(follower, following);
    if (isFollowing) {
      res.status(200).json({ message: "follows the user" });
    } else {
      res.status(400).json({ message: "does not follow the userS" });
    }
  } catch (err) {
    console.error(`Error in checkfollow controller: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.follow = async (req, res) => {
  const following = xss(req.params.id);
  const follower = req.user._id;
  if(follower == following)
  {
    console.log("you cant follow yourself")
    res.status(400).json({message:"you can follow yourself"})
  }
  const followResult = await userService.followUser(follower, following);
  if (followResult) {
    console.log(`Saved follow record for ${follower} following ${following}`);
    res.status(200).json({ message: "successfully subscribed" });
    
  } else {
    
    res.status(400).json({ message: "User already follows the other user" });
  }
};








exports.delete_photo = async (req, res) => {
  try {
    const currentuser =  await userService.getUserById(req.user._id);
 

      // Ensure the profile photo exists
      if (!currentuser || currentuser.image.length == 0) {
          return res.status(400).json({ message: "No profile photo found" });
      }

      // Construct the file path
      const filePath = path.join( 'public/uploads', path.basename(currentuser.image));

      // Log the file path for debugging
      console.log('File Path:', filePath);

      // Delete the file
      fs.unlink(filePath, (err) => {
          if (err) {
              // Handle file deletion errors
              console.error('Error deleting the file:', err);
              return res.status(500).json({ message: "Error deleting photo" });
          }
          const filepath = userService.removeinfophoto(req.user._id);
          res.status(200).json({ message: "Successfully deleted photo" });
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Internal server error" });
  }
};