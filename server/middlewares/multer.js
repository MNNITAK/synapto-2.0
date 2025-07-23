import multer from "multer";
import { profileStorage } from "../utils/cloudinary.js";

const upload = multer({ storage: profileStorage });
export default upload;