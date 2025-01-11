const express=require("express")
const router=express.Router()

const receiverController=require("../controllers/receiverController")
const userJWT =require("../middleware/userJWT")

router.post("/addReceiver",userJWT,receiverController.addReceiver)
router.get("/getReceiver/:id",userJWT,receiverController.getReceiver)
router.get("/getReceivers/:userid",userJWT,receiverController.getReceivers)
router.put("/updateReceiver",userJWT,receiverController.updateReceiver)
router.delete("/deleteReceiver/:id",userJWT,receiverController.deleteReceiver)

module.exports=router