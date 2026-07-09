const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hypehub/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

const fileFilter = (req,res,cb) =>{
  const allowedTypes = ["image/jpeg","image/jpg","image/png","image/webp"]

  if(allowedTypes.includes(file.mimetype)){
    cb(null,true);
  }else{
    cb(new Error("Only JPG, PNG and WEBP images are allowed"),false)
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

module.exports = upload;