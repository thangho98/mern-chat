import multer from "multer";
//handle http request for username and image for upload
const storage = multer.memoryStorage();
export const FileHandler = multer({storage});