const express = require("express")
const router = express.Router()
const usersController=require("../controllers/usersController")
const userJWT = require("../middleware/userJWT")

router.post("/addClient",userJWT,usersController.addClient)
router.post("/addManager",usersController.addManager)
router.get("/getClient",userJWT,usersController.getClient)
router.get("/getManager/:id",userJWT,usersController.getManager)
router.get("/getManagerClients/:id",userJWT,usersController.getManagerClients)
router.get("/getProjectClients/:projectid/:managerid",userJWT,usersController.getProjectClients)
router.put("/updateUser",userJWT,usersController.updateUser)
router.put("/addImage",userJWT,usersController.addImage)
router.delete("/deleteClient",userJWT,usersController.deleteClient)

module.exports=router
