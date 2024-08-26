// Importing required models and libraries
const { User, Follow } = require('../models/user');
const UserComment = require('../models/userscomment');
const validator = require('validator');

// Function to search users by name using a case-insensitive regular expression
exports.getsearchresult = async (query) => {
  const user = await User.find({ name: { $regex: query, $options: 'i' } });
  return user;
}

// Function to get a list of users excluding the one with the given id
exports.getUsers = async (id) => {
  try {
    const results = await User.find({ _id: { $ne: id } });
    return results;
  } catch (error) {
    throw error; // Rethrow error for caller to handle
  }
};

// Function to save a new comment from a user
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

// Function to fetch a user by their ID
exports.getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error('Error fetching user');
  }
};

// Function to get the current user based on their ID
exports.currentuser = async (id) => {
  const user = await User.findById(id);
  return user;
}

// Function to get a list of users excluding the one with the given ID
exports.getuser = async (id) => {
  const user = User.find({ _id: { $ne: id } });
  return user;
}

// Function to delete a user by their ID, and remove their follow relationships
exports.deleteUserById = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
    await Follow.deleteMany({ follower: userId });
    await Follow.deleteMany({ following: userId });
  } catch (error) {
    throw new Error('Error deleting user');
  }
};

// Function to remove a follower relationship
exports.removefollower = async (userid, id) => {
  try {
    console.log("in the service of user");
    const remove = await Follow.deleteOne({
      follower: id,
      following: userid
    });
    return remove;
  } catch (err) {
    console.log(err);
  }
}
// Function to get the user's followers
exports.getmyFollowers = async (id, page = 1, limit = 10) => {
  try {
    console.log("in the get my followers service with the id of " + id);

    // Calculate the start and end index for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Fetch the followers, populate the following and follower data
    const followers = await Follow.find({ following: id })
      .populate('following')
      .populate('follower')
      .skip(startIndex)
      .limit(limit)
      .exec();

    // Get the total number of followers
    const totalFollowers = await Follow.countDocuments({ following: id });

    // Prepare the paginated followers data
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

// Function to get the user's following
exports.getMyFollowing = async (id, page = 1, limit = 10) => {
  console.log(id);
  // Calculate the start index for pagination
  const startIndex = (page - 1) * limit;

  // Get the total number of users the user is following
  const totalFollowingCount = await Follow.countDocuments({ follower: id }).exec();

  // Fetch the users the user is following, populate the following data
  const totalFollowing = await Follow.find({ follower: id })
    .populate("following")
    .skip(startIndex)
    .limit(limit)
    .exec();

  // Prepare the paginated following data
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

// Function to edit the user's profile
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

// Function to get the users the user is following
exports.getFollowing = async(id,page,limit)=>
{
  // Calculate the start index for pagination
  const startIndex = (page - 1) * limit;

  // Get the total number of users the user is following
  const totalFollowingCount = await Follow.countDocuments({ follower: id }).exec();

  // Fetch the users the user is following, populate the following data
  const totalFollowing = await Follow.find({ follower: id })
    .populate("following")
    .skip(startIndex)
    .limit(limit)
    .exec();

  // Prepare the paginated following data
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

// Function to get the user's followers
exports.getFollowers = async(id,page,limit) =>
{
  // Calculate the start and end index for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Fetch the followers, populate the following and follower data
  const followers = await Follow.find({ following: id })
    .populate('following')
    .populate('follower')
    .skip(startIndex)
    .limit(limit)
    .exec();

  // Get the total number of followers
  const totalFollowers = await Follow.countDocuments({ following: id });

  // Prepare the paginated followers data
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


// Service function to follow a user
exports.followUser = async (follower_id, following_id) => {
  try {
    // Check if the follow record already exists
    const existingFollow = await Follow.exists({
      follower: follower_id,
      following: following_id,
    });

    // If the record already exists, return false to indicate the user is already being followed
    if (existingFollow) {
      console.log("user already follows the user");
      return false;
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

// Service function to unfollow a user
exports.unfollow = async (follower, following) => {
  try {
    // Delete the follow record corresponding to the given follower and following ids
    const unfollow = await Follow.deleteOne({
      follower,
      following,
    });
    return unfollow;
  } catch (err) {
    console.log("Error deleting the data from the database");
  }
};

// Service function to check if a user is following another user
exports.checkfollowing = async (follower_id, following_id) => {
  try {
    // Find the follow record corresponding to the given follower and following ids
    const followRecord = await Follow.findOne({ follower: follower_id, following: following_id });

    // If the record exists, return true to indicate the user is being followed
    if (followRecord) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(`Error checking follow status: ${err}`);
    return { status: 500, message: "Internal server error" };
  }
};

// Service function to get the follow record for a given follower and following
exports.follow = async (follower, following) => {
  try {
    // Find the follow record corresponding to the given follower and following ids
    const follow = await Follow.findOne({ follower, following });
    return follow;
  } catch (err) {
    console.error(`Error saving follow record: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Service function to remove the profile photo of a user
exports.removeinfophoto = async (id) => {
  try {
    // Find the user with the given id
    const user = await User.findById(id);

    // Set the user's image field to "noprofile.jpg"
    user.image = "noprofile.jpg";
    return user;
  } catch (err) {
    console.error(`Error updating user information: ${err}`);
    return null;
  }
};