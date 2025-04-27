const Project = require("../models/Project")
const ProjectToManager = require("../models/ProjectToManager")
const Connection = require("../models/Connection")
const User = require("../models/User")

const addProject = async (req, res) => {
    const { name, managerid } = req.body
    if (!name || !managerid) {
        return res.status(400).send("name managerid are required")
    }
    let prjectExists = await Project.findOne({ name }).lean()
    if (!prjectExists) {
        prjectExists = await Project.create({ name })
        if (!prjectExists) {
            return res.status(400).send("project not created")
        }
    }
    const manageridExists = await User.findById(managerid).lean()
    if (!manageridExists) {
        return res.status(400).send("managerid not found")
    }
    const projectToManager = await ProjectToManager.create({ managerid, projectid: prjectExists._id })
    if (!projectToManager) {
        return res.status(400).send("projectToManager not created")
    }
    const projects = await ProjectToManager.find({ managerid }).populate("projectid").lean()
    if (!projects) {
        return res.status(400).send("projects not found")
    }
    res.json(projects)
}

const getProjects = async (req, res) => {
    const { id } = req.params
    const projects = await ProjectToManager.find({ managerid: id }).populate("projectid").lean()
    if (!projects) {
        return res.status(400).send("projects not found")
    }
    res.json(projects)
}

const updateProject = async (req, res) => {
    const { id, name, managerid } = req.body
    if (!id || !name) {
        return res.status(400).send("id name are required")
    }
    const project = await Project.findById(id).exec()
    if (!project) {
        return res.status(400).send("project not found")
    }
    project.name = name
    const newProject = await project.save()
    if (!newProject) {
        return res.status(400).send("project not updated")
    }
    const projects = await ProjectToManager.find({ managerid }).populate("projectid").lean()
    if (!projects) {
        return res.status(400).send("projects not found")
    }
    res.json(projects)
}


const deleteProject = async (req, res) => {
    const { managerid, projectid } = req.body
    if (!managerid || !projectid) {
        return res.status(400).send("managerid projectid is required")
    }
    const project = await ProjectToManager.findOne({ projectid, managerid }).exec()
    if (!project) {
        return res.status(400).send("project not found")
    }
    const result = await project.deleteOne()
    if (!result) {
        return res.status(400).send("project not deleted")
    }
    const projectExists = await ProjectToManager.findOne({ projectid }).exec()
    if (!projectExists) {
        const p = await Project.findById(projectid).exec()
        if (!p) {
            return res.status(400).send("p not found")
        }
        const resultproject = await p.deleteOne()
        if (!resultproject) {
            return res.status(400).send("project not deleted")
        }
    }
    const connections = await Connection.find({ projectid, managerid }).exec()
    if (connections) {
        connections.forEach(async (connection) => {
            const result = await connection.deleteOne()
            if (!result) {
                return res.status(400).send("connection not deleted")
            }
            const user = await Connection.findOne({ clientid: connection.clientid }).exec()
            if (!user) {
                const client = await User.findById(connection.clientid).exec()
                if (!client) {
                    return res.status(400).send("client not found")
                }
                const clientDel = await client.deleteOne()
                if (!clientDel) {
                    return res.status(400).send("clientDel not deleted")
                }
            }
        })
    }
    const projects = await ProjectToManager.find({ managerid }).populate("projectid").lean()
    if (!projects) {
        return res.status(400).send("projects not found")
    }
    res.json(projects)
}



module.exports = { addProject, updateProject, deleteProject, getProjects }