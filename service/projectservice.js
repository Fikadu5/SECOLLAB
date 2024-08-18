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

