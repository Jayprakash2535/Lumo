import projectModel from '../modles/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../modles/user.model.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
export const createProject=async({name, userId})=>{
   if(!name) throw new Error("Project name is required");
   if(!userId) throw new Error("User ID is required");

   const Project = new projectModel({name, users: [userId]});
   await Project.save();
   return Project;
}

export const getAllProjects = async ({userId}) => {
   if (!userId) throw new Error("User ID is required");

   const allUserProjects = await projectModel.find({ users: userId });
   return allUserProjects;
};
export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) {
        throw new Error('UserId is required')
    }

    const allUserProjects = await projectModel.find({
        users: userId
    })

    return allUserProjects
}

export const addUsersToProject = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }


    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    console.log(project)

    if (!project) {
        throw new Error("User not belong to this project")
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    })

    return updatedProject



}

export const getProjectById=async({projectId})=>{
   if(!projectId) throw new Error("Project ID is required");
   if(!mongoose.Types.ObjectId.isValid(projectId)) {
       throw new Error("Invalid Project ID");
   }

   const project=await projectModel.findOne({
    _id:projectId
   }).populate('user')

   return project;
}

export default { createProject, getAllProjects ,addUsersToProject,getProjectById};