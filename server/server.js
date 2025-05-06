require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const http = require('http');
const socketIo = require('socket.io');
const PORT = process.env.PORT || 2004;
const app = express();
connectDB();

const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", require("./routes/user"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/login", require("./routes/login"));
app.use("/api/projects", require("./routes/project"));
app.use('/api/email', require("./routes/emailRoutes"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

let messages = [];

io.on('connection', (socket) => {
    
    socket.emit('previousMessages', messages);

    socket.on('sendMessage', (message) => {
        messages.push(message);
        io.emit('newMessage', message); 
    });
    socket.on('disconnect', () => {
    });
});
