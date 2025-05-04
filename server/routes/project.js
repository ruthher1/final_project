const express=require("express")
const router=express.Router()

const projectController=require("../controllers/projectController")
const userJWT =require("../middleware/userJWT")
const managerMiddleware = require("../middleware/managerMiddleware")

router.post("/addProject",userJWT,managerMiddleware,projectController.addProject)
router.get("/getProjects/:id",userJWT,managerMiddleware,projectController.getProjects)
router.put("/updateProject",userJWT,managerMiddleware,projectController.updateProject)
router.delete("/deleteProject",userJWT,managerMiddleware,projectController.deleteProject)

module.exports=router