const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const Task = require("../models/Task");
const Connection = require("../models/Connection");
const { log } = require("console");

const addTask = async (req, res) => {
    const { title, description, managerid, clientid, projectid, date } = req.body;

    if (!title || !date || !managerid || !clientid || !projectid) {
        return res.status(400).send("title, connectionid and date are required");
    }

    let fileExist = null;
    let fileData = null;

    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        };

        fileExist = await File.findOne(fileData).lean();
        if (!fileExist) {
            fileExist = await File.create(fileData);
            if (!fileExist) return res.status(400).send("file not created");
        }
    }

    const connection = await Connection.findOne({ clientid, managerid, projectid }).lean();
    if (!connection) return res.status(400).send("connection not found");

    const task = await Task.create({
        title,
        description,
        connectionid: connection._id.toString(),
        date,
        file: fileExist ? fileExist._id : null
    });

    if (!task) return res.status(400).send("task not created");

    const tasks = await Task.find({ connectionid: connection._id }).populate("file").lean();
    res.json(tasks);
};

const updateTask = async (req, res) => {
    const { id, title, description } = req.body
    const file=req.file
    
    if (!title || !id) {
        return res.status(400).send("title id are required")
    }
    const task = await Task.findById(id).exec()
    if (!task) {
        return res.status(400).send("task not found")
    }
    let fileExists = null
    let fileData = null
    if (file) {
        fileData = {
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype
        };
        const tasks = await Task.find({ file: task.file}).lean()
        if (!tasks) {
            return res.status(400).send("tasks not found")
        }
        if (tasks.length === 1) {
            const deletefile = await File.findById(task.file).exec()
            if (!deletefile) {
                return res.status(400).send("deletefile not found")
            }

            const result = await deletefile.deleteOne()
            if (!result) {
                return res.status(400).send("project not deleted")
            }
        }

      
        if (!file.originalname || !file.path || !file.size || !file.mimetype) {
            return res.status(400).send("name type size path are required")
        }
        fileExists = await File.findOne(fileData).lean()
        if (!fileExists) {
            fileExists = await File.create(fileData)
            if (!fileExists) {
                return res.status(400).send("fileExists not created")
            }
        }
    }
    task.title = title
    task.description = description
    task.file = fileExists?fileExists._id:null
    const newTask = await task.save()
    if (!newTask) {
        return res.status(400).send("task not updated")
    }
    const tasks = await Task.find({ connectionid: task.connectionid }).populate("file").lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}



const viewFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
};

const downloadFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    
    if (fs.existsSync(filePath)) {
        
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.download(filePath, (err) => {
            if (err) {
                
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
};

module.exports = { addTask,updateTask,viewFile, downloadFile };