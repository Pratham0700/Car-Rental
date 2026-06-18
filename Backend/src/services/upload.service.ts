import type { Request, Response } from "express";
import multer from "multer";
import {cloud_name,api_key,api_secret} from '../config/AppConfig'
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  resBadRequest,
  resSuccess,
  resUnknownError,
} from "../utils/shareFunction";
const IMAGE_FILE_SIZE = 2 * 1024 * 1024;
const IMAGE_MIMETYPE = ["image/jpg", "image/jpeg", "image/png"];
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

class FileFilterError extends multer.MulterError {
  constructor(message: string) {
    super("LIMIT_UNEXPECTED_FILE");
    this.name = "FileFilterError";
    this.message = message;
  }
}
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "wheeler",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: file.fieldname + "-" + Date.now(),
    };
  },
});

const multerImageFile = multer({
  storage: storage,
  limits: {
    fileSize: IMAGE_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (IMAGE_MIMETYPE.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new FileFilterError("Only JPG, JPEG and PNG files are allowed"));
    }
  },
}).single("profileimage");

export const upload =  (req: Request, res: Response) => {
  multerImageFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.name === "FileFilterError") {
        const response = resBadRequest({
          message: "Only JPG, JPEG and PNG files are allowed",
        }); //400
        return res.status(response.code).json(response);
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        const response = resBadRequest({
          message: "File Size is too large. Max 2MB allowed",
        }); //400
        return res.status(response.code).json(response);
      }
      const response = resUnknownError({
        message: "File upload error",
        data: err.message,
      });
      return res.status(response.code).json(response); //500
    }
     if (err instanceof Error) {
      const response = resUnknownError({
        message: "An unknown error occurred! Please try again.",
        data: err.message,
      });
      return res.status(response.code).json(response); //500
    }

    // No file uploaded
    if (!req.file) {
      const response = resBadRequest({ message: "No file uploaded" }); //400
      return res.status(response.code).json(response);
    }
    const response = resSuccess({
      message: "File uploaded successfully",
      data: { imagePath: req.file.path },
    }); //200
    return res.status(response.code).json(response);
  });
};
