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

exports.getsearchresult = async(req,res) =>
{

}

exports.getProjects = async(req,res) =>
{

    const projects = projectservice.getProjects(req.user._id)
    res.render("project",{projects})
}


exports.getMyProjects = async(req,res) =>
{

    const id = req.user._id;
    const project = await projectservice.getMyProject(id);




    res.render("myproject",{project})



}

exports.getmycollabration = async(req,res) =>
{
    const id = req.user._id;
    const projects = projectservice.getcollabration(id)


    res.render("mycollabration",{projects})
}


exports.searchProjects = async(req,res) =>

{


    res.render("searchproject")

}
exports.searchResults = async(req,res) =>

{


    res.render("")
}

exports.getProjectById = async(req,res) =>

{
    const project = await projectservice.getProjectById(req.params.id);


    res.render("specficproject",{project})
}


exports.getProjects = async(req,res) =>
{


    const projects = await projectservice.getProjects()
    res.render("project",{projects})

}

exports.getmyprojectwithid = async(req,res) =>
{
    const project = await projectservice.getMyProjectbyid(req.params.id);
   res.render("interestinmyproject",{project})
}
exports.getFollowingProjects = async(req,res) =>
{
    const projects = await projectservice.getfollowingprojects(req.user._id)

    res.render("projects",{projects})

}

exports.deleteproject = async(req,res) =>
{
    const id = req.params.id
    const del = projectservice.deleteproject(id);
    if(del)
    {
        req.flash("successfully delted the project")
        res.redirect("/projects/myprojects")
    }
    else{
        req.flash("project deletion not successful")
        res.redirect("/projects/myprojects")
    }


}

