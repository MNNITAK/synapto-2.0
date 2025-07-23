import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    required: false 
  },
  google: { 
    type: Boolean, 
    default: false 
  },
 passkey: {

 type: mongoose.Schema.Types.Mixed, 
},
 challenge:{
  type:String
 },

 profileImage: {
  type: String,
  default: "", 
},
git_link:{
  type:String
},
linkedin_link:{
  type:String
},
insta_link:{
  type:String
},
bio: { type: String, default: "" },
resetPasswordOTP: String,
resetPasswordExpires: Date,
  isAdmin: { type: Boolean, default: false },
  phoneNumber: { type: String }, 


}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {           
  if (!this.isModified('password') || !this.password) {          
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password compare method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
