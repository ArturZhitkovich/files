import multer = require("multer");
import path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, ext); // Генерация уникального имени файла
    }
  });

  const upload = multer({ dest: 'uploads/' }).array('files');

  export default { storage, upload };