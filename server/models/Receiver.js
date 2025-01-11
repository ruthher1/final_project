const mongoose=require("mongoose")
const receiverSchema= new mongoose.Schema({
    organizerid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Organizer'
    },
    useridref:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    
},{
    timestamps:true
})

module.exports=mongoose.model('Receiver',receiverSchema)