const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // שמירה בתיקיית uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // שם ייחודי
    }
});

const upload = multer({ storage });

module.exports = upload;
