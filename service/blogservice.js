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

