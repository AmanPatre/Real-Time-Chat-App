import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "./reddis.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// signup

const signUp = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.send({ success: false, message: "The user already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter Valid Email" });
    }

    if (password.length < 5) {
      return res.json({
        success: false,
        message: "Password should be atleast 5 characters long",
      });
    }
    const salt = await bcrypt.genSalt(7);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      password: hashedpassword,
      email: email,
    });

    await newUser.save();
    const token = createToken(newUser._id);

    res.send({ success: true, message: "New User created", token: token , data : newUser });
  } catch (error) {
    res.send({ success: false, message: "Some error occured" });
    console.log(error);
  }
};

//login

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No user found with this email Id",
      });
    }

    const cmp = await bcrypt.compare(password, user.password);
    if (!cmp) {
      return res.json({
        success: false,
        message: "Incorrect Password, try again",
      });
    }

    const token = createToken(user._id);
    res.json({ success: true, message: "Login Successfull", token: token , data : user});
  } catch (error) {
    res.json({ success: false, message: "Some Error occured" });
    console.log("Error");
  }
};

//profile

const profile = async (req, res) => {

  const id = req.body.id;
  try {

    const user = await userModel.findById(id);
    if(!user){
      return res.json({success : false , message : "User not found "})
    }

    res.json({success : true , data:{name : user.name , email : user.email , _id : user._id} });


    }

   
  catch (error) {
    res.json({success : false , message : error});
  }
  
};

//logout
const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    console.log(token);
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.json({ success: true, message: "Loged Out Successfully" });
  } catch (error) {
    res.json({ success: false, message: "Logout Unsuccessfull" });
    console.log(error);
  }
};

export { signUp, login, profile, logout };
