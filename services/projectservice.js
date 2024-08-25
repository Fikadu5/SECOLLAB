const Project = require('../models/project');
const ProjectTag = require('../models/projecttag');
const {User,Follow} = require('../models/user');




exports.getfollowingprojects = async(userId) =>
{
   // 1. Find all users that the given user is following
   const followings = await Follow.find({ follower: userId }).populate('following').sort({ createdAt: -1 }).exec();
    
   // Extract the following users' IDs
   const followingUserIds = followings.map(follow => follow.following._id);

   if (followingUserIds.length === 0) {
     return []; // No blogs if the user is not following anyone
   }
   const projects = await Project.find({owner:{$in:followingUserIds}}).populate("owner").populate("tags")
   return projects;

}


exports.getProjects = async (id) => {
  try{
    console.log("fetching from database");
    const results = await Project.find({owner:{$ne:id}})
    .populate('owner').populate('tags').sort({ createdAt: -1 });
    return results;
  }
  catch(e)
  {
    console.log(e);
  }
};




exports.registerInterest = async (projectId, userId) => {
 
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return false
    }
    if (project.requests.includes(userId)) {
      
      console.log("Interest already registered");
      return FileSystemWritableFileStream;
    }
    if(project.collaborators.includes(userId))
    {
      
      console.log("already in the team");
      return false
    }
    
    project.requests.push(userId);
    await project.save();
    
    console.log("Interest registered successfully");
    return true
  } catch (err) {
    console.log(err);
   
    return false
  }
};
exports.createProject = async (projectDetails,user_id,checkedOptions) => {
  const project = new Project({
    title:projectDetails.name,
    owner: user_id,
    description:projectDetails.description,
    dueDate:projectDetails.date,
    looking_for: projectDetails.lookingfor,
    requirment:projectDetails.requirment,
    tags:checkedOptions
  });

  try {
    await project.save();
  } catch (error) {
    throw new Error('Error creating project',error);
  }
};
exports.gettags = async() =>
  {
    const tags = await ProjectTag.find();
    return tags

  } 





exports.searchProjects = async(query) => {
  try {
    const projects = await Project.find({
      $text: { $search: query }
    });
    return projects;
  } catch (err) {
    console.error('Error searching projects:', err);
    throw err;
  }
}


exports.getMyProject = async (id) => {
  try {
   
    const projects = await Project.find({ owner: id}).sort({ createdAt: -1 });

    // If projects are found, send them back to the client
    if (projects) {
      console.log("project found")
      // res.status(200).json(projects);
        return projects
    } else {
      // If no projects are found, send an appropriate message
      console.log("no project is found")
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    console.log("An error occurred while fetching projects.", error );
  }
};


exports.getProjectById = async (projectId) => {
  try {
    return await Project.findById(projectId)
    .populate("owner")
    .populate("tags")
    .populate("requests")
    .populate("collaborators")
    .sort({ createdAt: -1 })
  } catch (error) {
    throw new Error('Error fetching project');
  }
};


exports.getUserProjects = async (userId) => {
  try {
    if(userId == null)
    {
      throw new Error('Error fetching user projects')
    }
    return await Project.find({ user_id: userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error fetching user projects');
  }
};
exports.getProject = async() =>
{
  try{
    return await project.find().limit(5).populate("tags");
  }
  catch(error)
  {
  throw new Error("Error fetching projects");
  }
}





exports.acceptinterest = async(projectid,userId) =>
{
 
  try {
    const project = await Project.findById(projectid);
    if (!project) {
      return false
    }
    if(project.owner == userId)
    {
      return false
    }
    if (project.collaborators.includes(userId)) {
      console.log("already in the team");
      return false
    }
    project.collaborators.push(userId);
    project.requests.pull(userId);
    await project.save();
    console.log("Successfully saved");
    return false
  } catch (err) {
    console.log(err);
    return false
  }
} 


exports.getMyProjectbyid = async(id) =>
{
  const project = await Project.findById(id)
  .populate("collaborators")
  .populate("requests")
  .sort({ createdAt: -1 })
  return project

}

exports.getcollabration = async(id) =>
{
  try{
  let project =[]
  const projects = await Project.find().sort({ createdAt: -1 });
    projects.forEach(async(p) =>
    {
      if( p.collaborators.includes(id))
      {
        project.push(p);
      }
    })
  
  return project
  }
  catch(err)
  {
    console.log(err);
  }
}


exports.deleteproject = async (id) => {
  try {
    const result = await Project.deleteOne({ _id: id });
    return result;
  } catch (err) {
    console.error('Error deleting project:', err);
    throw err; // Re-throw the error to be handled by the caller or the test
  }
};
exports.get_catblogs= async(name) =>

  {
    console.log(name)
    const projecttag = await ProjectTag.findOne({ name: name });
if (!projecttag) {
  console.log("Tag not found");
  return; // Exit if the tag doesn't exist
}
console.log(projecttag._id); // Should log a valid ObjectId

const projects = await Project.find({ tags: { $in: [projecttag._id] } }).sort({ created_at: 1 }).populate("tags");
console.log(projects); // Check if any blogs are returned


if (projects) {
  // Blog found with the specified tag
  return projects
} else {
  // Blog not found with the specified tag
  console.log("project not found")
  
}


  }