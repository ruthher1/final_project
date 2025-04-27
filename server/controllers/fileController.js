// const Task = require("../models/Task")
// const File = require("../models/File")



// const addFile = async (file) => {
//     const fileName=file.fileName
//     const filePath=file.filePath
//     const fileSize=file.fileSize
//     const fileType=file.fileType
//     if (!file.fileName || !file.filePath || !file.fileSize || !file.fileType) {
//         return ("name type size path are required")
//     }
//     let fileExists = await File.findOne({fileName,filePath,fileSize,fileType}).lean()
//     if (!fileExists) {
//         fileExists = await File.create({fileName,filePath,fileSize,fileType})
//         if (!fileExists) {
//             return ("fileExists not created")
//         }
//     }
//    return (fileExists)
// }

// const getFile = async (id) => {
//     // const { id } = req.params
//     const file = await File.findById(id).lean()
//     if (!file) {
//         return res.status(400).send("file not found")
//     }
//     res.json(file)
// }

// const deleteFile = async (id) => {
//     // const { id } = req.params
//     if (!id) {
//         return("id is required")
//     }
//     const tasks = await Task.find({ fileid: id }).lean()
//     if (!tasks) {
//         return ("tasks not found")

//     }
//     if (tasks.length > 1) {
//         return ("file did not delete because it existed in another task")
//     }
//     const file = await File.findById(id).exec()
//     if (!file) {
//         return("file not found")
//     }

//     const result = await file.deleteOne()
//     if (!result) {
//         return ("project not deleted")
//     }
//     return (result)
// }



// module.exports = { getFile, addFile, deleteFile }

// const multer = require("multer");
// const path = require("path");

// // הגדרת אחסון הקבצים
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // שמירה בתיקיית uploads
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // שם ייחודי
//     }
// });

// const upload = multer({ storage });

// module.exports = upload;