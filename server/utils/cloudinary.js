import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});


const FileStorage=new CloudinaryStorage({

  cloudinary,
  params:{
    folder:"file_uploads",
    allowed_formats:["jpg", "png", "jpeg", "gif","pdf"],
  },
})

const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-images",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export { cloudinary, chatStorage, profileStorage,FileStorage };