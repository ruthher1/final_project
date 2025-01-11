const User=require("../models/User")
// const Organizer=require("../models/Organizer")
//const Receiver=require("../models/Receiver")

const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')

const login=async(req,res)=>{
    const {userid,password}=req.body
    if(!userid || !password )
        return res.status(400).send("userid password are required")
    const useridExists=await User.findOne({userid:userid}).lean()
    if(!useridExists)
        return res.status(400).send("userid doesn't exists")
    const match = await bcrypt.compare(password, useridExists.password)    
    if(!match)
        return res.status(400).send("password not correct")
    const newuser= {_id:useridExists._id,name:useridExists.name,userid:useridExists.userid,}
    const accessToken=jwt.sign(newuser,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken,role:useridExists.role})
    }


module.exports={login}
