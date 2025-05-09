const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const managerMiddleware = require("../middleware/managerMiddleware")
const clientMiddleware = require("../middleware/clientMiddleware")
const userJWT = require("../middleware/userJWT")

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

router.post('/addTask',userJWT,managerMiddleware,upload.single('file'), fileController.addTask);
router.put('/updateTask',userJWT,managerMiddleware,upload.single('file'), fileController.updateTask);
router.get('/files/:fileName',fileController.viewFile);
router.get('/download/:fileName',fileController.downloadFile);
module.exports = router;