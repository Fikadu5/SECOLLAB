const{User, Follow}= require('../models/user');
const UserComment = require('../models/userscomment');
const validator = require('validator');




exports.getsearchresult = async(query) =>
{
  const user = User.find({$name: {$search:query}});
  return user;
}

exports.getUsers = async (id) => {
  try {
    // const results = await User.aggregate([
    //   { $sample: { size: 5 } }
    // ]);
    const results = await User.find({_id:{$ne:id}});
    return results;
  } catch (error) {
    throw error;
  }
};



exports.saveUserComment = async (email, message) => {
  const userComment = new UserComment({
    email: email,
    comment: message
  });

  try {
    await userComment.save();
  } catch (error) {
    throw new Error('Error saving user comment');
  }
};

exports.getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error('Error fetching user');
  }
};
exports.currentuser = async(id) =>
{
  
  const user = await User.findById(id);
  return user
}

exports.getuser = async(id) =>
{
   const user = User.find({_id:{$ne:id}})
   return user;
}
exports.deleteUserById = async (userId) => {
  try {
    
    await User.findByIdAndDelete(userId);
    await Follow.deleteMany({follower:userId})
    await Follow.deleteMany({following:userId});
  } catch (error) {
    throw new Error('Error deleting user');
  }
};
exports.removefollower = async(userid,id) =>
{
  try{
  console.log("in the service of user")
  const remove = await Follow.deleteOne({
    follower:id,
    following:userid
  })
  
 
  return remove;
}
catch(err)
{
  console.log(err);
}
}

exports.getmyFollowers = async (id, page = 1, limit = 10) => {
  try {
    console.log("in the get my followers service with the id of " + id);

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
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getMyFollowing = async (id, page = 1, limit = 10) => {
  console.log(id);
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
exports.editProfile = async (details, id, imageFilename) => {
  try {
    // Build the update object
    const updateData = {
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
    };

    // Add image filename to update data if it exists
    if (imageFilename) {
      updateData.image = imageFilename;
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      console.log('User updated successfully:', updatedUser);
      return updatedUser; // Return the updated user
    } else {
      console.error('Failed to update user:', id);
      return null; // Return null if no user was found to update
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};


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


exports.removeinfophoto = async(id) =>
{
  const user = await User.findById(id);
  user.image = "noprofile.jpg";
  return user

}
