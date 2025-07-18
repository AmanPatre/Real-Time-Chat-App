import projectModel from "../models/projectModel.js";
import userModel from "./../models/userModel.js";

//create project

const createProject = async (req, res) => {
  const name = req.body.name;
  const userID = req.userID;
  if (!name || !userID) {
    return res.json({
      success: false,
      message: "Project name and user ID are required",
    });
  }
  try {
    const project = new projectModel({
      name: name,
      users: [userID],
    });

    await project.save();
    res.json({
      success: true,
      message: "New Project Created...",
      data: project,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

//get project for the particular user

const getProject = async (req, res) => {
  const id = req.userID;
  try {
    const project = await projectModel.find({
      users: id,
    });

    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project Found", project: project });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

//add users

const addUser = async (req, res) => {
  const proj_id = req.body.proj_id;
  const userID = req.userID;

  if (!proj_id || !userID) {
    return res.json({ success: false, message: "Project ID and user ID are required" });
  }

  try {

    const project = await projectModel.findById(proj_id);

    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    
    if (project.users.includes(userID)) {
      return res.json({ success: false, message: "User already present in the project" });
    }

 
    const updatedProject = await projectModel.findByIdAndUpdate(
      proj_id,
      { $addToSet: { users: userID } },
      { new: true }
    );

    res.json({
      success: true,
      message: "User added to the project",
      updatedProject: updatedProject,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

const addfiletree = async (req, res) => {
  const { proj_id, filetree } = req.body;

  if (!proj_id || !filetree) {
    return res.json({ success: false, message: "Project ID and filetree are required" });
  }

  try {
    const updatedProject = await projectModel.findByIdAndUpdate(
      proj_id,
      { $set: { filetree: filetree } },
      { new: true }
    );

    if (!updatedProject) {
      return res.json({ success: false, message: "Project not found" });
    }

    res.json({
      success: true,
      message: "File tree updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};


export { createProject, getProject, addUser , addfiletree };

