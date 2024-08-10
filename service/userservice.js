const{User, Follow}= require('../models/user');
const UserComment = require('../models/userscomment');
const validator = require('validator');



exports.editProfile = async(details, id) => {
  try {
   deleteuser
    const update = await User.findByIdAndUpdate(
      id,
      {
        fname: details.fname,
        lname: details.lname,
        twitter: details.twitter,
        phone_number: details.phone_number,
        age: details.age,
        about_me: details.about_me,
        github: details.github,
        previous: details.previous,
        country: details.country,
        city: details.city,
        employment_status: details.employment_status,
        education_status: details.education_status,
        skills: details.skills,
        email: details.email,
        // image: details.image // Ensure the image is properly handled in your form and middleware
      },
      { new: true, runValidators: true }
    );
    update.save()

    if (update) {
      console.log('User updated successfully:', update);
    } else {
      console.error('Failed to update user:', id);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
}
exports.currentuser = async(req,res) =>
{

  const id = req.user._id;
  console.log(id)
  return id;
}

exports.getuser = async(id) =>
{
   const user = User.find({_id:{$ne:id}})
   return user;
}
