const Task = require("../models/Task")
const User = require("../models/User")
const File = require("../models/File")
const Connection = require("../models/Connection")

const addTask = async (req, res) => {
    console.log("addTask");
    
    const { title, description, managerid, clientid, projectid, date } = req.body
    const file=req.file
    if (!title || !managerid || !clientid || !projectid || !date) {
        return res.status(400).send("title clientid managerid projectid date are required")
    }
    // console.log(req.file)
    let fileExists=null
    let fileData=null
    // console.log(file);
    if (file) {
        fileData = {
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype
        };
        if (!file.originalname || !file.path || !file.size || !file.mimetype) {
            return res.status(400).send("name type size path are required")
        }
        
        fileExists = await File.findOne(fileData).lean()
        if (!fileExists) {
            console.log("הקובץ לא קים ומוסיף אותו");
            fileExists = await File.create(fileData)
            if (!fileExists) {
                return res.status(400).send("fileExists not created")
            }
        }
    }
    const connection = await Connection.findOne({ clientid, projectid, managerid }).lean()
    if (!connection) {
        return res.status(400).send("connection ient not found")
    }
    const task = await Task.create({ title, connectionid: connection._id.toString(), description, date, file: fileExists?._id })
    if (!task) {
        return res.status(400).send("task not created")
    }

    const tasks = await Task.find({ connectionid: connection._id }).populate("file").lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }

    res.json(tasks)
}



const getTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).populate("file").lean()
    if (!task) {
        return res.status(400).send("task not found")
    }
    res.json(task)
}


const getTasksClient = async (req, res) => {
    const { projectid, managerid, clientid } = req.params
    if (!projectid || !clientid || !managerid) {
        return res.status(400).send("managerid projectid clientid are required")
    }
    const connection = await Connection.findOne({ projectid, managerid, clientid }).lean()
    if (!connection) {
        return res.status(400).send("connection not found")
    }
    const tasks = await Task.find({ connectionid: connection._id }).populate("file").lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

const getTasks = async (req, res) => {
    const { clientid } = req.params;
    if (!clientid) {
        return res.status(400).send("clientid is required");
    }
    const connections = await Connection.find({ clientid }).lean();
    if (!connections.length) {
        return res.status(400).send("Connections not found");
    }
    const connectionIds = connections.map(c => c._id);
    const allTasks = await Task.find({ connectionid: { $in: connectionIds } }).populate({  path: "connectionid",  populate: [ { path: "managerid" }, { path: "projectid" }]})  .populate("file").lean();
    if (!allTasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(allTasks);
};
const getAllManagerTasks = async (req, res) => {
    const { managerid } = req.params;
    if (!managerid) {
        return res.status(400).send("managerid is required");
    }
    const connections = await Connection.find({ managerid }).lean();
    if (!connections.length) {
        return res.status(400).send("Connections not found");
    }
    const connectionIds = connections.map(c => c._id);
    const allTasks = await Task.find({ connectionid: { $in: connectionIds } }).lean();
    if (!allTasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(allTasks);
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

const completeTask = async (req, res) => {
    const { id, completed, difficulty, comment ,clientid} = req.body
    if (!id||!clientid) {
        return res.status(400).send("id clientid is required")
    }
    const task = await Task.findById(id).exec()
    if (!task) {
        return res.status(400).send("task not found")
    }
    task.completed = completed
    task.difficulty = difficulty
    task.comment = comment
    const newTask = await task.save()
    if (!newTask) {
        return res.status(400).send("task not updated")
    }
    const connections = await Connection.find({clientid}).lean();
    if (!connections.length) {
        return res.status(400).send("Connections not found");
    }
    const connectionIds = connections.map(c => c._id);
    const allTasks = await Task.find({ connectionid: { $in: connectionIds } }).populate({  path: "connectionid",  populate: [ { path: "managerid" }, { path: "projectid" }]})  .populate("file").lean();
    if (!allTasks) {
        return res.status(400).send("tasks not found")
    }

    res.json(allTasks)
}

const deleteTask = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).send("id is required")
    }

    const task = await Task.findById(id).exec()
    if (!task) {
        return res.status(400).send("task not found")
    }
    if (task.file) {
        const tasks = await Task.find({ file: task.file._id }).lean()
        if (!tasks) {
            return res.status(400).send("tasks not found")
        }
        if (tasks.length === 1) {
            const file = await File.findById(task.file._id).exec()
            if (!file) {
                return res.status(400).send("file not found")
            }

            const result = await file.deleteOne()
            if (!result) {
                return res.status(400).send("project not deleted")
            }
        }
    }
    const result = await task.deleteOne()
    const tasks = await Task.find({ connectionid: task.connectionid }).populate("file").lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

module.exports = { getTasks, addTask, getTask, updateTask, deleteTask, completeTask, getTasksClient ,getAllManagerTasks}
