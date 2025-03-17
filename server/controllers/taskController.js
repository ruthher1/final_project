const Task = require("../models/Task")
const User = require("../models/User")
const Connection = require("../models/Connection")
const addTask = async (req, res) => {    
    const { title, description, managerid,clientid,projectid, amount, date } = req.body
    if (!title || !managerid||!clientid||!projectid || !amount || !date ) {
        return res.status(400).send("title connectionid amount date are required")
    }

    const connection = await Connection.findOne({clientid,projectid,managerid}).lean()
    if (!connection) {
        return res.status(400).send("connection ient not found")
    }

    const task = await Task.create({ title, connectionid:connection._id.toString(), description, amount, date })
    if (!task) {
        return res.status(400).send("task not created")
    }

    const tasks = await Task.find({ connectionid:connection._id }).lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }

    res.json(tasks)
}



const getTask = async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id).lean()
    if (!task) {
        return res.status(400).send("task not found")
    }
    res.json(task)
}

const getTasksManager = async (req, res) => {
    const { connectionid } = req.body
    if (!connectionid) {
        return res.status(400).send("connectionid is required")
    }
    const tasks = await Task.find({ connectionid }).lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

const getTasksClient = async (req, res) => {
    const { projectid,managerid, clientid } = req.params
    if (!projectid || !clientid ||!managerid) {
        return res.status(400).send("managerid projectid clientid are required")
    }
    const connection=await Connection.findOne({ projectid,managerid, clientid}).lean()
    if(!connection){
        return res.status(400).send("connection not found")
    }
    const tasks = await Task.find({ connectionid:connection._id}).lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

const updateTask = async (req, res) => {
    const { id, title, description, amount } = req.body
    if (!title || !id || !amount ) {
        return res.status(400).send("title id amount are required")
    }
    const task = await Task.findById(id).exec()
    if (!task) {
        return res.status(400).send("task not found")
    }
    task.title = title
    task.description = description
    task.amount = amount
    const newTask = await task.save()
    if (!newTask) {
        return res.status(400).send("task not updated")
    }
    const tasks = await Task.find({ connectionid: task.connectionid }).lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

const completeTask = async (req, res) => {
    const { id, completed, difficulty, comment } = req.body
    if (!id || !completed, !difficulty) {
        return res.status(400).send("compleated difficulty id are required")
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
    const tasks = await Task.find({ connectionid:task.connectionid, date: task.date }).lean();
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
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
    const result = await task.deleteOne()
    const tasks = await Task.find({ connectionid: task.connectionid}).lean()
    if (!tasks) {
        return res.status(400).send("tasks not found")
    }
    res.json(tasks)
}

module.exports = { addTask, getTask, getTasksManager, updateTask, deleteTask, completeTask,getTasksClient }