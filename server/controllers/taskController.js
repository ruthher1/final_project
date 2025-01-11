const Task=require("../models/Task")
const Receiver = require("../models/Receiver")

const addTask=async (req,res)=>{
    const {title,description,receiverid,amount,date}=req.body
    if(!title || !receiverid ||!amount||!date)
        {
            return res.status(400).send("title receiverid amount date are required")
        }
        const receiver = await Receiver.findById(receiverid).lean()
        if (!receiver) {
            return res.status(400).send("receiver not found")
        }
        const task=await Task.create({title,receiverid,description,amount,date})
        const tasks=await Task.find({date:date}).lean()
        if(!tasks){
            return res.status(400).send("tasks not found")
        }
        res.json(tasks)
}

const getTask=async (req,res)=>{
    const {id}=req.params
    const task=await Task.findById(id).lean()
    if(!task)
        {
            return res.status(400).send("task not found")
        }
    res.json(task)
}

const getTasks=async (req,res)=>{
    const {date,receiverid}=req.body
    if(!date||!receiverid){
        return res.status(400).send("date receiverid are required")
    }
    const tasks=await Task.find({receiverid,date}).lean()
    if(!tasks)
        {
            return res.status(400).send("tasks not found")
        }
    res.json(tasks)
}

const updateTask=async (req,res)=>{
    const {id,title,description,amount,date}=req.body
    if(!title || !id ||!amount||!date){
            return res.status(400).send("title and id and amount and date are required")
    }
    const task=await Task.findById(id).exec()
    if(!task){
            return res.status(400).send("task not found")
        }
        task.title=title
        task.description=description
        task.amount=amount
        task.date=date
        console.log(task)
      const newTask= await task.save()
      console.log(newTask)

      const tasks=await Task.find({receiverid:task.receiverid,date}).lean()
      if(!tasks){
          return res.status(400).send("tasks not found")
      }
      res.json(tasks)
}

const completeTask=async (req,res)=>{
    const {id,completed,difficulty,comment}=req.body
    if(!id || !completed,!difficulty ){
            return res.status(400).send("compleated difficulty id are required")
    }
    const task=await Task.findById(id).exec()
    if(!task){
            return res.status(400).send("task not found")
        }
        task.completed=completed
        task.difficulty=difficulty
        task.comment=comment
      const newTask= await task.save()
      const tasks=await Task.find({receiverid:task.receiverid,date:task.date}).lean()
      if(!tasks){
          return res.status(400).send("tasks not found")
      }
      res.json(tasks)
}

const deleteTask=async (req,res)=>{
    const {id}=req.params
    if(!id)
        {
            return res.status(400).send("id is required")
        }

    const task=await Task.findById(id).exec()
    if(!task)
        {
            return res.status(400).send("task not found")
        }
      const result = await task.deleteOne()
      const tasks=await Task.find({date:task.date,receiverid:task.receiverid}).lean()
      if(!tasks){
          return res.status(400).send("tasks not found")
      }
      res.json(tasks)
}

module.exports={addTask,getTask,getTasks,updateTask,deleteTask,completeTask}