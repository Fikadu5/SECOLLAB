const ProjectTag = require('../models/projecttag');
const projectService = require('../services/projectservice');


exports.getProjects = async (req, res) => {

    try {
      const projects = await projectService.getProjects(req.user._id);
      res.render('project', { projects, messages: {
        success: req.flash('success'),
        error: req.flash('error')
      } });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).send('Internal Server Error');
    }

};


exports.newproject = async(req,res) =>
{
  const tags = await projectService.gettags();

  res.render('addproject',{tags});
}
exports.createProject = async (req, res) => {
    const checkedOptions = req.body.myCheckboxes || [];
    const projectDetails = req.body;
    try {
      await projectService.createProject(projectDetails, req.user._id,checkedOptions);
      res.redirect('/projects/myprojects');
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).send('Internal Server Error');
    }

};
exports.getcatagories = async(req,res) =>
  {
    const tags = await projectService.gettags();
    res.render("projectcatagories",{tags})
  }
