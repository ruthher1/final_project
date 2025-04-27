const fs = require('fs');
const multer = require('multer');
const path = require('path');

// הגדרת תיקיית האחסון
const uploadDir = 'uploads/';

// אם תיקיית ה-upload לא קיימת, ניצור אותה
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// הגדרת אחסון הקבצים
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
