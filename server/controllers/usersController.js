const Connection = require("../models/Connection")
const Project = require("../models/Project")
const ProjectToManager = require("../models/ProjectToManager")
const Task = require("../models/Task")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const { addProject } = require("./projectController")

const addManager = async (req, res) => {
    const { name, userid, password, address, phone, email, projectName } = req.body
    if (!name || !userid || !password || !phone || !projectName) {
        return res.status(400).send("name userid password projectName phone are required")
    }

    const user = await User.findOne({ userid: userid, role: 'manager' }).lean()
    if (user) {
        return res.status(400).send("manager exists")
    }
    const newpass = await bcrypt.hash(password, 10)
    const manager = await User.create({ name, userid, password: newpass, address, phone, email, role: 'manager' })
    if (!manager) {
        return res.status(400).send("manager not created")
    }

    let prjectExists = await Project.findOne({ name: projectName }).lean()
    if (!prjectExists) {
        prjectExists = await Project.create({ name: projectName })
        if (!prjectExists) {
            return res.status(400).send("project not created")
        }
    }

    const projectToManager = await ProjectToManager.create({ managerid: manager._id, projectid: prjectExists._id })
    if (!projectToManager) {
        return res.status(400).send("projectToManager not created")
    }
    return res.json(manager)
}

const addClient = async (req, res) => {
    const { name, userid, password, address, phone, email, managerid, projectid } = req.body
    if (!name || !userid || !password || !phone || !managerid || !projectid) {
        return res.status(400).send("name userid managerid projectid password phone are required")
    }
    const projectToManager = await ProjectToManager.findOne({ managerid, projectid }).lean()
    if (!projectToManager) {
        return res.status(400).send("projectToManager not found")
    }
    let user = await User.findOne({ userid: userid, role: 'client' }).lean()
    if (user) {
        const client = await Connection.create({ managerid, projectid, clientid: user._id })
        if (!client) {
            return res.status(400).send("client not created")
        }
    }
    else {
        const newpass = await bcrypt.hash(password, 10)
        user = await User.create({ name, userid, password: newpass, address, phone, email, role: "client" })
        if (!user) {
            return res.status(400).send("user not created")
        }
        const client = await Connection.create({ managerid, projectid, clientid: user._id })
        if (!client) {
            return res.status(400).send("client not created")
        }
    }
    return res.json(user)
}

const getManagerClients = async (req, res) => {
    const { id } = req.params
    if(!id)
    {
        return res.status(400).send("id is requiered")
    }
    const clients = await Connection.find({ managerid: id }).populate("clientid").populate("projectid").lean()
    if (!clients)
        return res.status(400).send("clients not found")
    const uniqueArray = [...new Set(clients)];
    res.json(uniqueArray)

}
const getClientManagers=async(req,res)=>{
    const { id } = req.params
    if(!id)
        {
            return res.status(400).send("id is requiered")
        }
    const managers = await Connection.find({ clientid: id}).populate("managerid").lean()
    if (!managers)
        return res.status(400).send("managers not found")
    const uniqueArray = [...new Set(managers)];
    res.json(uniqueArray)
}
const getClient = async (req, res) => {
    const { id, projectid } = req.body
    const user = await User.findById(id).lean()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const manager = await ProjectToManager.findOne({ projectid }).lean()
    if (!manager) {
        return res.status(400).send("manager not found")
    }
    const connection = await Connection.findOne({ clientid: id, managerid: manager.managerid.toString(), projectid: projectid }).lean()
    if (!connection) {
        return res.status(400).send("connection not found")
    }
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const tasks = await Task.find({ connectionid: connection._id, date: formattedDate }).lean()
    if (!tasks)
        return res.status(400).send("tasks not found")
    res.json(tasks)

}
const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).lean()
    if (!user) {
        return res.status(400).send("user not found")
    }
    res.json(user)
}

const getProjectClients = async (req, res) => {
    const { projectid, managerid } = req.params
    if (!managerid || !projectid) {
        return res.status(400).send("managerid and projectid are required")
    }
    const clientsOfProject = await Connection.find({ managerid: managerid, projectid: projectid }).populate("clientid").populate("projectid").lean();
    if (!clientsOfProject)
        return res.status(400).send("clientsOfProject not found")
    res.json(clientsOfProject)
}


const updateUser = async (req, res) => {
    
    const { id, name, address, phone, email } = req.body
    if (!name || !id || !phone || !email) {
        return res.status(400).send("name phone email id are required")
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).send("user not found")
    }
    user.name = name
    user.address = address
    user.phone = phone
    user.email = email
    const newUser = await user.save()
    if (!newUser) {
        return res.status(400).send("newUser not updated")
    }
    res.json(newUser)
}

const changePassword = async (req, res) => {
    
    const { id,password ,newpassword} = req.body

    if (!password || !id || !newpassword) {
        return res.status(400).send("newpassword id password are required")
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const match = await bcrypt.compare(password, user.password)    
        if(!match)
            return res.status(400).send("password not correct")
    const newpass = await bcrypt.hash(newpassword, 10)
    user.password = newpass
    const newUser = await user.save()
    if (!newUser) {
        return res.status(400).send("newUser not updated")
    }
    res.json(newUser)
}

const deleteClient = async (req, res) => {
    const { id, managerid, projectid } = req.body
    if (!id || !managerid || !projectid) {
        return res.status(400).send("id managerid projectid is required")
    }
    const connection = await Connection.findOne({ clientid: id, managerid, projectid }).exec()
    if (!connection) {
        return res.status(400).send("connection not found")
    }
    const result = await connection.deleteOne()
    if (!result) {
        return res.status(400).send("connection not deleted")
    }
    const user = await Connection.findOne({ clientid: id }).exec()
    if (!user) {
        const client = await User.findById(id).exec()
        if (!client) {
            return res.status(400).send("client not found")
        }
        const result = await client.deleteOne()
        if (!result) {
            return res.status(400).send("client not deleted")

        }
    }
    const deleteTask = await Task.deleteMany({ connectionid: connection._id }).exec()
    if (!deleteTask) {
        return res.status(400).send("tasks not deleted")
    }
    const clients = await Connection.find({ managerid }).populate("clientid").populate("projectid").lean()
    if (!clients)
        return res.status(400).send("clients not found")

    const uniqueArray = [...new Set(clients)];
    res.json(uniqueArray)
}

const addImage = async (req, res) => {
    const { id, imageURL } = req.body
    if (!id || !imageURL) {
        return res.status(400).send("id imageURL are required")
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).send("user not found")
    }
    user.imageURL = imageURL
    const newUser = await user.save()
    if (!newUser) {
        return res.status(400).send("newUser not updated")
    }
    res.json(newUser)
}

module.exports = {changePassword, addImage,addManager, addClient, getUser, getClient, getProjectClients, updateUser, deleteClient, getManagerClients ,getClientManagers}