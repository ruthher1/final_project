const User = require("../models/User")
const Organizer = require("../models/Organizer")
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')

const addOrganizer = async (req, res) => {
    console.log("aaaaaaaaaaaaa")
    const { name, userid, password, address, phone, email,profession } = req.body
    if (!name || !userid || !password || !email) {
        return res.status(400).send("name and userid and email and password are required")
    }
    const useridExists = await User.findOne({ userid: userid }).lean()
    if (useridExists) {
        return res.status(400).send("userid exists")
    }
    const newpass = await bcrypt.hash(password, 10)
    const user = await User.create({ name, userid, password:newpass,role:"organizer",})
    if (!user) {
        return res.status(400).send("user not created")
    }
    const useridref = user._id
    const organizer = await Organizer.create({ email, address, phone, useridref ,profession})
    if (!organizer) {
        return res.status(400).send("organizer not created")
    }
    const newuser= {_id:user._id,name:user.name,userid:user.userid,}
    const accessToken=jwt.sign(newuser,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken,role:user.role})
}


const updateOrganizer = async (req, res) => {
    const { id, name, userid, password, address, phone, email,profession } = req.body
    if (!name || !userid || !password || !email || !id) {
        return res.status(400).send("name and userid and email and password are required")
    }
    const organizer = await Organizer.findById(id).exec()
    if (!organizer) {
        return res.status(400).send("organizer not found")
    }
    const useridExists = await User.findOne({ userid: userid }).lean()
    if (useridExists && useridExists._id.toString() != organizer.useridref.toString()) {
        return res.status(400).send("userid exists")
    }
    
    const user = await User.findById(organizer.useridref).exec()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const newpass = await bcrypt.hash(password, 10)
    user.name = name
    user.userid = userid
    user.password = newpass
    organizer.email = email
    organizer.address = address
    organizer.phone = phone
    organizer.profession=profession
    const newUser = await user.save()
    const newOrganizer = await organizer.save()
    res.send("organizer updated")
}

const getOrganizer=async(req,res)=>{
    const { userid } = req.params
    const user = await User.findOne({userid:userid}).lean()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const organizer = await Organizer.findOne({useridref:user._id}).lean()
    if (!organizer) {
        return res.status(400).send("organizer not found")
    }
    res.json({ user, organizer })

}

module.exports = { addOrganizer, updateOrganizer,getOrganizer}