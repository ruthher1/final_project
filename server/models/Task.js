const mongoose=require("mongoose")
const taskSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:['קל','בינוני ','קשה'],
    },
    comment:{
        type:String,
    },
    description:{
        type:String,
    },
    completed:{
        type:Boolean,
        default:false

    },
    receiverid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Kid',
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
},{
    timestamps:true
})

module.exports=mongoose.model('Task',taskSchema)