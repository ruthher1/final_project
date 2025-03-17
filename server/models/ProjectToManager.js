const mongoose=require("mongoose")
const managertoprojectSchema= new mongoose.Schema({
    managerid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    projectid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Project'
    },
    
    
},{
    timestamps:true
})

module.exports=mongoose.model('ManagerToProject',managertoprojectSchema)