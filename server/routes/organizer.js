const express=require("express")
const router=express.Router()

const organizerController=require("../controllers/organizerController")
const userJWT =require("../middleware/userJWT")

router.get("/getOrganizer/:userid",userJWT,organizerController.getOrganizer)
router.post("/addOrganizer",organizerController.addOrganizer)
router.put("/updateOrganizer",userJWT,organizerController.updateOrganizer)


module.exports=router