const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// cloudinary.api.resources({
//   type: "upload",
//   prefix: "WanderLust_DEV/"
// }).then(res => console.log(res))
//   .catch(err => console.error(err));


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "WanderLust_DEV",
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});


module.exports = {
  cloudinary,
  storage,
};
