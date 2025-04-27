const express=require("express")
const router=express.Router()

const taskController=require("../controllers/taskController")
const userJWT =require("../middleware/userJWT")
const upload = require('../middleware/upload')


router.post("/addTask",userJWT, upload.single('file'),taskController.addTask)
router.get("/getTask/:id",userJWT,taskController.getTask)
router.get("/getTasksManager",userJWT,taskController.getTasksManager)
router.get("/getTasksClient/:managerid/:projectid/:clientid",userJWT,taskController.getTasksClient)
router.put("/updateTask",userJWT, upload.single('file'),taskController.updateTask)
router.put("/completeTask",userJWT,taskController.completeTask)
router.delete("/deleteTask/:id", upload.single('file'),userJWT,taskController.deleteTask)
router.get("/getTasks/:clientid",userJWT,taskController.getTasks)



module.exports=router