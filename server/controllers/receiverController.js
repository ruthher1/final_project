const User = require("../models/User")
const Receiver = require("../models/Receiver")
const Organizer = require("../models/Organizer")

const bcrypt = require('bcrypt')

const addReceiver = async (req, res) => {
    const { name, userid, password, address, phone, organizeruserid, email } = req.body
    if (!name || !userid || !password || !organizeruserid) {
        return res.status(400).send("name userid organizeruserid password are required")
    }
    const useridExists = await User.findOne({ userid: userid }).lean()
    if (useridExists) {
        return res.status(400).send("userid exists")
    }
    const o_user = await User.findOne({userid:organizeruserid}).lean()
    if (!o_user) {
        return res.status(400).send("o_user not found")
    }
    const o_organizer = await Organizer.findOne({useridref:o_user._id.toString()}).lean()
    if (!o_organizer) {
        return res.status(400).send("o_organizer not found")
    }
    const newpass = await bcrypt.hash(password, 10)
    const user = await User.create({ name, userid, role: "receiver", password: newpass })
    if (!user) {
        return res.status(400).send("user not created")
    }
    const useridref = user._id.toString()
    const receiver = await Receiver.create({ address, phone, email, organizerid:o_organizer._id.toString(), useridref })
    if (!receiver) {
        return res.status(400).send("receiver not created")
    }
    const receivers = await Receiver.find({ organizerid: o_organizer._id.toString() }).lean()
    if (!receivers) {
        return res.status(400).send("receivers not found")
    }
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.useridref).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))
    res.json(users)}

const getReceiver = async (req, res) => {
    const { id } = req.params
    const receiver = await Receiver.findById(id).lean()
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }
    const user = await User.findById(receiver.useridref).lean()
    if (!user) {
        return res.status(400).send("user not found")
    }
    res.json({ user, receiver })
}

const getReceivers = async (req, res) => {
    const {userid}= req.params
    const o_user = await User.findOne({ userid: userid }).lean()
    if (!o_user) {
        return res.status(400).send("o_user not found")
    }
    const organizer = await Organizer.findOne({ useridref: o_user._id.toString() }).lean()
    if (!organizer) {
        return res.status(400).send("organizer not found")
    }
    const receivers = await Receiver.find({ organizerid: organizer._id.toString() }).lean();
    if (!receivers)
        return res.status(400).send("receivers not found")
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.useridref).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))

    res.json(users)
}

const updateReceiver = async (req, res) => {
    const { id, name, userid, password, address, phone, email } = req.body
    if (!name || !userid || !password || !id) {
        return res.status(400).send("name and userid and password are required")
    }
    const receiver = await Receiver.findById(id).exec()
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }
    const useridExists = await User.findOne({ userid: userid }).lean()
    if (useridExists && useridExists._id.toString() != receiver.useridref.toString()) {
        return res.status(400).send("userid exists")
    }
    const user = await User.findById(receiver.useridref).exec()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const newpass = await bcrypt.hash(password, 10)
    user.name = name
    user.userid = userid
    user.password = newpass
    receiver.address = address
    receiver.phone = phone
    receiver.email = email
    const newUser = await user.save()
    const newReceiver = await receiver.save()
    const receivers = await Receiver.find({ organizerid: receiver.organizerid }).lean()
    if (!receivers) {
        return res.status(400).send("receivers not found")
    }
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.useridref).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = { receiver, user }
        return obj
    }))
    res.json(users)}

const deleteReceiver = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).send("id is required")
    }
    const receiver = await Receiver.findById(id).exec()
    if (!receiver) {
        return res.status(400).send("receiver not found")
    }
    const user = await User.findById(receiver.useridref).exec()
    if (!user) {
        return res.status(400).send("user not found")
    }
    const resultReceiver = await receiver.deleteOne()
    const resultUser = await user.deleteOne()
    const receivers = await Receiver.find({ organizerid: receiver.organizerid }).lean()
    if (!receivers) {
        return res.status(400).send("receivers not found")
    }
    const users = await Promise.all(receivers.map(async (receiver) => {
        const user = await User.findById(receiver.useridref).lean()
        if (!user) {
            return res.status(400).send("user not found")
        }
        const obj = {receiver, user}
        return obj
    }))

    res.json(users)

}

module.exports = { addReceiver, getReceiver, getReceivers, updateReceiver, deleteReceiver }