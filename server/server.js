require ("dotenv").config()
const express=require("express")
const cors=require("cors")
const corsOptions=require("./config/corsOptions")
const mongoose=require("mongoose")
const connectDB=require("./config/dbConn")

//
const bodyParser = require("body-parser");
//

const PORT=process.env.PORT || 4000
const app=express()
connectDB()

//
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//


app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/users",require("./routes/user"))
app.use("/api/tasks",require("./routes/task"))
app.use("/api/login",require("./routes/login"))
app.use("/api/projects",require("./routes/project"))


mongoose.connection.once("open",()=>{
    console.log("connected to MongoDB")
    app.listen(PORT,()=>{
    console.log(`Server runing on port ${PORT}`)
})
})


mongoose.connection.on("error",error=>{
    console.log(error)
})
