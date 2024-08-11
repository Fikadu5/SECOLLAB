const Blog = require('../models/blog');
const {User,Follow} = require('../models/user');
const userService = require('../services/userservice');




exports.getsearchresult = async(query) =>
{
  const blogs = await Blog.find({$title:{$search:query}})
  return blogs;
}


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
   const blogs = await Blog.find({owner:{$ne:id}});

  return blogs;
}
exports.getTopBlogs = async (page, limit) => {
  try {
    const blogs = await Blog.find()
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
    const blogs = await Blog.aggregate([
      { $match: { owner: { $ne: userId } } }, // Exclude blogs by the current user
      { $sample: { size: 1000 } }, // Get a large random sample to paginate from
      { $skip: (page - 1) * limit }, // Skip the first (page - 1) * limit blogs
      { $limit: limit } // Limit to the specified number of blogs
    ]);

    return blogs;
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
    return await Blog.findById(blogId).populate("owner");
  } catch (error) {
    throw new Error('Error fetching blog', error);
  }
};

exports.createBlog = async (title, subtitle, content, userId,image) => {
  const blog = new Blog({
    title,
    subtitle,
    body: content,
    owner: userId,
    image
  });

  try {
    await blog.save();
  } catch (error) {
    throw new Error('Error creating blog');
  }
};

exports.updateBlogById = async (blogId, title, subtitle, content) => {
  try {
    await Blog.findByIdAndUpdate(blogId, { title, subtitle, body: content });
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


exports.getFollowingBlogs = async(id) =>
{
  const following = await Follow.find({ follower: id });
  const blogs = await Blog.find();
  const matchingTags = following.filter(f =>
    blogs.some(blog =>
      blog.userid.some(tag => f.followings.includes(following))
    )
  );
  

}

exports.addorremovelike = async (req,res,id,userid) => {
  console.log("in the service")
  // const userid = await req.user._id;
  // console.log(userid);

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      console.log("Blog not found");
      throw new Error("Blog not found");
    }

    if (blog.likedby.includes(userid)) {
      console.log("like decremented");
      blog.like--;
      blog.likedby.pull(userid);
      await blog.save();
      return false;
    } else {
      console.log("like incremented");
      blog.like++;
      blog.likedby.push(userid);
      await blog.save();
      return true;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
