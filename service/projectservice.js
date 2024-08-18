const Project = require('../models/project');
const ProjectTag = require('../models/projecttag');
const User = require('../models/user');
exports.getProjects = async (id) => {
  try{
    console.log("fetching from database");
    const results = await Project.find({owner:{$ne:id}})
    .populate('owner').populate('tags');
    return results;
  }
  catch(e)
  {
    console.log(e);
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


exports.searchProjects = async(query) =>
{
  const project = Project.find({$title:{$search:query}});
  return project;
}


exports.getMyProject = async (id) => {
  try {
   
    const projects = await Project.find({ owner: id});

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
    .populate("collaborators");
  } catch (error) {
    throw new Error('Error fetching project');
  }
};

exports.getUserProjects = async (userId) => {
  try {
    return await Project.find({ user_id: userId });
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

exports.getfollowingprojects = async() =>
{
  Project.findByIdAndUpdate(projectId,
    {$pull:{requests:userId}},
    {new: true, useFindAndModify: false}
  )
  .then((project) => {
    console.log('Project updated:', project);
  })
  .catch((error) => {
    console.error('Error updating project:', error);
  })
}


exports.getMyProjectbyid = async(id) =>
{
  const project = await Project.findById(id)
  .populate("collaborators")
  .populate("requests")
  return project

}

exports.getcollabration = async(id) =>
{
  try{
  const project = await Project.find({collaborators:id});
  return project
  }
  catch(err)
  {
    console.log(err);
  }
}


exports.deleteproject = async(id) =>
{
  try{
    const project = Project.deleteOne({_id:id})
    return project;

  }
  catch(err)
  {
    console.log(err)
  }
}


