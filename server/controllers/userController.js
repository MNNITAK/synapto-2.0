import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';

export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id; 
    const imageUrl = req.file?.path; // Multer file path

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile image update failed", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const updateDetails = async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, bio } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio },
        { new: true }
      );
  
      res.json(updatedUser);
    } catch (err) {
      console.error("Update failed", err);
      res.status(500).json({ message: "Failed to update user details" });
    }
  };  