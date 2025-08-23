import projectModel from '../modles/project.model.js';
import projectService from '../services/project.service.js';
import{validationResult} from 'express-validator';
import userModel from '../modles/user.model.js';

export const createProject = async (req, res) => {
const errors = validationResult(req);   // <-- FIXED here

  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
  const {name}=req.body;
  const loggedUser=await userModel.findOne({email:req.user.email});

  const userId=loggedUser._id;

  const newProject=await projectService.createProject({name,userId});
  return res.status(201).json(newProject);
  }catch(error){
    return res.status(500).json({error:error.message});
  }
};
export const getAllProjects=async(req,res)=>
{
    try
    {
        const loggedInUser=await userModel.findOne({email:req.user.email});
       
        const allUserProjects=await projectService.getAllProjects({userId:loggedInUser._id});
        return res.status(200).json({
            projects:allUserProjects});
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).json({error:error.message});
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const getProjectById=async(req,res)=>
{
    const { projectId } = req.params;
    try{
 const project=await projectService.getProjectById({projectId})
 return res.status(200).json({project});
    }
    catch(error)
    {
        console.log(error)
        res.status(400).json({error:error.message})
    }
}
