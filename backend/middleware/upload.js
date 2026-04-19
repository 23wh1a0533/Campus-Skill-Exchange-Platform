const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const createUploader = (allowedExtensions, allowedMimeTypes) => {
  const fileFilter = (req, file, cb) => {
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error('Unsupported file type'));
  };

  return multer({ storage, fileFilter });
};

const avatarUpload = createUploader(/\.((jpeg)|(jpg)|(png)|(gif))$/, /image\/(jpeg|jpg|png|gif)/);
const chatUpload = createUploader(
  /\.((jpeg)|(jpg)|(png)|(gif)|(pdf)|(doc)|(docx)|(txt)|(zip))$/,
  /(image\/(jpeg|jpg|png|gif))|(application\/pdf)|(application\/msword)|(application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|(text\/plain)|(application\/zip)|(application\/x-zip-compressed)/
);

module.exports = { avatarUpload, chatUpload };
