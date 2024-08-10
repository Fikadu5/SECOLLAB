const userService = require('../services/userservice');
const blogsService =require('../services/blogservice');
const projectService =require('../services/projectservice');


exports.renderabout = async(req,res)=>
{
  try {
    const users = await userService.getUsers();
    const currentUser = await userService.getUserById(req.user._id);
    res.render("about", {
      users,
      logged_in: req.isAuthenticated(),
      currentUser

    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

exports.contactUser = async (req, res) => {
  const { name, email, phone, message } = req.body;
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
  const currentUser = await userService.getUserById(req.user._id);
  res.render("forgetpassword",{user,currentUser})
}

exports.getMyProfile = async(req,res)=>
{
  const user = await userService.getUserById(req.user._id);
  const currentUser = await userService.getUserById(req.user._id);
  const currentDirectory = process.cwd();
  res.render("myprofile",{user,currentUser,currentDirectory})
}
exports.otherusers = async(req,res)=>
{
  const users = await userService.getUsers(req.user._id);
  const currentUser = await userService.getUserById(req.user._id);
  res.render("otherusers",{users})
}
exports.rendercontact = async(req,res) =>
{
  if(req.isAuthenticated())
  {
    res.render("contact",{is_logged_in:true})

  }
  else{
    res.render("contact",{is_logged_in:false})

  }

}


exports.getsearchresult = async(req,res) =>
  {
    const query = req.params.text;
    const users = userService.getsearchresult(query)
    if(users)
    {
      res.render("searchprofile",{users})
    }


  }


exports.getMyFollowers = async (req, res) => {
  try {
    console.log("in the user controller");
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    console.log(req.user._id)
    const paginatedFollowers = await userService.getmyFollowers(req.user._id, page, limit);
    const currentUser = await userService.getUserById(req.user._id);
    res.render("myfollowers", { paginatedFollowers, messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }, });
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
    const currentUser = await userService.getUserById(req.user._id);

    res.render("myfollowing", {
      following,
      currentUser,
      messages: {
        success: req.flash('success'),
        error: req.flash('error'),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.removefollower = async(req,res) =>
{
  try{
    console.log("in the controller of remove function")
  const follower_id = req.params.id;
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
    const id = req.params.id;
     const following = await userService.getFollowing(id,page,limit);
     const currentUser = await userService.getUserById(req.user._id);
      res.render("otherfollowing", {following,currentUser})
  }
  catch(err)
  {
      console.log(err)
  }
}


exports.getFollowers = async(req,res) =>
{
  try{
    const id = req.params.id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const  paginatedFollowers = await userService.getFollowers(id,page,limit);
      res.render("otherfollowers",{paginatedFollowers})
  }
  catch(err)
  {
    console.log(err);
  }
}

exports.deleteUser = async (req, res) => {
  if (req.isAuthenticated()) {
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
      await userService.deleteUserById(req.user._id);

      res.redirect("/");
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect("/login");
  }
};

