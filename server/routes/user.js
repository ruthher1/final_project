const express = require("express")
const router = express.Router()
const usersController=require("../controllers/usersController")
const userJWT = require("../middleware/userJWT")

router.post("/addClient",userJWT,usersController.addClient)
router.post("/addManager",usersController.addManager)
router.get("/getClient",userJWT,usersController.getClient)
router.get("/getUser/:id",userJWT,usersController.getUser)
router.get("/getManagerClients/:id",userJWT,usersController.getManagerClients)
router.get("/getProjectClients/:projectid/:managerid",userJWT,usersController.getProjectClients)
router.put("/updateUser",userJWT,usersController.updateUser)
router.put("/addImage",userJWT,usersController.addImage)
router.put("/changePassword",userJWT,usersController.changePassword)
router.get("/getClientManagers/:id",userJWT,usersController.getClientManagers)
router.delete("/deleteClient",userJWT,usersController.deleteClient)


module.exports=router
