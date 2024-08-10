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
