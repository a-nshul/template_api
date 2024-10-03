const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  phoneNumber:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }
},{timeseries:true});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    next();
  });
  
  const User = mongoose.model("User", userSchema);
  
  module.exports = User;