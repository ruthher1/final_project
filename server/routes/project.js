const express=require("express")
const router=express.Router()

const projectController=require("../controllers/projectController")
const userJWT =require("../middleware/userJWT")


router.post("/addProject",userJWT,projectController.addProject)
router.get("/getProjects/:id",userJWT,projectController.getProjects)
router.put("/updateProject",userJWT,projectController.updateProject)
router.delete("/deleteProject",userJWT,projectController.deleteProject)

module.exports=router