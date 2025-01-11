const mongoose=require("mongoose")
const organizerSchema= new mongoose.Schema({
    address:{
        type:String,
    },
    profession:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
    },
    useridref:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
},{
    timestamps:true
})

module.exports=mongoose.model('Organizer',organizerSchema)