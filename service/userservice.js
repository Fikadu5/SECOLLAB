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

exports.getFollowing = async(id,page,limit)=>
{
  const startIndex = (page - 1) * limit;
  const totalFollowingCount = await Follow.countDocuments({ follower: id }).exec();
  const totalFollowing = await Follow.find({ follower: id })
    .populate("following")
    .skip(startIndex)
    .limit(limit)
    .exec();

  const following = {
    results: totalFollowing,
    currentPage: page,
    totalPages: Math.ceil(totalFollowingCount / limit),
    totalResults: totalFollowingCount,
    limit: limit,
  };

  console.log('Paginated Following:', following);
  return following;



  };



exports.getFollowers = async(id,page,limit) =>
{
  const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const followers = await Follow.find({ following: id })
      .populate('following')
      .populate('follower')
      .skip(startIndex)
      .limit(limit)
      .exec();

    const totalFollowers = await Follow.countDocuments({ following: id });

    const paginatedFollowers = {
      results: followers,
      currentPage: page,
      totalPages: Math.ceil(totalFollowers / limit),
      totalResults: totalFollowers
    };

    console.log('Followers:', followers); // Log followers data
    console.log('Paginated Followers:', paginatedFollowers);
    return paginatedFollowers;



}


// Service function for following a user
exports.followUser = async (follower_id, following_id) => {
  try {
    const existingFollow = await Follow.exists({
      follower: follower_id,
      following: following_id,
    });
    if (existingFollow) {
      console.log("user already follows the user")
      return false
    }

    // If the follow record does not exist, create a new one
    const newFollow = new Follow({
      follower: follower_id,
      following: following_id,
    });
    await newFollow.save();
    return true;
  } catch (err) {
    console.error(`Error saving follow record: ${err}`);
    return false;
  }
};


exports.unfollow = async(follower,following) =>
{
  try{
  const unfollow = Follow.deleteOne({
    follower,
    following
  })



  return unfollow;
}
catch(err)
{
  console.log("error deleting the data from the database");

}
}


exports.checkfollowing = async (follower_id, following_id) => {
  try {
    const followRecord = await Follow.findOne({ follower: follower_id, following: following_id });
    if (followRecord) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.error(`Error checking follow status: ${err}`);
    return { status: 500, message: "Internal server error"};
  }
};

exports.follow = async(follower,following) =>
{
  try {
    const follow = await Follow.findOne({ follower, following});
    return follow;


  } catch (err) {
    console.error(`Error saving follow record: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }

}

