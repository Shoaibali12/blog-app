import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.uploader.upload("test-image.jpg", function (error, result) {
  if (error) {
    console.error("Cloudinary Upload Failed:", error);
  } else {
    console.log("Cloudinary Upload Success:", result);
  }
});
