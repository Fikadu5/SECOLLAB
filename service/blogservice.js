const Blog = require('../models/blog');
const {User,Follow} = require('../models/user');
const userService = require('../services/userservice');
const BlogTag = require("../models/Blogtag")




exports.getsearchresult = async (query) => {
  try {
     if (!query || query.trim() === '') {
      return []; // Return an empty array if the query is empty
    }
    const blogs = await Blog.find({
      $text: { $search: query }
    }).lean(); 
    return blogs;
  } catch (err) {
    console.error('Error searching projects:', err);
    throw err;
  }
};


exports.getCurrentUser = async(id)=>
{
  const user = await User.find({_id:id});
  return user
}

exports.getMyBlogs = async (id, page, limit) => {
  try {
    return await Blog.find({ owner: id })
      .populate("owner")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  } catch (error) {
    throw new Error('Error fetching blogs');
  }
}
exports.getBlogs = async(id) =>
{
   const blogs = await Blog.find({owner:{$ne:id}})
   .populate("tags")
   .populate("owner");

  return blogs;
}
exports.getTopBlogs = async (page, limit,id) => {
  try {
    const blogs = await Blog.find({owner:{$ne:id}})
      .populate("tags")

      .sort({ like: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();


    return blogs;
  } catch (err) {
    console.error("Error fetching top blogs:", err);
    throw new Error("Error fetching top blogs");
  }
};

exports.getRandomBlogs = async (userId, page, limit) => {
  try {
    // Step 1: Aggregate to get raw blog IDs
    const blogIds = await Blog.aggregate([
      { $match: { owner: { $ne: userId } } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { _id: 1 } } // Only get the IDs of the blogs
    ]);

    const ids = blogIds.map(blog => blog._id); // Extract IDs

    // Step 2: Fetch and populate the blogs using Mongoose's find method
    const populatedBlogs = await Blog.find({ _id: { $in: ids } })
      .populate('tags') // Populate the tags field
      .exec();

    return populatedBlogs;
  } catch (err) {
    console.error('Error getting random blogs:', err);
    throw err;
  }
};
exports.deleteBlog = async(id, userid) =>{
  try{
  const blog = Blog.deleteOne({_id:id,owner:userid})
  return blog;
  }
  catch(err)
  {
    console.log(`Error from fetchinf the database ${err}`)
  }
}


exports.getBlogById = async (blogId) => {
  try {
    
    const blog =  await Blog.findById(blogId).populate("owner").populate("tags")
    console.log(blog)
    return blog
  } catch (error) {
    throw new Error('Error fetching blog', error);
  }
};


exports.createBlog = async (title, subtitle, content, userId,checkedOptions,image) => {
 if(image)
 {
  const blog = new Blog({
    title,
    subtitle,
    body: content,
    owner: userId,
    image,
    tags:checkedOptions,
  });

  try {
    await blog.save();
  } catch (error) {
    throw new Error('Error creating blog');
  }

 }
 else{
  const blog = new Blog({
    title,
    subtitle,
    body: content,
    owner: userId,
    
    tags:checkedOptions,
  });

  try {
    await blog.save();
  } catch (error) {
    throw new Error('Error creating blog');
  }

 }

  
};

exports.updateBlogById = async (blogId, title, subtitle, content) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, subtitle, body: content },
      { new: true } // This option ensures that the returned document is the updated one.
    );
    return updatedBlog;
  } catch (error) {
    throw new Error('Error updating blog');
  }
};

exports.getUserBlogs = async (userId,page,limit) => {
  try {
    const blogs = await Blog.aggregate([
      { $match: { user_id: userId} }, // Exclude blogs by the current user
      { $sample: { size: 1000 } }, // Get a large random sample to paginate from
      { $skip: (page - 1) * limit }, // Skip the first (page - 1) * limit blogs
      { $limit: limit } // Limit to the specified number of blogs
    ]);
    return blogs
     
  } catch (error) {
    throw new Error('Error fetching user blogs');
  }
};



exports.getFollowingBlogs = async (userId) => {
  try {
    // 1. Find all users that the given user is following
    const followings = await Follow.find({ follower: userId }).populate('following').exec();
    
    // Extract the following users' IDs
    const followingUserIds = followings.map(follow => follow.following._id);

    if (followingUserIds.length === 0) {
      return []; // No blogs if the user is not following anyone
    }

    // 2. Fetch blogs written by the following users
    const blogs = await Blog.find({ owner: { $in: followingUserIds } }).populate('owner').populate('tags').exec();

    // Return the blogs
    return blogs;
  } catch (err) {
    console.error('Error fetching following blogs:', err);
    throw err;
  }
};


exports.addorremovelike = async (blogid,userid) => {
  console.log("in the service")
  // const userid = await req.user._id;
  // console.log(userid);
  try{
  
    const blog = await Blog.findById(blogid);
  
    if (!blog) {
      console.log("Blog not found");
      throw new Error("Blog not found");
    }
  
    if (blog.likedby.includes(userid)) {
      console.log("like decremented");
      blog.like--;
      blog.likedby.pull(userid);
      await blog.save();
      return 200
    } else {
      console.log("like incremented");
      blog.like++;
      blog.likedby.push(userid);
      await blog.save();
      return 201
    }
  }
   catch (err) {
    console.log(err);
    throw err;
  }}


  exports.checklike = async(id,userid) =>
  {
    
 const blog =  await Blog.findById(id)
 if(blog.likedby.includes(userid))
 {
  return 200
   
 }
 else{
  return 201
  
 }
  }
 



exports.gettags = async() =>
{
  const tags = await BlogTag.find();
  if(tags)
  {
  return tags;
  }
  else{
    console.log("problem fetching from the database");
  }


}

exports.newtag = async(name,slug) =>
{
  try{
  const Blogtag = new BlogTag({
    name,
    slug
  })
  Blogtag.save()
  return Blogtag
}
catch(err)
{
  console.log(err)
  throw(err)
}
  
}


exports.getcatblogs = async(name) =>
{
  const blogtag = await BlogTag.findOne({ name: name });
if (!blogtag) {
  console.log("Tag not found");
  return; // Exit if the tag doesn't exist
}
console.log(blogtag._id); // Should log a valid ObjectId

const blogs = await Blog.find({ tags: { $in: [blogtag._id] } }).sort({ created_at: 1 }).populate("tags");
console.log(blogs); // Check if any blogs are returned


if (blogs) {
  // Blog found with the specified tag
  return blogs
} else {
  // Blog not found with the specified tag
  console.log("blog not found")
  
}
}
