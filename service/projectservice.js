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
