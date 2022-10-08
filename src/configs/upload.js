const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const tmp_folder = path.resolve(__dirname, "..", "..", "tmp");
const uploads_folder = path.resolve(tmp_folder, "uploads");

console.log(tmp_folder);
console.log(uploads_folder);

const MULTER = {
  storage: multer.diskStorage({
    destination: tmp_folder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);

    }
  })
};

module.exports = { tmp_folder, uploads_folder, MULTER };