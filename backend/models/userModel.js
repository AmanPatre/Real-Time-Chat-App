import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength : [6 , "Email must be atleat 6 characters long"],
    maxLength : [50 , "Email must be at max 50 characters long"]
  },
  password: { type: String, required: true },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
