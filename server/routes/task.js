const express=require("express")
const router=express.Router()

const taskController=require("../controllers/taskController")
const userJWT =require("../middleware/userJWT")


router.post("/addTask",userJWT,taskController.addTask)
router.get("/getTask/:id",userJWT,taskController.getTask)
router.get("/getTasks",userJWT,taskController.getTasks)
router.put("/updateTask",userJWT,taskController.updateTask)
router.put("/completeTask",userJWT,taskController.completeTask)
router.delete("/deleteTask/:id",userJWT,taskController.deleteTask)

module.exports=router