const express=require("express")
const router=express.Router()

const taskController=require("../controllers/taskController")
const userJWT =require("../middleware/userJWT")
const upload = require('../middleware/upload')
const managerMiddleware = require("../middleware/managerMiddleware")
const clientMiddleware = require("../middleware/clientMiddleware")

router.post("/addTask",userJWT,managerMiddleware, upload.single('file'),taskController.addTask)
// router.get("/getTask/:id",userJWT,taskController.getTask)
router.get("/getTasksClient/:managerid/:projectid/:clientid",userJWT,managerMiddleware,taskController.getTasksClient)
router.put("/updateTask",userJWT,managerMiddleware, upload.single('file'),taskController.updateTask)
router.put("/completeTask",userJWT,clientMiddleware,taskController.completeTask)
router.delete("/deleteTask/:id",userJWT,managerMiddleware, upload.single('file'),taskController.deleteTask)
router.get("/getTasks/:clientid",userJWT,clientMiddleware,taskController.getTasks)



module.exports=router