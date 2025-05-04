const express = require("express")
const router = express.Router()
const usersController=require("../controllers/usersController")
const userJWT = require("../middleware/userJWT")
const managerMiddleware = require("../middleware/managerMiddleware")
const clientMiddleware = require("../middleware/clientMiddleware")

router.post("/addClient",userJWT,managerMiddleware,usersController.addClient)
router.post("/addManager",usersController.addManager)
router.get("/getClient",userJWT,managerMiddleware,usersController.getClient)
router.get("/getUser/:id",userJWT,usersController.getUser)
router.get("/getManagerClients/:id",userJWT,managerMiddleware,usersController.getManagerClients)
router.get("/getProjectClients/:projectid/:managerid",managerMiddleware,userJWT,usersController.getProjectClients)
router.put("/updateUser",userJWT,usersController.updateUser)
router.put("/addImage",userJWT,usersController.addImage)
router.put("/changePassword",userJWT,usersController.changePassword)
router.get("/getClientManagers/:id",userJWT,clientMiddleware,usersController.getClientManagers)
router.delete("/deleteClient",userJWT,managerMiddleware,usersController.deleteClient)


module.exports=router
