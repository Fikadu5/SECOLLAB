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

